const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
require('dotenv').config();

// Initialize Firebase Admin (You need a serviceAccountKey.json file for this)
// Replace with your actual service account key path or use default credentials if deployed on GCP
// const serviceAccount = require('./serviceAccountKey.json');
// initializeApp({ credential: cert(serviceAccount) });
// const db = getFirestore();

console.log('Seed script requires Firebase Admin setup.');
console.log('To run this, download your service account key from Firebase Console -> Project Settings -> Service Accounts.');
console.log('Save it as scripts/serviceAccountKey.json, uncomment the Firebase Admin init code in this file, and run `node scripts/seedFirestore.js`');

const HOTELS_DATA = [
  {
    id: "h1",
    name: "Grand Horizon Resort",
    city: "Bali",
    address: "123 Coastal Road, Seminyak, Bali",
    description: "Experience luxury living by the sea with stunning sunset views and private beach access.",
    price: 15000,
    rating: 4.8,
    reviewCount: 342,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"
    ],
    amenities: ["wifi", "pool", "spa", "restaurant", "bar"],
    category: "resort",
    coordinates: { latitude: -8.6917, longitude: 115.1610 },
    isFeatured: true,
  },
  {
    id: "h2",
    name: "Urban Boutique Hotel",
    city: "Mumbai",
    address: "45 Bandra West, Mumbai, Maharashtra",
    description: "Chic and modern hotel in the heart of the city, perfect for business and leisure travelers alike.",
    price: 8500,
    rating: 4.5,
    reviewCount: 128,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c0d12e86?w=800",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"
    ],
    amenities: ["wifi", "gym", "ac", "roomService"],
    category: "city",
    coordinates: { latitude: 19.0596, longitude: 72.8295 },
    isFeatured: false,
  },
  {
    id: "h3",
    name: "Taj Mahal Palace",
    city: "Mumbai",
    address: "Apollo Bunder, Colaba, Mumbai",
    description: "An iconic symbol of Indian hospitality, offering unparalleled luxury and views of the Arabian Sea.",
    price: 25000,
    rating: 4.9,
    reviewCount: 2150,
    images: [
      "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=800",
      "https://images.unsplash.com/photo-1542314831-c6a4d10d8766?w=800"
    ],
    amenities: ["wifi", "pool", "gym", "spa", "restaurant", "bar", "roomService"],
    category: "luxury",
    coordinates: { latitude: 18.9217, longitude: 72.8332 },
    isFeatured: true,
  },
  {
    id: "h4",
    name: "Goa Beach Retreat",
    city: "Goa",
    address: "78 Palolem Beach Road, South Goa",
    description: "A serene getaway with eco-friendly cottages right on the sandy shores of Palolem beach.",
    price: 6000,
    rating: 4.4,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"
    ],
    amenities: ["wifi", "pool", "bar", "parking"],
    category: "beach",
    coordinates: { latitude: 15.0100, longitude: 74.0232 },
    isFeatured: true,
  },
  {
    id: "h5",
    name: "Budget Inn Metro",
    city: "Delhi",
    address: "Connaught Place, New Delhi",
    description: "Affordable and clean accommodation for backpackers and short stays.",
    price: 2500,
    rating: 3.9,
    reviewCount: 45,
    images: [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"
    ],
    amenities: ["wifi", "ac"],
    category: "budget",
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    isFeatured: false,
  }
];

const ROOMS_DATA = [
  {
    id: "r1",
    hotelId: "h1",
    type: "Deluxe Ocean View",
    price: 15000,
    capacity: 2,
    bedType: "1 King Bed",
    features: ["Ocean View", "Balcony", "Mini Bar"],
    images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"],
    quantity: 10
  },
  {
    id: "r2",
    hotelId: "h1",
    type: "Presidential Suite",
    price: 45000,
    capacity: 4,
    bedType: "2 King Beds",
    features: ["Private Pool", "Butler Service", "Ocean View"],
    images: ["https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800"],
    quantity: 2
  },
  {
    id: "r3",
    hotelId: "h3",
    type: "Taj Club City View",
    price: 25000,
    capacity: 2,
    bedType: "1 King Bed",
    features: ["City View", "Club Lounge Access", "Butler"],
    images: ["https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800"],
    quantity: 15
  }
];

const REVIEWS_DATA = [
  {
    hotelId: "h1",
    userName: "Alex Johnson",
    rating: 5,
    text: "Absolutely breathtaking views and top-notch service. Will come back!",
    createdAt: new Date().toISOString()
  },
  {
    hotelId: "h1",
    userName: "Sarah Williams",
    rating: 4,
    text: "Great resort but the restaurants are a bit overpriced.",
    createdAt: new Date().toISOString()
  },
  {
    hotelId: "h3",
    userName: "Ratan T.",
    rating: 5,
    text: "An experience of a lifetime. The heritage shines through.",
    createdAt: new Date().toISOString()
  }
];

async function seedData() {
  // Uncomment below once 'db' is initialized
  /*
  try {
    console.log('Seeding hotels...');
    for (const hotel of HOTELS_DATA) {
      await db.collection('hotels').doc(hotel.id).set(hotel);
    }
    
    console.log('Seeding rooms...');
    for (const room of ROOMS_DATA) {
      await db.collection('rooms').doc(room.id).set(room);
    }
    
    console.log('Seeding reviews...');
    for (const review of REVIEWS_DATA) {
      await db.collection('reviews').add({
        ...review,
        createdAt: new Date(review.createdAt)
      });
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
  */
  console.log('Dry run complete. Uncomment the db write code in the script to actually write to Firestore.');
}

seedData();
