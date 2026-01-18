
export type UserRole = 'CUSTOMER' | 'WORKER' | 'ADMIN';
export type Language = 'EN' | 'OR' | 'HI';

export type BookingStatus = 'REQUESTED' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
export type ShiftType = 'FULL_DAY' | 'MORNING' | 'EVENING' | 'REST';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'DECLINED';

export interface UserDocuments {
  photo?: string;
  aadhaar?: string;
  pan?: string;
  bank?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Added for authentication
  role: UserRole;
  language: Language;
  avatar?: string;
  districtId?: string; // Stored as ID
  locality: string;
  skillId?: string; // Stored as ID
  isVerified?: boolean;
  verificationStatus?: VerificationStatus;
  declineReason?: string;
  adminNotes?: string;
  documents?: UserDocuments;
  rating?: number;
  reviewCount?: number;
  joinedAt: string;
  isBanned?: boolean;
  phone: string; // Mandatory for India-specific validation
}

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  skillId: string;
  date: string;
  shift?: ShiftType;
  status: BookingStatus;
  requestedAt: string;
  notes?: string;
  rating?: number;
  review?: string;
  price?: number;
}

export interface Availability {
  userId: string;
  isOnline: boolean;
  pricing: {
    FULL_DAY: number;
    MORNING: number;
    EVENING: number;
  };
  schedule: {
    [date: string]: ShiftType;
  };
}

export interface Translation {
  [key: string]: {
    EN: string;
    OR: string;
    HI: string;
  };
}
