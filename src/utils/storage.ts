export interface Vehicle {
  id: string;
  name: string;
  type: 'bus' | 'van' | 'coach' | 'car';
  capacity: number;
  amenities: string[];
  photo: string;
  description: string;
  ratePerKm?: number;
  status: 'active' | 'maintenance';
}

export interface TravelPlan {
  id: string;
  title: string;
  destination: string;
  duration: string; // e.g. "3 Days / 2 Nights"
  price: number;
  photo: string;
  description: string;
  highlights: string[];
  inclusions: string[];
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  photo: string;
  tags: string[];
  views: number;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  planId?: string;
  planTitle?: string;
  date: string;
  message: string;
  status: 'pending' | 'responded';
}

const DEFAULT_VEHICLES: Vehicle[] = [
  {
    id: 'v1',
    name: 'Luxury Multi-Axle Volvo AC Sleeper',
    type: 'bus',
    capacity: 36,
    amenities: ['Wi-Fi', 'AC', 'USB Charger', 'Blanket', 'Water Bottle', 'Pillow'],
    photo:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description:
      'Premium class sleeper bus with individual berths, semi-sleeper seats, and advanced suspension for a smooth overnight journey.',
    ratePerKm: 45,
    status: 'active',
  },
  {
    id: 'v2',
    name: 'Mercedes-Benz Luxury Coach',
    type: 'coach',
    capacity: 45,
    amenities: ['AC', 'LCD Screen', 'Reclining Seats', 'Reading Lights', 'GPS Tracking'],
    photo:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    description:
      'Ultra-comfortable tour coach designed for long-distance group tours, offering ample legroom and panoramic windows.',
    ratePerKm: 55,
    status: 'active',
  },
  {
    id: 'v3',
    name: 'Toyota Commuter Luxury Van',
    type: 'van',
    capacity: 12,
    amenities: ['Wi-Fi', 'AC', 'Leather Seats', 'Bluetooth Audio'],
    photo:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    description:
      'Perfect for family tours or corporate outings, featuring ergonomic reclining leather seats and premium sound system.',
    ratePerKm: 25,
    status: 'active',
  },
];

const DEFAULT_PLANS: TravelPlan[] = [
  {
    id: 'p1',
    title: 'Golden Triangle Majestic Tour',
    destination: 'Delhi - Agra - Jaipur',
    duration: '4 Days / 3 Nights',
    price: 12999,
    photo:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description:
      'Experience the rich heritage of India. Visit the historical monuments of Delhi, the wonder of Taj Mahal in Agra, and the royal palaces of Jaipur.',
    highlights: [
      'Taj Mahal Sunrise Tour',
      'Jaipur Amber Fort Elephant/Jeep Ride',
      'Qutub Minar visit',
      'Royal Chokhi Dhani Dinner',
    ],
    inclusions: ['AC Volvo Travel', '3-Star Hotel Stay', 'Breakfast & Dinner', 'Tour Guide fees'],
  },
  {
    id: 'p2',
    title: 'Kerala Backwaters & Hills Escape',
    destination: 'Munnar - Thekkady - Alleppey',
    duration: '6 Days / 5 Nights',
    price: 18499,
    photo:
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    description:
      'Unwind amidst the green tea plantations of Munnar, explore the wildlife of Thekkady, and cruise along the pristine backwaters in a traditional houseboat.',
    highlights: [
      'Munnar Tea Estate Walk',
      'Spice Plantation Tour',
      'Houseboat Overnight Cruise',
      'Kathakali Cultural Show',
    ],
    inclusions: [
      'Luxury Coach Transfer',
      'Houseboat Stay with All Meals',
      'Resort Stay',
      'Local Sightseeing',
    ],
  },
  {
    id: 'p3',
    title: 'Himalayan Serenity Getaway',
    destination: 'Manali - Solang Valley - Kasol',
    duration: '5 Days / 4 Nights',
    price: 10999,
    photo:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description:
      'Escape the summer heat and head into the snow-capped peak valleys of Manali. Indulge in adventure sports at Solang and experience the hippie culture of Kasol.',
    highlights: [
      'Solang Valley Paragliding',
      'Rohtang Pass Snow Trek',
      'Manikaran Sahib Hot Springs',
      'Riverside Camping',
    ],
    inclusions: [
      'Volvo Sleeper Travel',
      'Camp Stay & Hotel Stay',
      'Bonfire Night',
      'Breakfast & Dinner',
    ],
  },
];

const DEFAULT_BLOGS: Blog[] = [
  {
    id: 'b1',
    title: 'Why Road Trips in Luxury Buses are the New Trend',
    excerpt:
      'Discover how high-tech sleeper coaches, onboard Wi-Fi, and plush interiors are changing the way people travel across the country.',
    content: `Road trips have always had a romantic appeal, but driving long hours can be tiring. Enter the new era of luxury bus travel. With state-of-the-art multi-axle Volvo and Mercedes buses, long-distance travelling has become incredibly comfortable and eco-friendly.

### 1. Reclining Berths & Privacy
Modern sleeper buses offer private single and double berths with sliding curtains, individual reading lights, and air vents. You can fall asleep in one city and wake up refreshed in another.

### 2. Full Connectivity
Equipped with high-speed Wi-Fi and individual USB charging ports, you can work on the go, stream your favorite movies, or stay connected with friends.

### 3. Cost-Effective and Eco-Friendly
Traveling by bus consumes significantly less fuel per passenger than individual cars or airplanes, drastically reducing your carbon footprint while saving on expensive flight tickets.

Plan your next holiday with us and experience travel like never before!`,
    author: 'Amit Sharma',
    date: '2026-06-15',
    photo:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    tags: ['Travel Tips', 'Luxury Bus', 'Eco Travel'],
    views: 342,
  },
  {
    id: 'b2',
    title: 'Top 5 Hidden Gems in Rajasthan You Must Visit',
    excerpt:
      'Beyond Jaipur and Udaipur, Rajasthan holds secret forts, blue stepwells, and desert sanctuaries. Here are the top 5 hidden places.',
    content: `When people think of Rajasthan, Jaipur's Hawa Mahal and Udaipur's Lake Palace immediately come to mind. However, the desert state is vast and hides secret locations that offer a raw, untouched experience of Rajput history and culture.

### 1. Bundi - The City of Stepwells
Bundi is famous for its intricate stepwells (baoris) and the stunning Bundi Palace, which features ancient frescoes that look brand new. It is far less crowded and offers absolute tranquility.

### 2. Khuri - The Silent Dunes
If Jaisalmer feels too commercialized, head 40 km further to Khuri. You'll find peaceful sand dunes, traditional mud houses, and starry nights without the loud resort music.

### 3. Kumbhalgarh - The Great Wall of India
Kumbhalgarh houses the second-longest continuous wall in the world, after the Great Wall of China. Spanning 36 km, it surrounds a massive fort offering spectacular views of the Aravalli hills.

Traveling to these places is easy with our custom travel plans. Book a private tourist van or coach for your family trip today!`,
    author: 'Ritu Verma',
    date: '2026-06-10',
    photo:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    tags: ['Rajasthan', 'Offbeat', 'Roadtrip'],
    views: 521,
  },
];

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'i1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    planId: 'p1',
    planTitle: 'Golden Triangle Majestic Tour',
    date: '2026-06-22',
    message:
      'We are a family of 4 looking to book this package for next month. Are there any discounts available for children?',
    status: 'pending',
  },
];

export const initializeStorage = () => {
  if (!localStorage.getItem('tc_vehicles')) {
    localStorage.setItem('tc_vehicles', JSON.stringify(DEFAULT_VEHICLES));
  }
  if (!localStorage.getItem('tc_plans')) {
    localStorage.setItem('tc_plans', JSON.stringify(DEFAULT_PLANS));
  }
  if (!localStorage.getItem('tc_blogs')) {
    localStorage.setItem('tc_blogs', JSON.stringify(DEFAULT_BLOGS));
  }
  if (!localStorage.getItem('tc_inquiries')) {
    localStorage.setItem('tc_inquiries', JSON.stringify(DEFAULT_INQUIRIES));
  }
};

export const getVehicles = (): Vehicle[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('tc_vehicles') || '[]');
};

export const saveVehicles = (vehicles: Vehicle[]) => {
  localStorage.setItem('tc_vehicles', JSON.stringify(vehicles));
};

export const getPlans = (): TravelPlan[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('tc_plans') || '[]');
};

export const savePlans = (plans: TravelPlan[]) => {
  localStorage.setItem('tc_plans', JSON.stringify(plans));
};

export const getBlogs = (): Blog[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('tc_blogs') || '[]');
};

export const saveBlogs = (blogs: Blog[]) => {
  localStorage.setItem('tc_blogs', JSON.stringify(blogs));
};

export const getInquiries = (): Inquiry[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem('tc_inquiries') || '[]');
};

export const saveInquiries = (inquiries: Inquiry[]) => {
  localStorage.setItem('tc_inquiries', JSON.stringify(inquiries));
};
