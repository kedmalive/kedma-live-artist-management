type AirtableRecord = {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

type NormalizedShow = {
  date: string; // ISO string
  artist: string;
  location: string;
  ticketsUrl?: string;
};

const DEFAULT_FIELDS = {
  date: "תאריך המופע",
  artist: "אמן =", // Note: Airtable field name includes " ="
  location: "מקום המופע A", // Note: Airtable field name includes " A"
  publish: "עלה לאתר",
  ticketsUrl: "קישור לרכישת כרטיסים",
} as const;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function toIsoDateString(v: unknown): string | null {
  if (!v) return null;
  // Handle string dates
  if (isNonEmptyString(v)) {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return null;
    return d.toISOString();
  }
  // Handle Date objects
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    return v.toISOString();
  }
  return null;
}

function extractStringValue(v: unknown): string {
  if (isNonEmptyString(v)) return v.trim();
  if (Array.isArray(v) && v.length > 0) {
    // Handle linked records or arrays - take first element
    return extractStringValue(v[0]);
  }
  if (typeof v === 'object' && v !== null) {
    // Try common object patterns from Airtable
    if ('name' in v && isNonEmptyString(v.name)) return v.name.trim();
    if ('value' in v && isNonEmptyString(v.value)) return v.value.trim();
    if ('text' in v && isNonEmptyString(v.text)) return v.text.trim();
    // Last resort: stringify
    const str = String(v);
    return str !== '[object Object]' ? str.trim() : '';
  }
  return String(v || '').trim();
}

function getEnv(name: string): string | null {
  const v = process.env[name];
  if (!v || !v.trim()) return null;
  return v.trim();
}

export default async function handler(req: any, res: any) {
  if (req.method && req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ error: "Method Not Allowed" }));
    return;
  }

  const token = getEnv("AIRTABLE_API_TOKEN");
  const baseId = getEnv("AIRTABLE_BASE_ID");
  const tableIdOrName = getEnv("AIRTABLE_TABLE_ID_OR_NAME") ?? getEnv("AIRTABLE_TABLE_NAME");
  const viewName = getEnv("AIRTABLE_VIEW_NAME");

  // Optional overrides (in case field names change later)
  const fieldDate = getEnv("AIRTABLE_FIELD_DATE") ?? DEFAULT_FIELDS.date;
  const fieldArtist = getEnv("AIRTABLE_FIELD_ARTIST") ?? DEFAULT_FIELDS.artist;
  const fieldLocation = getEnv("AIRTABLE_FIELD_LOCATION") ?? DEFAULT_FIELDS.location;
  const fieldTicketsUrl = getEnv("AIRTABLE_FIELD_TICKETS_URL") ?? DEFAULT_FIELDS.ticketsUrl;

  if (!token || !baseId || !tableIdOrName || !viewName) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: "Missing Airtable configuration",
        missing: [
          !token ? "AIRTABLE_API_TOKEN" : null,
          !baseId ? "AIRTABLE_BASE_ID" : null,
          !tableIdOrName ? "AIRTABLE_TABLE_ID_OR_NAME (or AIRTABLE_TABLE_NAME)" : null,
          !viewName ? "AIRTABLE_VIEW_NAME" : null,
        ].filter(Boolean),
      })
    );
    return;
  }

  try {
    const url = new URL(
      `https://api.airtable.com/v0/${encodeURIComponent(baseId)}/${encodeURIComponent(tableIdOrName)}`
    );
    url.searchParams.set("view", viewName);
    url.searchParams.set("pageSize", "50");
    // Limit fields returned (faster + safer)
    url.searchParams.append("fields[]", fieldDate);
    url.searchParams.append("fields[]", fieldArtist);
    url.searchParams.append("fields[]", fieldLocation);
    url.searchParams.append("fields[]", fieldTicketsUrl);

    const airtableRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const bodyText = await airtableRes.text();
    if (!airtableRes.ok) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(
        JSON.stringify({
          error: "Airtable request failed",
          status: airtableRes.status,
          body: bodyText.slice(0, 2000),
        })
      );
      return;
    }

    const data = JSON.parse(bodyText) as AirtableListResponse;

    // Debug: log first record structure (temporary)
    const debugInfo = data.records?.[0] ? {
      recordId: data.records[0].id,
      allFieldNames: Object.keys(data.records[0].fields || {}),
      dateFieldValue: data.records[0].fields[fieldDate],
      artistFieldValue: data.records[0].fields[fieldArtist],
      locationFieldValue: data.records[0].fields[fieldLocation],
      dateFieldType: typeof data.records[0].fields[fieldDate],
      artistFieldType: typeof data.records[0].fields[fieldArtist],
      locationFieldType: typeof data.records[0].fields[fieldLocation],
    } : null;

    const shows: NormalizedShow[] = (data.records || [])
      .map((r) => {
        const fields = r.fields || {};
        const dateIso = toIsoDateString(fields[fieldDate]);
        const artist = extractStringValue(fields[fieldArtist]);
        const location = extractStringValue(fields[fieldLocation]);
        const ticketsUrl = extractStringValue(fields[fieldTicketsUrl]) || undefined;

        if (!dateIso || !artist || !location) return null;
        return { date: dateIso, artist, location, ticketsUrl };
      })
      .filter(Boolean) as NormalizedShow[];

    // The Airtable view is already sorted, but we defensively sort as well.
    shows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    // Include debug info temporarily to diagnose the issue
    res.end(JSON.stringify({ 
      shows, 
      _debug: {
        totalRecords: data.records?.length || 0,
        showsFound: shows.length,
        firstRecord: debugInfo,
      }
    }));
  } catch (err: any) {
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

