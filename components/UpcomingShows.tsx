import React, { useEffect, useState, useMemo } from 'react';
import { Calendar, MapPin, Ticket, ChevronLeft, ChevronRight } from 'lucide-react';
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

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('he-IL', {
    month: 'long',
    year: 'numeric',
  });
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
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
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const monthStart = getMonthStart(currentMonth);
    const monthEnd = getMonthEnd(currentMonth);
    
    const valid = shows.filter((s) => {
      if (!s || typeof s.date !== 'string' || typeof s.artist !== 'string' || typeof s.location !== 'string') {
        return false;
      }
      
      const showDate = new Date(s.date);
      if (Number.isNaN(showDate.getTime())) return false;
      
      // Remove past dates
      if (showDate < now) return false;
      
      // Filter by current month
      return showDate >= monthStart && showDate <= monthEnd;
    });
    
    valid.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return valid;
  }, [shows, currentMonth]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === 'next') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return newDate;
    });
  };

  return (
    <section id="upcoming-shows" className="py-32 bg-[#050505] relative overflow-hidden border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-2 bg-[#A8D5BA]" />
              <h2 className="text-6xl md:text-[6rem] font-black text-white leading-none tracking-tighter uppercase italic">
                Upcoming
              </h2>
            </div>
            <p className="text-gray-400 text-2xl max-w-3xl font-bold">
              הופעות קרובות של אמני קדמא לייב
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigateMonth('prev')}
            className="flex items-center gap-3 text-[#A8D5BA] hover:text-white transition-colors font-black text-lg uppercase tracking-tighter group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            חודש קודם
          </button>
          
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              {formatMonthYear(currentMonth)}
            </h3>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="flex items-center gap-3 text-[#A8D5BA] hover:text-white transition-colors font-black text-lg uppercase tracking-tighter group"
          >
            חודש הבא
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
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
            <div className="text-white font-black text-2xl mb-3">
              אין הופעות בחודש {formatMonthYear(currentMonth)}
            </div>
            <div className="text-gray-400 font-medium text-lg">
              {import.meta.env.VITE_UPCOMING_SHOWS_CSV_URL 
                ? 'עדכן את Google Sheets והופעות יופיעו כאן אוטומטית.'
                : 'כדי להוסיף הופעות: הגדר VITE_UPCOMING_SHOWS_CSV_URL ב-Vercel או ערוך את הקובץ data/upcoming-shows.json'}
            </div>
          </div>
        )}

        {visibleShows.length > 0 && (
          <div className="space-y-4">
            {visibleShows.map((show, idx) => (
              <div
                key={`${show.artist}-${show.date}-${idx}`}
                className="group relative bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden hover:border-[#A8D5BA]/40 transition-all hover:bg-black/60"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  {/* Left side - Date and Artist Info */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6 flex-1">
                    {/* Date */}
                    <div className="flex items-center gap-3 text-[#A8D5BA] font-black tracking-wide min-w-[140px]">
                      <Calendar size={24} className="text-[#A8D5BA]" />
                      <span className="text-xl md:text-2xl">{formatShowDate(show.date)}</span>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block w-px h-12 bg-white/10" />

                    {/* Artist and Location */}
                    <div className="space-y-2 flex-1">
                      <div className="text-white text-2xl md:text-3xl font-black tracking-tighter uppercase">
                        {show.artist}
                      </div>
                      <div className="flex items-center gap-3 text-white/80 font-bold text-lg md:text-xl">
                        <MapPin size={20} className="text-[#A8D5BA]" />
                        <span>{show.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Tickets Button */}
                  <div className="flex items-center">
                    {show.ticketsUrl ? (
                      <a
                        href={show.ticketsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-[#A8D5BA] text-black px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-lg hover:bg-white transition-all shadow-[0_0_30px_rgba(168,213,186,0.25)] whitespace-nowrap"
                      >
                        <Ticket size={20} />
                        כרטיסים
                      </a>
                    ) : (
                      <div className="inline-flex items-center gap-3 bg-white/10 text-white/60 px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-lg border border-white/10 whitespace-nowrap">
                        <Ticket size={20} />
                        כרטיסים בקרוב
                      </div>
                    )}
                  </div>
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
