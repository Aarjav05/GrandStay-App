const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// Note: Normally you'd use a SERVICE_ROLE_KEY to bypass RLS in a seed script.
// Since we don't have RLS enabled strictly yet, the Anon key will work.

if (!supabaseUrl || !supabaseKey) {
  console.log('Seed script requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const HOTELS_DATA = [
  {
    id: "h1", name: "Grand Horizon Resort", city: "Bali", address: "123 Coastal Road, Seminyak, Bali", description: "Experience luxury living by the sea with stunning sunset views and private beach access.", price: 15000, rating: 4.8, review_count: 342,
    images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
    amenities: ["wifi", "pool", "spa", "restaurant", "bar"], category: "resort",
    lat: -8.6917, lng: 115.1610, is_featured: true,
  },
  {
    id: "h2", name: "Urban Boutique Hotel", city: "Mumbai", address: "45 Bandra West, Mumbai, Maharashtra", description: "Chic and modern hotel in the heart of the city, perfect for business and leisure travelers alike.", price: 8500, rating: 4.5, review_count: 128,
    images: ["https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800", "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"],
    amenities: ["wifi", "gym", "ac", "roomService"], category: "city",
    lat: 19.0596, lng: 72.8295, is_featured: false,
  },
  {
    id: "h3", name: "Taj Mahal Palace", city: "Mumbai", address: "Apollo Bunder, Colaba, Mumbai", description: "An iconic symbol of Indian hospitality, offering unparalleled luxury and views of the Arabian Sea.", price: 25000, rating: 4.9, review_count: 2150,
    images: ["https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800", "https://images.unsplash.com/photo-1542314831-c6a4d10d8766?w=800"],
    amenities: ["wifi", "pool", "gym", "spa", "restaurant", "bar", "roomService"], category: "luxury",
    lat: 18.9217, lng: 72.8332, is_featured: true,
  },
  {
    id: "h4", name: "Goa Beach Retreat", city: "Goa", address: "78 Palolem Beach Road, South Goa", description: "A serene getaway with eco-friendly cottages right on the sandy shores of Palolem beach.", price: 6000, rating: 4.4, review_count: 89,
    images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800", "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"],
    amenities: ["wifi", "pool", "bar", "parking"], category: "beach",
    lat: 15.0100, lng: 74.0232, is_featured: true,
  },
  {
    id: "h5", name: "Budget Inn Metro", city: "Delhi", address: "Connaught Place, New Delhi", description: "Affordable and clean accommodation for backpackers and short stays.", price: 2500, rating: 3.9, review_count: 45,
    images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"],
    amenities: ["wifi", "ac"], category: "budget",
    lat: 28.6315, lng: 77.2167, is_featured: false,
  }
];

const ROOMS_DATA = [
  { id: "r1", hotel_id: "h1", type: "Deluxe Ocean View", price: 15000, capacity: 2, bed_type: "1 King Bed", features: ["Ocean View", "Balcony", "Mini Bar"], images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"], quantity: 10 },
  { id: "r2", hotel_id: "h1", type: "Presidential Suite", price: 45000, capacity: 4, bed_type: "2 King Beds", features: ["Private Pool", "Butler Service", "Ocean View"], images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"], quantity: 2 },
  { id: "r3", hotel_id: "h3", type: "Taj Club City View", price: 25000, capacity: 2, bed_type: "1 King Bed", features: ["City View", "Club Lounge Access", "Butler"], images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"], quantity: 15 }
];

const REVIEWS_DATA = [
  { hotel_id: "h1", user_name: "Alex Johnson", rating: 5, text: "Absolutely breathtaking views and top-notch service. Will come back!" },
  { hotel_id: "h1", user_name: "Sarah Williams", rating: 4, text: "Great resort but the restaurants are a bit overpriced." },
  { hotel_id: "h3", user_name: "Ratan T.", rating: 5, text: "An experience of a lifetime. The heritage shines through." }
];

async function seedData() {
  try {
    console.log('Seeding hotels...');
    const { error: hErr } = await supabase.from('hotels').upsert(HOTELS_DATA);
    if (hErr) throw hErr;
    
    console.log('Seeding rooms...');
    const { error: rErr } = await supabase.from('rooms').upsert(ROOMS_DATA);
    if (rErr) throw rErr;
    
    console.log('Seeding reviews...');
    const { error: revErr } = await supabase.from('reviews').insert(REVIEWS_DATA);
    // Ignore inserts for reviews if they fail due to duplicates (since we don't have PKs pre-defined in this stub)
    if (revErr) console.warn('Review seed warning (safe to ignore if running twice):', revErr.message);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();
