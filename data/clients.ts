/**
 * Client logos: place PNG/SVG files in public/logos/ with the same slug (e.g. beer-sheva.png).
 * If a file is missing, the client name is shown as fallback.
 */
export type ClientCategory = 'municipalities' | 'tech' | 'production' | 'banks' | 'other';

export interface Client {
  name: string;
  slug: string;
  category: ClientCategory;
}

export const CLIENT_CATEGORIES: { id: ClientCategory; label: string }[] = [
  { id: 'municipalities', label: 'עיריות' },
  { id: 'tech', label: 'חברות הייטק' },
  { id: 'production', label: 'חברות הפקה' },
  { id: 'banks', label: 'בנקים' },
  { id: 'other', label: 'חברות נוספות' },
];

export const CLIENTS_DATA: Client[] = [
  // עיריות
  { name: 'באר שבע', slug: 'beer-sheva', category: 'municipalities' },
  { name: 'תל אביב', slug: 'tel-aviv', category: 'municipalities' },
  { name: 'פתח תקווה', slug: 'petah-tikva', category: 'municipalities' },
  { name: 'חיפה', slug: 'haifa', category: 'municipalities' },
  { name: 'להבים', slug: 'lehavim', category: 'municipalities' },
  { name: 'מיתר', slug: 'meitar', category: 'municipalities' },
  { name: 'בת ים', slug: 'bat-yam', category: 'municipalities' },
  { name: 'ירושלים', slug: 'jerusalem', category: 'municipalities' },
  { name: 'נוף הגליל', slug: 'nof-hagalil', category: 'municipalities' },
  { name: 'ירוחם', slug: 'yeruham', category: 'municipalities' },
  { name: 'דימונה', slug: 'dimona', category: 'municipalities' },
  { name: 'נס ציונה', slug: 'nes-ziona', category: 'municipalities' },
  // חברות הייטק
  { name: 'מיקרוסופט', slug: 'microsoft', category: 'tech' },
  { name: 'פייסבוק', slug: 'facebook', category: 'tech' },
  { name: 'סופרפליי', slug: 'superfly', category: 'tech' },
  { name: 'פלייטיקה', slug: 'politika', category: 'tech' },
  { name: 'מון אקטיב', slug: 'moon-active', category: 'tech' },
  { name: 'פייבר', slug: 'fiverr', category: 'tech' },
  // חברות הפקה
  { name: 'פרומרקט', slug: 'fromarket', category: 'production' },
  { name: 'בלוסטון', slug: 'bluestone', category: 'production' },
  { name: 'לייב ניישן', slug: 'live-nation', category: 'production' },
  { name: 'סופר פוש', slug: 'super-push', category: 'production' },
  { name: 'פרוצ\'י הפקות', slug: 'prochi', category: 'production' },
  { name: 'האירועים של גיל', slug: 'gil-events', category: 'production' },
  { name: 'מנבטר', slug: 'manbiter', category: 'production' },
  { name: 'אלדן הפקות', slug: 'alden', category: 'production' },
  { name: 'הוכמן ושכטר', slug: 'hochman-shachter', category: 'production' },
  // בנקים
  { name: 'בנק לאומי', slug: 'leumi', category: 'banks' },
  { name: 'בנק הפועלים', slug: 'hapoalim', category: 'banks' },
  { name: 'בנק מזרחי', slug: 'mizrahi', category: 'banks' },
  { name: 'בנק דיסקונט', slug: 'discount', category: 'banks' },
  // חברות נוספות
  { name: 'רשות שדות התעופה', slug: 'iaa', category: 'other' },
  { name: 'כלל ביטוח', slug: 'clal', category: 'other' },
  { name: 'הפניקס', slug: 'phoenix', category: 'other' },
  { name: 'מגדל', slug: 'migdal', category: 'other' },
  { name: 'אגד', slug: 'egged', category: 'other' },
];

export function getClientsByCategory(): Record<ClientCategory, Client[]> {
  const map: Record<ClientCategory, Client[]> = {
    municipalities: [],
    tech: [],
    production: [],
    banks: [],
    other: [],
  };
  for (const client of CLIENTS_DATA) {
    map[client.category].push(client);
  }
  return map;
}
