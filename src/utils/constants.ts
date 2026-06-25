export const COMPANY_DETAILS = {
  name: "Khodel Travels",
  slogan: "ટ્રીપ તમારી કાર અમારી",
  sloganEnglish: "Your Trip, Our Car",
  phoneCab: "+91 76008 48518",
  phoneTours: "+91 98765 43210",
  emailInfo: "info@khodeltravels.com",
  emailSupport: "support@khodeltravels.com",
  address: "102 Khodel Arcade, Tourism Sector, City Center, India",
  adminEmail: "admin@khodeltravels.com",
  adminPassword: "admin123"
};

export interface CabPlan {
  id: string;
  title: string;
  destination: string;
  duration: string;
  description: string;
  photo: string;
  price: number;
  highlights: string[];
  inclusions: string[];
}

export const CAB_PLANS: CabPlan[] = [
  {
    id: "cab_surat_mumbai",
    title: "Surat to Mumbai Cab Service",
    destination: "Mumbai",
    duration: "One Way / Round Trip",
    description: "Direct premium cab service from Surat to Mumbai. Vehicles available: Sedan, Ertiga, Innova, Innova Crysta.",
    photo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
    price: 4500,
    highlights: ["Professional sanitized cabs", "Toll charges included option", "Experienced highway drivers"],
    inclusions: ["Fuel charges", "Driver allowances", "GST"]
  },
  {
    id: "cab_mumbai_surat",
    title: "Mumbai to Surat Cab Service",
    destination: "Surat",
    duration: "One Way / Round Trip",
    description: "Direct premium cab service from Mumbai to Surat. Vehicles available: Sedan, Ertiga, Innova, Innova Crysta.",
    photo: "https://images.unsplash.com/photo-1494976388531-d10580905c35?auto=format&fit=crop&w=600&q=80",
    price: 4500,
    highlights: ["Sanitized cabins", "Doorstep pickup & drop", "Air-conditioned comfort"],
    inclusions: ["Fuel charges", "Driver allowances", "GST"]
  },
  {
    id: "cab_surat_ahmedabad",
    title: "Surat to Ahmedabad Cab Service",
    destination: "Ahmedabad",
    duration: "One Way / Round Trip",
    description: "Premium taxi from Surat to Ahmedabad. Fast, reliable, and comfortable travel option.",
    photo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
    price: 4000,
    highlights: ["24/7 service availability", "Sedan & SUV options", "Clean and fully functional AC"],
    inclusions: ["Fuel charges", "Driver allowances", "GST"]
  },
  {
    id: "cab_ahmedabad_surat",
    title: "Ahmedabad to Surat Cab Service",
    destination: "Surat",
    duration: "One Way / Round Trip",
    description: "Premium taxi from Ahmedabad to Surat. Enjoy safe and reliable transport with expert drivers.",
    photo: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=600&q=80",
    price: 4000,
    highlights: ["Flexible scheduling", "GPS tracked vehicles", "Highly-rated drivers"],
    inclusions: ["Fuel charges", "Driver allowances", "GST"]
  },
  {
    id: "cab_ahmedabad_surat_mumbai",
    title: "Ahmedabad to Surat to Mumbai Cab Service",
    destination: "Surat & Mumbai",
    duration: "Multi-city Route",
    description: "Premium multi-city route covering Ahmedabad, Surat, and Mumbai. Best for business trips or extended families.",
    photo: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
    price: 9500,
    highlights: ["Multi-stop convenience", "Luggage friendly vehicles", "Customizable duration & stops"],
    inclusions: ["Fuel charges", "Driver allowances", "GST"]
  }
];

export const CAB_FLEET = [
  { name: "SEDAN", desc: "Dzire, Etios or equivalent", capacity: "4+1 Seater" },
  { name: "ERTIGA", desc: "Spacious MPV", capacity: "6+1 Seater" },
  { name: "INNOVA", desc: "Premium comfort standard", capacity: "7+1 Seater" },
  { name: "INNOVA CRYSTA", desc: "Luxury executive MPV", capacity: "7+1 Seater" }
];

export const CAB_ROUTES = [
  { from: "Surat", to: "Mumbai" },
  { from: "Mumbai", to: "Surat" },
  { from: "Surat", to: "Ahmedabad" },
  { from: "Ahmedabad", to: "Surat" },
  { from: "Ahmedabad", to: "Surat ⇄ Mumbai", special: true }
];

export const CAB_SERVICES = [
  "One way cab services",
  "Local city rentals",
  "Round trip bookings",
  "Airport pick & drop transport",
  "Outstation journeys",
  "Marriage & event airport service",
  "Corporate transport booking"
];
