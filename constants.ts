
import { Artist } from './types';

/** Splits full name into first name (line 1) and family name (line 2) for uniform display */
export function splitArtistName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  const lastName = parts.pop()!;
  const firstName = parts.join(' ');
  return { firstName, lastName };
}

export const ARTISTS_DATA: Artist[] = [
  {
    id: 1,
    name: "אביתר בנאי",
    category: "רוק / אמוני",
    englishName: "Eviatar Banai",
    image: "/input_file_0.png",
    credit: "צילום: נגה שהרבני",
    description: "אחד האמנים האהובים והמרגשים ביותר בישראל. מילים, כנות ואומץ שמדברים את מה שלעיתים קשה לנסח.",
    fullDetails: "אביתר בנאי הוא ללא ספק אחד האמנים האהובים והמרגשים ביותר בישראל. המילים, הכנות והאומץ של אביתר מדברים את מה שלרבים מאיתנו לעיתים קשה לנסח ולומר בעצמנו. שירים שעוסקים בליבת החיים, יחסים. הורים, ילדים, זוגיות, נפש, שורשים. האומץ לגעת בכאב, בהתמכרות, בחרדות וגם בחמלה ובלב הפתוח, האומץ לאהוב.",
    website: "https://www.eviatarbanai.com/",
    spotifyUrl: "https://open.spotify.com/artist/3ObnkOSF8KZ9405ZPJtwbB",
    instagramUrl: "https://www.instagram.com/eviatar.banai/"
  },
  {
    id: 2,
    name: "בניה ברבי",
    category: "פופ / נשמה",
    englishName: "Benaia Barabi",
    image: "/input_file_1.png",
    credit: "צילום: שי פרנקו",
    description: "אמן יוצר, כותב, מלחין, שר ומנגן – חלק בלתי נפרד מהפסקול הישראלי עם להיטי ענק וקהל שאוהב.",
    fullDetails: "בניה ברבי – אמן יוצר, כותב, מלחין, שר ומנגן אשר בעשור האחרון נהיה חלק בלתי נפרד מהפסקול הישראלי עם להיטי ענק, הופעות רבות ברחבי הארץ והעולם, וקהל גדול שמחבק, מתרגש ואוהב. המופע החדש של בניה ברבי גדול יותר, חגיגי יותר, ומלא ברגש כמו שרק הוא יודע. עם שירים מכל האלבומים בעיבודים מוזיקליים חדשים מיוחדים, יחד עם הרכב הנגנים המוכשרים שלו ההולכים איתו כברת דרך.",
    website: "https://www.ticketmaster.co.il/performance/MPSD0/001/ALL/iw",
    spotifyUrl: "https://open.spotify.com/artist/0WjQnf1rQ0tY84gGgjrQQ9",
    instagramUrl: "https://www.instagram.com/benaiabarabi/"
  },
  {
    id: 3,
    name: "דודו טסה",
    category: "מזרחי / פופ",
    englishName: "Dudu Tassa",
    image: "/dudu-tasa.png",
    credit: "צילום: יפעת שגב",
    description: "אחד האמנים האהובים והמוערכים בישראל. רוק מזרח תיכוני, להיטי ענק וחיבור עוצמתי עם הקהל.",
    fullDetails: "דודו טסה הוא אחד האמנים האהובים והמוערכים בישראל. עם רשימה ארוכה של להיטים כמו \"בסוף מתרגלים להכל\", \"הגולה\", \"לולה\", \"איזה יום\", \"פריד\" ו\"אני רץ\" – שהפכו לפסקול של דור. השילוב הייחודי שטסה מביא בין השורשים שלו למוזיקת רוק פרץ גם את גבולות ישראל. עם \"הכוויתים\", פרויקט שבו הקים לחיים את השירים שסבא שלו ואחיו יצרו בעיראק, טסה הופיע ברחבי ארה\"ב ובאירופה על במות פסטיבלים בפני קהל מכל העולם. טסה ממשיך לעבוד ולהופיע עם ג'וני גרינווד, הגיטריסט של רדיוהד, בפרויקט המשותף שלהם \"ג'ראק קריבאק\", שבו מוזיקאים מהמזרח התיכון מקליטים יחד שירי אהבה. על הבמה, יחד עם נבחרת נגני על, טסה מוביל הופעה מלאת אנרגיה של רוק מזרח תיכוני, להיטי ענק וחיבור עוצמתי עם הקהל.",
    website: "https://www.dudu-tassa.com/",
    spotifyUrl: "https://open.spotify.com/artist/3AoetF4LFZLRJjfuy071mz",
    instagramUrl: "https://www.instagram.com/dudutassa/"
  },
  {
    id: 4,
    name: "רביד פלוטניק",
    category: "היפ הופ / ראפ",
    englishName: "Ravid Plotnik",
    image: "/input_file_3.png",
    credit: "צילום: תמר חנן",
    description: "אחד הראפרים והיוצרים המוערכים והאהובים בישראל. הומור, עומק, רגישות וכריזמה – קול צעיר ומבטיח.",
    fullDetails: "רביד פלוטניק הוא אחד הראפרים והיוצרים המוערכים והאהובים בישראל. בזכות הרבה הומור, עומק, רגישות וכריזמה נחשב רביד היום לאחד מן הקולות הצעירים והמבטיחים בארץ. היכולת שלו ליצור מוזיקה רגישה ועדינה לצד המנונים בועטים, הם שהחדירו את רביד בלבבותיהם של אלפי ישראלים. אחד הדברים המרגשים והמהפנטים ביותר בהופעות של רביד זה הקהל שלו, רקמה אנושית אחת מלאה בעוצמה וכוח. קשה להסביר את החוויה במילים, פשוט צריך להיות שם. לבוא להחליט שאתם מתמסרים לרגע ולשכוח מכל מה שקורה בחוץ.",
    website: "https://ravidplotnik.com/",
    spotifyUrl: "https://open.spotify.com/artist/2JQK9mzxqKz16lSgICHDTx",
    instagramUrl: "https://www.instagram.com/ravideliav/"
  },
  {
    id: 5,
    name: "מארק אליהו",
    category: "עולם / אינסטרומנטלי",
    englishName: "Mark Eliyahu",
    image: "/input_file_2.png",
    credit: "צילום: Carlos Yanez",
    description: "מלחין יוצא דופן, מפיק ייחודי ומאסטר קמנצ'ה בינלאומי. בין המוזיקאים הישראלים המושמעים ביותר בעולם.",
    fullDetails: "מארק אליהו הוא מלחין יוצא דופן, מפיק ייחודי ומאסטר קמנצ'ה בינלאומי. מאחוריו ארבעה אלבומי אולפן (האלבום ״חולות״ זכה למעמד אלבום זהב), והוא בין המוזיקאים הישראלים המושמעים ביותר בעולם, עם עשרות מיליוני מאזינים בפלטפורמות השונות. זכה בפרס אקו״ם, בפרס אופיר (על פסקול ״בלדה לאביב הבוכה״) ובפרס האקדמיה לטלוויזיה (על פסקול ״טהרן״). לאורך 20 השנים האחרונות מארק הופיע על הבמות הנחשבות ביותר ברחבי העולם, ואסף מעריצים רבים הפרוסים על פני הגלובוס.",
    website: "https://markeliyahu.com/",
    spotifyUrl: "https://open.spotify.com/artist/7k6KVFItaU7pcBvL6poIi9",
    instagramUrl: "https://www.instagram.com/mark_eliyahu/"
  },
  {
    id: 6,
    name: "שולי רנד",
    category: "יהודי / תיאטרלי",
    englishName: "Shuli Rand",
    image: "/shuli-rand.png",
    credit: "צילום: אילן בשור",
    description: "שולי רנד הוא שחקן קולנוע, במאי, תסריטאי, מלחין, פזמונאי וזמר ישראלי. זוכה שני פרסי אופיר בשנים 1992 ו-2004 ובפרס שר החינוך לתרבות יהודית בתחום מפעל חיים לשנת 2016.",
    fullDetails: "מופע להקה הכולל את מיטב השירים מאלבומו האחרון 'אירוע מתגלגל' וביניהם 'שבע השנים הטובות' שנסך רגע של אופטימיות בחברה הישראלית, 'לגלגל את זה הלאה', 'המלאך שלי' ועוד, וכן יתר שיריו הגדולים של שולי רנד, 'אייכה', 'המשורר', 'מוחין דקטנות', 'דע בני אהובי', 'בין קודש לחול', ושאר שירי האלבומים המופלאים, ובנוסף ביצועים מיוחדים לקלאסיקות ישראליות ידועות. שיריו של שולי, בשילוב יכולותיו כפרפורמר ייחודי המפליא בסיפורים על הבמה כפי שרק הוא יודע, יוצרים יחד מופע מיוחד ובלתי נשכח.",
    website: "https://shulirand.co.il/he/home",
    spotifyUrl: "https://open.spotify.com/artist/7CgBEyXbjOjFX3HiysHtXN",
    instagramUrl: "https://www.instagram.com/shulirand/"
  },
  {
    id: 7,
    name: "שי צברי",
    category: "גרוב / נשמה",
    englishName: "Shai Tsabari",
    image: "/input_file_5.png",
    credit: "צילום: יאיר מיוחס",
    description: "קול חד־פעמי, כריזמה בימתית מטורפת ויכולת לכשף ולסחוף קהלים.",
    fullDetails: "שי צברי התפרסם בזכות קולו החד פעמי והיכולת שלו לכשף קהלים ולסחוף אחריו עם אנרגיות וכריזמה בימתית מטורפת. השירים המוכרים והאהובים לצד שירים חדשים שנוספו בשנה האחרונה תוך כדי המופעים למפונים, לחיילים ולפצועים שלנו. מופע הנוגע בלבבות השבורים שלנו וננסה לחבר את החלקים שלהם במחיאת כף, בשירה משותפת ואם ירצה השם גם בריקוד.",
    website: "https://www.shaitsabari.com/",
    spotifyUrl: "https://open.spotify.com/artist/0T0COcAFHD9oZ704HbZr2A",
    instagramUrl: "https://www.instagram.com/shaitsabari/"
  }
];
