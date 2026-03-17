import { supabase } from '../config/supabase';

export const searchHotels = async (query = '', filters = {}) => {
  let dbQuery = supabase.from('hotels').select('*');

  // Text search
  if (query.trim()) {
    // Search in name or city
    dbQuery = dbQuery.or(`name.ilike.%${query}%,city.ilike.%${query}%`);
  }

  // Category Exact match
  if (filters.category && filters.category !== 'all') {
    dbQuery = dbQuery.eq('category', filters.category);
  }

  // Minimum Rating
  if (filters.minRating) {
    dbQuery = dbQuery.gte('rating', filters.minRating);
  }

  // Amenities Filter (Array contains all)
  if (filters.amenities && filters.amenities.length > 0) {
    dbQuery = dbQuery.contains('amenities', filters.amenities);
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        dbQuery = dbQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        dbQuery = dbQuery.order('price', { ascending: false });
        break;
      case 'rating':
        dbQuery = dbQuery.order('rating', { ascending: false });
        break;
      case 'relevance':
      default:
        // By default, just order by rating
        dbQuery = dbQuery.order('rating', { ascending: false });
        break;
    }
  } else {
    dbQuery = dbQuery.order('rating', { ascending: false });
  }

  const { data, error } = await dbQuery;

  if (error) throw error;
  return data || [];
};
