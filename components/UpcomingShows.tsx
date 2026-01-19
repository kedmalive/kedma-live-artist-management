import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { UpcomingShow } from '../types';

type ApiResponse = {
  shows: UpcomingShow[];
};

function formatShowDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const UpcomingShows: React.FC = () => {
  const [shows, setShows] = useState<UpcomingShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/upcoming-shows', { method: 'GET' });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error (${res.status}): ${text.slice(0, 200)}`);
        }

        const data = (await res.json()) as ApiResponse;
        if (!cancelled) {
          setShows(Array.isArray(data.shows) ? data.shows : []);
        }
      } catch (e: any) {
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

  const visibleShows = useMemo(() => {
    // Keep the UI tight; Airtable view is already sorted by date.
    return shows.slice(0, 12);
  }, [shows]);

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
            <div className="animate-pulse space-y-6">
              <div className="h-6 w-56 bg-white/10 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <div className="h-5 w-40 bg-white/10 rounded" />
                    <div className="h-5 w-56 bg-white/10 rounded" />
                    <div className="h-10 w-28 bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="glass rounded-[2rem] p-10 border border-white/10">
            <div className="text-white font-black text-2xl mb-3">לא הצלחנו לטעון הופעות כרגע</div>
            <div className="text-gray-400 font-medium text-lg break-words">{error}</div>
          </div>
        )}

        {!loading && !error && visibleShows.length === 0 && (
          <div className="glass rounded-[2rem] p-10 border border-white/10">
            <div className="text-white font-black text-2xl mb-3">אין הופעות קרובות כרגע</div>
            <div className="text-gray-400 font-medium text-lg">
              ברגע שתוסיף הופעות ל‑View באיירטייבל ותסמן “עלה לאתר” — הן יופיעו כאן.
            </div>
          </div>
        )}

        {!loading && !error && visibleShows.length > 0 && (
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

