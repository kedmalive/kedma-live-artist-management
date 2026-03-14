// Step 1: Basic API function - just fetch and return raw Airtable data
// This will help us debug what's actually coming from Airtable

type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

function getEnv(name: string): string | null {
  const v = process.env[name];
  if (!v || !v.trim()) return null;
  return v.trim();
}

export default async function handler(req: any, res: any) {
  // Log: API called
  console.log('[API] Handler called, method:', req.method);

  if (req.method && req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  // Step 1: Check environment variables
  const token = getEnv("AIRTABLE_API_TOKEN");
  const baseId = getEnv("AIRTABLE_BASE_ID");
  const tableIdOrName = getEnv("AIRTABLE_TABLE_ID_OR_NAME") ?? getEnv("AIRTABLE_TABLE_NAME");
  const viewName = getEnv("AIRTABLE_VIEW_NAME");

  console.log('[API] Environment check:', {
    hasToken: !!token,
    hasBaseId: !!baseId,
    hasTable: !!tableIdOrName,
    hasViewName: !!viewName,
  });

  if (!token || !baseId || !tableIdOrName || !viewName) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const missing = [
      !token ? "AIRTABLE_API_TOKEN" : null,
      !baseId ? "AIRTABLE_BASE_ID" : null,
      !tableIdOrName ? "AIRTABLE_TABLE_ID_OR_NAME (or AIRTABLE_TABLE_NAME)" : null,
      !viewName ? "AIRTABLE_VIEW_NAME" : null,
    ].filter(Boolean);
    
    console.error('[API] Missing environment variables:', missing);
    
    res.end(
      JSON.stringify({
        error: "Missing Airtable configuration",
        missing,
      })
    );
    return;
  }

  try {
    // Step 1: Build URL
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableIdOrName)}`
    );
    url.searchParams.set("view", viewName);
    url.searchParams.set("pageSize", "50");

    console.log('[API] Fetching from Airtable');

    // Step 1: Make request to Airtable
    const airtableRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const bodyText = await airtableRes.text();
    
    console.log('[API] Airtable response:', {
      status: airtableRes.status,
      statusText: airtableRes.statusText,
      ok: airtableRes.ok,
      bodyLength: bodyText.length,
    });

    if (!airtableRes.ok) {
      console.error('[API] Airtable error response:', bodyText.slice(0, 500));
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          error: "Airtable request failed",
          status: airtableRes.status,
          statusText: airtableRes.statusText,
          body: bodyText.slice(0, 2000),
        })
      );
      return;
    }

    // Step 1: Parse response
    const data = JSON.parse(bodyText) as AirtableListResponse;

    console.log('[API] Parsed response:', {
      recordCount: data.records?.length || 0,
      hasOffset: !!data.offset,
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.end(JSON.stringify({
      success: true,
      recordCount: data.records?.length || 0,
      records: data.records || [],
    }));
  } catch (err: any) {
    console.error('[API] Unexpected error:', err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: "Unexpected server error",
        message: err?.message || String(err),
      })
    );
  }
}
