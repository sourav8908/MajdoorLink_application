
import { User, Booking, Availability, UserRole, ShiftType } from './types';

class MockDB {
  private static instance: MockDB;
  private storageKey = 'majdoorlink_db';

  private data: {
    users: User[];
    bookings: Booking[];
    availabilities: Availability[];
  } = {
    users: [],
    bookings: [],
    availabilities: []
  };

  private constructor() {
    this.load();
    if (this.data.users.length === 0) {
      this.initSeedData();
    }
  }

  static getInstance() {
    if (!MockDB.instance) {
      MockDB.instance = new MockDB();
    }
    return MockDB.instance;
  }

  private load() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        this.data = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse DB", e);
        this.initSeedData();
      }
    }
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
  }

  private initSeedData() {
    const admin: User = {
      id: 'admin-1',
      name: 'Super Admin',
      email: 'admin@majdoorlink.com',
      password: 'admin@9861', // Required fixed password
      role: 'ADMIN',
      language: 'EN',
      joinedAt: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
      locality: 'Bhubaneswar',
      phone: '9000000000'
    };

    const workers: User[] = [
      {
        id: 'w-1',
        name: 'Sushant Nayak',
        email: 'sushant@example.com',
        password: 'password123',
        role: 'WORKER',
        language: 'OR',
        districtId: 'dist_khordha',
        locality: 'Bhubaneswar',
        skillId: 'skill_electrician',
        isVerified: true,
        verificationStatus: 'VERIFIED',
        rating: 4.8,
        reviewCount: 24,
        joinedAt: new Date().toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sushant',
        phone: '9876543210',
        documents: {
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sushant',
            aadhaar: 'https://via.placeholder.com/400x250?text=Aadhaar+Card',
            pan: 'https://via.placeholder.com/400x250?text=PAN+Card',
            bank: 'https://via.placeholder.com/400x250?text=Bank+Passbook'
        }
      },
      {
        id: 'w-pending',
        name: 'Bijay Patra',
        email: 'bijay@example.com',
        password: 'password123',
        role: 'WORKER',
        language: 'OR',
        districtId: 'dist_ganjam',
        locality: 'Berhampur',
        skillId: 'skill_plumber',
        isVerified: false,
        verificationStatus: 'PENDING',
        rating: 0,
        reviewCount: 0,
        joinedAt: new Date().toISOString(),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bijay',
        phone: '9876543299',
        documents: {
            photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bijay',
            aadhaar: 'https://via.placeholder.com/400x250?text=Aadhaar+Sample',
            pan: 'https://via.placeholder.com/400x250?text=PAN+Sample',
            bank: 'https://via.placeholder.com/400x250?text=Bank+Sample'
        }
      }
    ];

    const customer: User = {
      id: 'c-1',
      name: 'Manoj Kumar',
      email: 'manoj@example.com',
      password: 'password123',
      role: 'CUSTOMER',
      language: 'EN',
      joinedAt: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manoj',
      phone: '9998887776',
      locality: 'Bhubaneswar'
    };

    this.data.users = [admin, ...workers, customer];

    const next7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString().split('T')[0];
    });

    this.data.availabilities = workers.map(w => {
      const schedule: { [key: string]: ShiftType } = {};
      next7Days.forEach(date => {
        schedule[date] = 'FULL_DAY';
      });
      return {
        userId: w.id,
        isOnline: true,
        pricing: {
          FULL_DAY: 800,
          MORNING: 450,
          EVENING: 450
        },
        schedule
      };
    });

    this.save();
  }

  getUsers() { return this.data.users; }
  getUser(id: string) { return this.data.users.find(u => u.id === id); }
  addUser(user: User) { 
    this.data.users.push(user); 
    this.save(); 
  }
  updateUser(id: string, updates: Partial<User>) {
    this.data.users = this.data.users.map(u => u.id === id ? { ...u, ...updates } : u);
    this.save();
  }
  deleteUser(id: string) {
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.bookings = this.data.bookings.filter(b => b.workerId !== id && b.customerId !== id);
    this.save();
  }

  getBookings() { return this.data.bookings; }
  getBooking(id: string) { return this.data.bookings.find(b => b.id === id); }
  addBooking(booking: Booking) {
    this.data.bookings.push(booking);
    this.save();
  }
  updateBooking(id: string, updates: Partial<Booking>) {
    this.data.bookings = this.data.bookings.map(b => b.id === id ? { ...b, ...updates } : b);
    this.save();
  }

  getAvailability(userId: string): Availability { 
    return this.data.availabilities.find(a => a.userId === userId) || { 
      userId, 
      isOnline: false, 
      pricing: { FULL_DAY: 500, MORNING: 300, EVENING: 300 },
      schedule: {}
    };
  }
  updateAvailability(userId: string, updates: Partial<Availability>) {
    const idx = this.data.availabilities.findIndex(a => a.userId === userId);
    if (idx >= 0) {
      this.data.availabilities[idx] = { ...this.data.availabilities[idx], ...updates };
    } else {
      this.data.availabilities.push({ 
        userId, 
        isOnline: false, 
        pricing: { FULL_DAY: 500, MORNING: 300, EVENING: 300 },
        schedule: {},
        ...updates 
      });
    }
    this.save();
  }
}

export const db = MockDB.getInstance();
