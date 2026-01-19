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
  artist: "אמן", // Exact field name from Airtable
  location: "מקום המופע", // Exact field name from Airtable
  publish: "עלה לאתר",
  ticketsUrl: "קישור לרכישת כרטיסים",
} as const;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function toIsoDateString(v: unknown): string | null {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:31',message:'toIsoDateString called',data:{v,vType:typeof v,isString:typeof v==='string',isArray:Array.isArray(v),isObject:typeof v==='object'&&v!==null&&!Array.isArray(v)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  // Handle Date objects directly
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return null;
    return v.toISOString();
  }

  // Handle string dates
  if (!isNonEmptyString(v)) {
    // #region agent log
    if (v !== null && v !== undefined) {
      fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:40',message:'Date not string or Date object',data:{v,vType:typeof v,stringified:String(v)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    // #endregion
    return null;
  }
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:47',message:'Invalid date string',data:{v,parsed:new Date(v).toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return null;
  }
  return d.toISOString();
}

function getEnv(name: string): string | null {
  const v = process.env[name];
  if (!v || !v.trim()) return null;
  return v.trim();
}

export default async function handler(req: any, res: any) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:44',message:'API handler called',data:{method:req.method},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

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

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:55',message:'Env vars loaded',data:{hasToken:!!token,hasBaseId:!!baseId,hasTable:!!tableIdOrName,hasViewName:!!viewName,viewName:viewName},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:96',message:'Airtable response received',data:{status:airtableRes.status,ok:airtableRes.ok,bodyLength:bodyText.length,url:url.toString()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

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

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:112',message:'Airtable data parsed',data:{totalRecords:data.records?.length||0,firstRecordFields:data.records?.[0]?.fields?Object.keys(data.records[0].fields):null,fieldDate:fieldDate,fieldArtist:fieldArtist,fieldLocation:fieldLocation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion

    const shows: NormalizedShow[] = (data.records || [])
      .map((r, idx) => {
        const fields = r.fields || {};
        const rawDate = fields[fieldDate];
        const rawArtist = fields[fieldArtist];
        const rawLocation = fields[fieldLocation];
        const dateIso = toIsoDateString(rawDate);
        const artist = isNonEmptyString(rawArtist) ? rawArtist.trim() : "";
        const location = isNonEmptyString(rawLocation) ? rawLocation.trim() : "";
        const ticketsUrl = isNonEmptyString(fields[fieldTicketsUrl]) ? fields[fieldTicketsUrl].trim() : undefined;

        // #region agent log
        if (idx === 0) {
          fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:122',message:'First record mapping',data:{rawDate,rawDateType:typeof rawDate,dateIso,rawArtist,rawArtistType:typeof rawArtist,artist,rawLocation,rawLocationType:typeof rawLocation,location,willInclude:!!(dateIso && artist && location)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        }
        // #endregion

        if (!dateIso || !artist || !location) {
          // #region agent log
          if (idx < 3) {
            fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:130',message:'Record filtered out',data:{idx,hasDate:!!dateIso,hasArtist:!!artist,hasLocation:!!location,rawDate,rawArtist,rawLocation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          }
          // #endregion
          return null;
        }
        return { date: dateIso, artist, location, ticketsUrl };
      })
      .filter(Boolean) as NormalizedShow[];

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/004958b9-08d1-47da-aa9a-7c8783b1ed05',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/upcoming-shows.ts:138',message:'Shows array created',data:{totalRecords:data.records?.length||0,showsCount:shows.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

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

