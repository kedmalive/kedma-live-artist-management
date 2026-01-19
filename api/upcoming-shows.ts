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
  artist: "אמן",
  location: "מקום המופע",
  publish: "עלה לאתר",
  ticketsUrl: "קישור לרכישת כרטיסים",
} as const;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function toIsoDateString(v: unknown): string | null {
  if (!isNonEmptyString(v)) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
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

    const shows: NormalizedShow[] = (data.records || [])
      .map((r) => {
        const fields = r.fields || {};
        const dateIso = toIsoDateString(fields[fieldDate]);
        const artist = isNonEmptyString(fields[fieldArtist]) ? fields[fieldArtist].trim() : "";
        const location = isNonEmptyString(fields[fieldLocation]) ? fields[fieldLocation].trim() : "";
        const ticketsUrl = isNonEmptyString(fields[fieldTicketsUrl]) ? fields[fieldTicketsUrl].trim() : undefined;

        if (!dateIso || !artist || !location) return null;
        return { date: dateIso, artist, location, ticketsUrl };
      })
      .filter(Boolean) as NormalizedShow[];

    // The Airtable view is already sorted, but we defensively sort as well.
    shows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.end(JSON.stringify({ shows }));
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

