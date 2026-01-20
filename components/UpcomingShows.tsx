import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { UpcomingShow } from '../types';

function formatShowDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

type ApiResponse = {
  success: boolean;
  recordCount: number;
  records: Array<{
    id: string;
    createdTime: string;
    fields: Record<string, unknown>;
  }>;
  debug?: {
    firstRecordFields: string[] | null;
  };
};

const UpcomingShows: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[Frontend] Fetching from /api/upcoming-shows');

        const res = await fetch('/api/upcoming-shows', { method: 'GET' });
        console.log('[Frontend] Response status:', res.status, res.statusText);

        if (!res.ok) {
          const text = await res.text();
          console.error('[Frontend] API error:', text.slice(0, 500));
          throw new Error(`API error (${res.status}): ${text.slice(0, 200)}`);
        }

        const data = (await res.json()) as ApiResponse;
        console.log('[Frontend] Data received:', {
          success: data.success,
          recordCount: data.recordCount,
          hasRecords: !!data.records && data.records.length > 0,
          firstRecordFields: data.debug?.firstRecordFields,
        });

        if (!cancelled) {
          setApiData(data);
        }
      } catch (e: any) {
        console.error('[Frontend] Error:', e);
        if (!cancelled) {
          setError(e?.message || 'שגיאה בטעינת ההופעות');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // For now, just show debug info - we'll process data in later steps
  const visibleShows = useMemo(() => {
    // Step 1: Just return empty array for now - we're debugging the API connection
    return [];
  }, [apiData]);

  return (
    <section id="upcoming-shows" className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-2 bg-amber-500" />
              <h2 className="text-6xl md:text-[6rem] font-black text-white leading-none tracking-tighter uppercase italic">
                Upcoming
              </h2>
            </div>
            <p className="text-gray-400 text-2xl max-w-3xl font-bold">
              הופעות קרובות של אמני קדמא לייב
            </p>
          </div>
        </div>

        {loading && (
          <div className="glass rounded-[2rem] p-10 border border-white/10">
            <div className="text-white font-black text-2xl mb-3">טוען נתונים מ-Airtable...</div>
            <div className="text-gray-400 font-medium text-lg">בודק חיבור ל-API...</div>
          </div>
        )}

        {!loading && error && (
          <div className="glass rounded-[2rem] p-10 border border-red-500/20">
            <div className="text-red-400 font-black text-2xl mb-3">שגיאה בטעינת הנתונים</div>
            <div className="text-gray-400 font-medium text-lg break-words">{error}</div>
            <div className="mt-4 text-xs text-gray-500">
              בדוק את ה-Vercel Function Logs כדי לראות מה קרה.
            </div>
          </div>
        )}

        {!loading && !error && apiData && (
          <div className="glass rounded-[2rem] p-10 border border-white/10">
            <div className="text-white font-black text-2xl mb-3">
              שלב 1: בדיקת חיבור בסיסי - הצלח!
            </div>
            <div className="text-gray-400 font-medium text-lg space-y-2">
              <div>✅ חיבור ל-Airtable עובד</div>
              <div>📊 מספר רשומות: {apiData.recordCount}</div>
              {apiData.debug?.firstRecordFields && (
                <div className="mt-4">
                  <div className="text-white font-bold mb-2">שמות השדות מהרשומה הראשונה:</div>
                  <div className="bg-black/50 p-4 rounded-lg font-mono text-sm">
                    {apiData.debug.firstRecordFields.map((field, idx) => (
                      <div key={idx} className="text-amber-400">• {field}</div>
                    ))}
                  </div>
                </div>
              )}
              {apiData.records && apiData.records.length > 0 && (
                <div className="mt-4">
                  <div className="text-white font-bold mb-2">תוכן הרשומה הראשונה (raw):</div>
                  <pre className="bg-black/50 p-4 rounded-lg text-xs overflow-auto max-h-96 text-gray-300">
                    {JSON.stringify(apiData.records[0].fields, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !error && !apiData && (
          <div className="glass rounded-[2rem] p-10 border border-white/10">
            <div className="text-white font-black text-2xl mb-3">אין הופעות קרובות כרגע</div>
            <div className="text-gray-400 font-medium text-lg">
              לא התקבלו נתונים מ-Airtable.
            </div>
          </div>
        )}

        {visibleShows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {visibleShows.map((show, idx) => (
              <div
                key={`${show.artist}-${show.date}-${idx}`}
                className="group relative bg-black/60 border border-white/10 rounded-[2rem] p-8 overflow-hidden hover:border-amber-500/40 transition-all"
              >
                <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center gap-3 text-amber-500 font-black tracking-wide">
                    <Calendar size={20} />
                    <span className="text-lg">{formatShowDate(show.date)}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-white text-3xl font-black tracking-tighter">{show.artist}</div>
                    <div className="flex items-center gap-3 text-white/80 font-bold text-xl">
                      <MapPin size={20} className="text-white/60" />
                      <span>{show.location}</span>
                    </div>
                  </div>

                  {show.ticketsUrl ? (
                    <a
                      href={show.ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-amber-500 text-black px-7 py-4 rounded-full font-black text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(245,158,11,0.25)]"
                    >
                      <Ticket size={20} />
                      כרטיסים
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-3 bg-white/10 text-white/60 px-7 py-4 rounded-full font-black text-lg border border-white/10">
                      <Ticket size={20} />
                      כרטיסים בקרוב
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingShows;
