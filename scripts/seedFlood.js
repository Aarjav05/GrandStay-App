const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('Requires EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------- HOTELS ----------
const HOTELS = [
  // --- Mumbai ---
  { id: "h6", name: "The Oberoi Mumbai", city: "Mumbai", address: "Nariman Point, Mumbai", description: "Perched on the edge of the Arabian Sea, The Oberoi Mumbai offers breathtaking ocean views, world-class dining, and impeccable service that defines the gold standard of Indian luxury hospitality.", price: 22000, rating: 4.85, review_count: 1830, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800","https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 18.9252, lng: 72.8205, is_featured: true },
  { id: "h7", name: "ITC Maratha", city: "Mumbai", address: "Sahar Airport Road, Andheri East", description: "A grand tribute to the Maratha dynasty, blending rich heritage with contemporary luxury. Just 5 minutes from the international airport.", price: 14000, rating: 4.6, review_count: 965, images: ["https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800","https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 19.0950, lng: 72.8722, is_featured: false },
  { id: "h8", name: "Hotel Marine Plaza", city: "Mumbai", address: "Marine Drive, Mumbai", description: "An art deco gem on Marine Drive with panoramic views of the Queen's Necklace. The rooftop pool is Mumbai's best-kept secret.", price: 9500, rating: 4.3, review_count: 432, images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"], amenities: ["wifi","pool","restaurant","bar","gym"], category: "city", lat: 18.9405, lng: 72.8224, is_featured: false },

  // --- Delhi ---
  { id: "h9", name: "The Leela Palace", city: "Delhi", address: "Chanakyapuri, New Delhi", description: "Inspired by Lutyens' architectural vision, this palatial hotel offers an oasis of luxury amid the capital's diplomatic enclave with curated art collections.", price: 28000, rating: 4.9, review_count: 2540, images: ["https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800","https://images.unsplash.com/photo-1542314831-c6a4d10d8766?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 28.5867, lng: 77.1720, is_featured: true },
  { id: "h10", name: "ITC Maurya", city: "Delhi", address: "Sardar Patel Marg, Diplomatic Enclave", description: "Home to the legendary Bukhara restaurant, ITC Maurya sets the benchmark for culinary excellence and stately grandeur.", price: 18000, rating: 4.7, review_count: 1890, images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService"], category: "luxury", lat: 28.5979, lng: 77.1750, is_featured: true },
  { id: "h11", name: "The Imperial", city: "Delhi", address: "Janpath, Connaught Place", description: "India's most iconic heritage hotel, home to one of the country's finest private art collections spanning 5,000 years of civilization.", price: 20000, rating: 4.8, review_count: 1420, images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 28.6265, lng: 77.2200, is_featured: false },
  { id: "h12", name: "Treebo Trend Barton Centre", city: "Delhi", address: "Karol Bagh, New Delhi", description: "A smart budget hotel in bustling Karol Bagh, ideal for business travelers and explorers who want to be near metro access.", price: 2800, rating: 3.8, review_count: 67, images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"], amenities: ["wifi","ac","parking"], category: "budget", lat: 28.6519, lng: 77.1905, is_featured: false },

  // --- Bengaluru ---
  { id: "h13", name: "Taj West End", city: "Bengaluru", address: "Race Course Road, Bengaluru", description: "A magnificent heritage property set in 20 acres of lush tropical gardens in the heart of India's Silicon Valley. Built in 1887.", price: 16000, rating: 4.7, review_count: 1350, images: ["https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800","https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 12.9844, lng: 77.5770, is_featured: true },
  { id: "h14", name: "The Ritz-Carlton Bengaluru", city: "Bengaluru", address: "Residency Road, Ashok Nagar", description: "Opulent 5-star property with one of the largest rooftop bars in the country and stunning skyline views of Bengaluru.", price: 21000, rating: 4.8, review_count: 890, images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService"], category: "luxury", lat: 12.9715, lng: 77.6102, is_featured: false },
  { id: "h15", name: "Lemon Tree Premier", city: "Bengaluru", address: "Whitefield, Bengaluru", description: "Modern mid-range hotel close to IT parks with excellent workspaces, a refreshing pool, and signature Lemon Tree hospitality.", price: 5500, rating: 4.2, review_count: 312, images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"], amenities: ["wifi","pool","gym","restaurant","parking"], category: "city", lat: 12.9698, lng: 77.7500, is_featured: false },

  // --- Jaipur ---
  { id: "h16", name: "Rambagh Palace", city: "Jaipur", address: "Bhawani Singh Road, Jaipur", description: "Once the residence of the Maharaja of Jaipur, this palace hotel is a living museum of Rajasthani royalty with peacock-filled gardens.", price: 35000, rating: 4.95, review_count: 3200, images: ["https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 26.8951, lng: 75.8043, is_featured: true },
  { id: "h17", name: "Samode Haveli", city: "Jaipur", address: "Gangapole, Jaipur", description: "A 175-year-old haveli in the walled city, meticulously restored with hand-painted frescoes, a gorgeous mosaic pool, and rooftop dining.", price: 12000, rating: 4.6, review_count: 567, images: ["https://images.unsplash.com/photo-1542314831-c6a4d10d8766?w=800"], amenities: ["wifi","pool","restaurant","spa","parking"], category: "resort", lat: 26.9310, lng: 75.8266, is_featured: false },
  { id: "h18", name: "Zostel Jaipur", city: "Jaipur", address: "MI Road, Jaipur", description: "India's most popular backpacker hostel chain. Vibrant common areas, fantastic location, and fellow travelers from around the world.", price: 1200, rating: 4.1, review_count: 890, images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"], amenities: ["wifi","ac"], category: "budget", lat: 26.9167, lng: 75.8000, is_featured: false },

  // --- Goa ---
  { id: "h19", name: "Taj Exotica Resort & Spa", city: "Goa", address: "Benaulim Beach, South Goa", description: "Set on 56 acres of landscaped gardens beside a beautiful Benaulim beach, this Mediterranean-style resort is Goa's finest.", price: 18000, rating: 4.75, review_count: 1670, images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800","https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "resort", lat: 15.2610, lng: 73.9308, is_featured: true },
  { id: "h20", name: "W Goa", city: "Goa", address: "Vagator Beach, North Goa", description: "Trendy, design-forward resort overlooking the cliffs of Vagator. The WET Pool and AWAY Spa redefine Goa's party-luxury scene.", price: 22000, rating: 4.6, review_count: 780, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar"], category: "resort", lat: 15.6020, lng: 73.7407, is_featured: false },
  { id: "h21", name: "Palolem Beach Cottages", city: "Goa", address: "Palolem Beach, Canacona", description: "Charming beachfront bamboo cottages with the sound of the waves as your alarm clock. Simple living in paradise.", price: 3500, rating: 4.0, review_count: 234, images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800"], amenities: ["wifi","bar","parking"], category: "beach", lat: 15.0100, lng: 74.0232, is_featured: false },

  // --- Kerala ---
  { id: "h22", name: "Kumarakom Lake Resort", city: "Kerala", address: "Kumarakom, Kerala", description: "A luxury lakeside property on the banks of Vembanad Lake with private houseboat experiences and Ayurvedic spa treatments.", price: 20000, rating: 4.8, review_count: 1120, images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800","https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800"], amenities: ["wifi","pool","spa","restaurant","bar","roomService","parking"], category: "resort", lat: 9.5916, lng: 76.4299, is_featured: true },
  { id: "h23", name: "Marari Beach Resort", city: "Kerala", address: "Mararikulam, Alappuzha", description: "A serene beachside eco-resort hidden among coconut groves and fishing villages. The organic farm-to-table dining is exceptional.", price: 12000, rating: 4.5, review_count: 670, images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"], amenities: ["wifi","pool","spa","restaurant","parking"], category: "beach", lat: 9.5862, lng: 76.2980, is_featured: false },

  // --- Udaipur ---
  { id: "h24", name: "Taj Lake Palace", city: "Udaipur", address: "Lake Pichola, Udaipur", description: "Floating like a marble dream on Lake Pichola, this 18th-century palace is India's most romantic hotel — a Bond movie filming location.", price: 40000, rating: 4.95, review_count: 2890, images: ["https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800","https://images.unsplash.com/photo-1542314831-c6a4d10d8766?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService"], category: "luxury", lat: 24.5726, lng: 73.6802, is_featured: true },
  { id: "h25", name: "Shiv Niwas Palace", city: "Udaipur", address: "City Palace Complex, Udaipur", description: "Part of the City Palace complex, once the royal guest house. Stay in rooms where maharajas entertained kings and queens.", price: 15000, rating: 4.6, review_count: 890, images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"], amenities: ["wifi","pool","spa","restaurant","bar","roomService"], category: "luxury", lat: 24.5764, lng: 73.6913, is_featured: false },

  // --- Manali / Hills ---
  { id: "h26", name: "The Himalayan Village", city: "Manali", address: "Kasol Road, Jari, Kullu Valley", description: "Himalayan luxury redefined — hand-built stone cottages with private hot tubs overlooking the Parvati Valley and snow-capped peaks.", price: 11000, rating: 4.7, review_count: 456, images: ["https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800","https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"], amenities: ["wifi","spa","restaurant","parking"], category: "resort", lat: 32.0100, lng: 77.3100, is_featured: true },
  { id: "h27", name: "Zostel Manali", city: "Manali", address: "Old Manali, Himachal Pradesh", description: "Backpacker paradise in Old Manali with bonfire nights, mountain treks, and the best location for exploring the valley.", price: 800, rating: 4.2, review_count: 1200, images: ["https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"], amenities: ["wifi"], category: "budget", lat: 32.2651, lng: 77.1865, is_featured: false },

  // --- Kolkata ---
  { id: "h28", name: "The Oberoi Grand", city: "Kolkata", address: "Chowringhee Road, Kolkata", description: "The Grande Dame of Calcutta. A colonial-era masterpiece on JL Nehru Road with marble lobbies, chandeliers, and old-world charm.", price: 13000, rating: 4.6, review_count: 980, images: ["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 22.5582, lng: 88.3513, is_featured: false },

  // --- Hyderabad ---
  { id: "h29", name: "Taj Falaknuma Palace", city: "Hyderabad", address: "Falaknuma, Hyderabad", description: "Perched 2,000 feet above the city, this Italian marble palace was once the Nizam's residence. The mile-long dining table seats 101.", price: 32000, rating: 4.9, review_count: 1560, images: ["https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800","https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 17.3316, lng: 78.4677, is_featured: true },

  // --- Chennai ---
  { id: "h30", name: "ITC Grand Chola", city: "Chennai", address: "Guindy, Chennai", description: "India's largest luxury hotel, inspired by the grand Chola dynasty. A massive 600-room property with 12 restaurants and bars.", price: 15000, rating: 4.7, review_count: 1240, images: ["https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800"], amenities: ["wifi","pool","spa","gym","restaurant","bar","roomService","parking"], category: "luxury", lat: 13.0110, lng: 80.2115, is_featured: false },
];

// ---------- ROOMS for each hotel ----------
const ROOMS = [];
let roomCounter = 100;

const ROOM_TEMPLATES = {
  luxury: [
    { type: "Deluxe Room", priceFactor: 1.0, capacity: 2, bed_type: "1 King Bed", features: ["City View", "Mini Bar", "Marble Bathroom"], qty: 20 },
    { type: "Premier Suite", priceFactor: 1.8, capacity: 2, bed_type: "1 King Bed", features: ["Living Area", "Premium View", "Butler Service", "Mini Bar"], qty: 10 },
    { type: "Presidential Suite", priceFactor: 3.5, capacity: 4, bed_type: "2 King Beds", features: ["Private Dining", "Butler Service", "Jacuzzi", "Study Room"], qty: 2 },
  ],
  resort: [
    { type: "Garden View Room", priceFactor: 1.0, capacity: 2, bed_type: "1 King Bed", features: ["Garden View", "Private Patio", "Mini Bar"], qty: 15 },
    { type: "Pool Villa", priceFactor: 2.5, capacity: 4, bed_type: "1 King Bed + Daybed", features: ["Private Pool", "Outdoor Shower", "Sundeck"], qty: 5 },
    { type: "Royal Suite", priceFactor: 4.0, capacity: 4, bed_type: "2 King Beds", features: ["Private Pool", "Butler Service", "Living Room", "Kitchen"], qty: 2 },
  ],
  city: [
    { type: "Standard Room", priceFactor: 1.0, capacity: 2, bed_type: "1 Queen Bed", features: ["City View", "Work Desk", "Mini Fridge"], qty: 25 },
    { type: "Business Suite", priceFactor: 1.6, capacity: 2, bed_type: "1 King Bed", features: ["Separate Lounge", "Work Desk", "Express Laundry"], qty: 8 },
  ],
  beach: [
    { type: "Beach Cottage", priceFactor: 1.0, capacity: 2, bed_type: "1 Double Bed", features: ["Beach Access", "Sea View", "Fan"], qty: 12 },
    { type: "Sea View Villa", priceFactor: 2.0, capacity: 4, bed_type: "1 King Bed + Sofa", features: ["Beach Access", "Private Balcony", "AC", "Mini Bar"], qty: 4 },
  ],
  budget: [
    { type: "Standard Room", priceFactor: 1.0, capacity: 2, bed_type: "1 Double Bed", features: ["AC", "TV", "Attached Bathroom"], qty: 15 },
    { type: "Dormitory Bed", priceFactor: 0.4, capacity: 1, bed_type: "1 Bunk Bed", features: ["Shared Bathroom", "Locker", "Reading Light"], qty: 20 },
  ],
};

for (const hotel of HOTELS) {
  const templates = ROOM_TEMPLATES[hotel.category] || ROOM_TEMPLATES.city;
  for (const tmpl of templates) {
    roomCounter++;
    ROOMS.push({
      id: `r${roomCounter}`,
      hotel_id: hotel.id,
      type: tmpl.type,
      price: Math.round(hotel.price * tmpl.priceFactor),
      capacity: tmpl.capacity,
      bed_type: tmpl.bed_type,
      features: tmpl.features,
      images: hotel.images.slice(0, 1),
      quantity: tmpl.qty,
    });
  }
}

// ---------- REVIEWS ----------
const REVIEW_NAMES = [
  "Ananya Sharma", "Vikram Mehta", "Priya Patel", "Rahul Gupta", "Nisha Kapoor",
  "Arjun Singh", "Meera Reddy", "Karan Joshi", "Deepa Nair", "Siddharth Malhotra",
  "Pooja Agarwal", "Rajesh Kumar", "Simran Kaur", "Amit Verma", "Sneha Iyer",
  "Abhishek Das", "Kavya Rao", "Ravi Shankar", "Trisha Mukherjee", "Aditya Chopra",
];

const REVIEW_TEXTS_5 = [
  "Absolutely incredible experience! The staff went above and beyond. Will definitely return!",
  "One of the best stays I've ever had. The attention to detail is remarkable.",
  "Stunning property with flawless service. Worth every rupee!",
  "Perfect for a family getaway. The kids loved it as much as we did.",
  "The food alone makes this place worth visiting. Exceptional culinary experience.",
];
const REVIEW_TEXTS_4 = [
  "Great hotel overall. Minor issues with check-in timing but the room was excellent.",
  "Really enjoyed our stay. The pool area is fantastic. Would recommend.",
  "Good value for money. Clean rooms, friendly staff, convenient location.",
  "Very comfortable stay. Breakfast spread was diverse and delicious.",
  "Nice property with good amenities. The gym could be a bit better equipped.",
];
const REVIEW_TEXTS_3 = [
  "Decent hotel for the price. Nothing extraordinary but gets the job done.",
  "Average experience. The room was clean but the walls could use some paint.",
  "Location is great but the facilities feel a bit dated. Still a good option for budget travelers.",
];

const REVIEWS = [];
for (const hotel of HOTELS) {
  const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews each
  for (let i = 0; i < numReviews; i++) {
    const name = REVIEW_NAMES[Math.floor(Math.random() * REVIEW_NAMES.length)];
    let rating, text;
    if (hotel.rating >= 4.5) {
      rating = Math.random() > 0.3 ? 5 : 4;
      text = rating === 5 ? REVIEW_TEXTS_5[Math.floor(Math.random() * REVIEW_TEXTS_5.length)] : REVIEW_TEXTS_4[Math.floor(Math.random() * REVIEW_TEXTS_4.length)];
    } else if (hotel.rating >= 4.0) {
      rating = Math.random() > 0.5 ? 4 : 3;
      text = rating === 4 ? REVIEW_TEXTS_4[Math.floor(Math.random() * REVIEW_TEXTS_4.length)] : REVIEW_TEXTS_3[Math.floor(Math.random() * REVIEW_TEXTS_3.length)];
    } else {
      rating = Math.random() > 0.5 ? 3 : 4;
      text = rating === 3 ? REVIEW_TEXTS_3[Math.floor(Math.random() * REVIEW_TEXTS_3.length)] : REVIEW_TEXTS_4[Math.floor(Math.random() * REVIEW_TEXTS_4.length)];
    }
    REVIEWS.push({ hotel_id: hotel.id, user_name: name, rating, text });
  }
}

async function seedFlood() {
  try {
    console.log(`Seeding ${HOTELS.length} hotels...`);
    const { error: hErr } = await supabase.from('hotels').upsert(HOTELS);
    if (hErr) throw hErr;
    console.log(`✅ ${HOTELS.length} hotels seeded.`);
    
    console.log(`Seeding ${ROOMS.length} rooms...`);
    const { error: rErr } = await supabase.from('rooms').upsert(ROOMS);
    if (rErr) throw rErr;
    console.log(`✅ ${ROOMS.length} rooms seeded.`);
    
    console.log(`Seeding ${REVIEWS.length} reviews...`);
    const { error: revErr } = await supabase.from('reviews').insert(REVIEWS);
    if (revErr) console.warn('Review warning (safe if running twice):', revErr.message);
    else console.log(`✅ ${REVIEWS.length} reviews seeded.`);
    
    console.log('\n🎉 Flood seed completed!');
    console.log(`Total: ${HOTELS.length} hotels, ${ROOMS.length} rooms, ${REVIEWS.length} reviews`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedFlood();
