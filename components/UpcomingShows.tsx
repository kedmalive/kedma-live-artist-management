import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import type { UpcomingShow } from '../types';
import showsFromFile from '../data/upcoming-shows.json';

function formatShowDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Parse CSV string to array of objects
function parseCSV(csvText: string): UpcomingShow[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());
  const dateIdx = headers.indexOf('date');
  const artistIdx = headers.indexOf('artist');
  const locationIdx = headers.indexOf('location');
  const ticketsUrlIdx = headers.indexOf('ticketsUrl');
  const publishIdx = headers.indexOf('publish');

  if (dateIdx === -1 || artistIdx === -1 || locationIdx === -1) {
    console.warn('[UpcomingShows] Missing required columns in CSV');
    return [];
  }

  // Parse rows
  const shows: UpcomingShow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted values)
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    // Check publish flag (only show if TRUE)
    const publish = values[publishIdx]?.toUpperCase() === 'TRUE';
    if (!publish) continue;

    const date = values[dateIdx]?.trim();
    const artist = values[artistIdx]?.trim();
    const location = values[locationIdx]?.trim();
    const ticketsUrl = values[ticketsUrlIdx]?.trim() || undefined;

    if (date && artist && location) {
      shows.push({ date, artist, location, ticketsUrl });
    }
  }

  return shows;
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

        // Try to fetch from Google Sheets CSV if URL is configured
        const csvUrl = import.meta.env.VITE_UPCOMING_SHOWS_CSV_URL;
        
        if (csvUrl && typeof csvUrl === 'string' && csvUrl.trim()) {
          console.log('[UpcomingShows] Fetching from Google Sheets CSV:', csvUrl);
          
          const res = await fetch(csvUrl, { 
            method: 'GET',
            cache: 'no-cache', // Always fetch fresh data
          });

          if (!res.ok) {
            throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
          }

          const csvText = await res.text();
          const parsedShows = parseCSV(csvText);
          
          if (!cancelled) {
            setShows(parsedShows);
            console.log('[UpcomingShows] Loaded', parsedShows.length, 'shows from Google Sheets');
          }
        } else {
          // Fallback to local JSON file
          console.log('[UpcomingShows] Using fallback JSON file (no CSV URL configured)');
          const list = Array.isArray(showsFromFile) ? showsFromFile : [];
          const valid = list.filter(
            (s) => s && typeof s.date === 'string' && typeof s.artist === 'string' && typeof s.location === 'string'
          );
          
          if (!cancelled) {
            setShows(valid);
          }
        }
      } catch (e: any) {
        console.error('[UpcomingShows] Error loading shows:', e);
        
        // Fallback to local JSON on error
        try {
          const list = Array.isArray(showsFromFile) ? showsFromFile : [];
          const valid = list.filter(
            (s) => s && typeof s.date === 'string' && typeof s.artist === 'string' && typeof s.location === 'string'
          );
          
          if (!cancelled) {
            setShows(valid);
            console.log('[UpcomingShows] Using fallback JSON after error');
          }
        } catch (fallbackError) {
          if (!cancelled) {
            setError(e?.message || 'שגיאה בטעינת ההופעות');
          }
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
    const valid = shows.filter(
      (s) => s && typeof s.date === 'string' && typeof s.artist === 'string' && typeof s.location === 'string'
    );
    valid.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return valid.slice(0, 12);
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
            <div className="text-white font-black text-2xl mb-3">טוען הופעות...</div>
            <div className="text-gray-400 font-medium text-lg animate-pulse">מעדכן מ-Google Sheets...</div>
          </div>
        )}

        {!loading && error && (
          <div className="glass rounded-[2rem] p-10 border border-red-500/20">
            <div className="text-red-400 font-black text-2xl mb-3">שגיאה בטעינת ההופעות</div>
            <div className="text-gray-400 font-medium text-lg break-words">{error}</div>
            <div className="mt-4 text-xs text-gray-500">
              האתר משתמש בגיבוי מקומי. בדוק את הגדרת VITE_UPCOMING_SHOWS_CSV_URL ב-Vercel.
            </div>
          </div>
        )}

        {!loading && !error && visibleShows.length === 0 && (
          <div className="glass rounded-[2rem] p-10 border border-white/10">
            <div className="text-white font-black text-2xl mb-3">אין הופעות קרובות כרגע</div>
            <div className="text-gray-400 font-medium text-lg">
              {import.meta.env.VITE_UPCOMING_SHOWS_CSV_URL 
                ? 'עדכן את Google Sheets והופעות יופיעו כאן אוטומטית.'
                : 'כדי להוסיף הופעות: הגדר VITE_UPCOMING_SHOWS_CSV_URL ב-Vercel או ערוך את הקובץ data/upcoming-shows.json'}
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
