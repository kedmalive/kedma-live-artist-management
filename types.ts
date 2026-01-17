
export interface Artist {
  id: number;
  name: string;
  category: string;
  englishName: string;
  image: string;
  credit?: string;
  description: string;
  fullDetails: string;
  website?: string;
}

export enum EventType {
  CORPORATE = 'אירוע חברה / ועד עובדים',
  MUNICIPAL = 'אירוע מוניציפלי / יום העצמאות',
  FESTIVAL = 'פסטיבל',
  WEDDING = 'חתונה / אירוע פרטי',
  STUDENT = 'יום סטודנט',
}

export interface NavLink {
  name: string;
  target: string;
}
