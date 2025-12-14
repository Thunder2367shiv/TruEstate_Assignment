export const buildMongoQuery = (filters) => {
  const query = {};

  // 1. Search Logic
  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [
      { n: searchRegex },
      { p: searchRegex },
      { pn: searchRegex } 
    ];
  }

  // 2. Exact Match Logic (Short Keys)
  if (filters.region) query.r = { $in: filters.region.split(',') };     
  if (filters.category) query.c = { $in: filters.category.split(',') };  
  if (filters.paymentMethod) query.pm = { $in: filters.paymentMethod.split(',') };
  if (filters.status) query.st = { $in: filters.status.split(',') }; 
  if (filters.gender) query.g = { $in: filters.gender.split(',') };     

  if (filters.tags) {
    query.tg = { $in: filters.tags.split(',') };
  }

  if (filters.minAge || filters.maxAge) {
    query.a = {};
    if (filters.minAge) query.a.$gte = Number(filters.minAge);
    if (filters.maxAge) query.a.$lte = Number(filters.maxAge);
  }

  // 3. FIXED DATE LOGIC (The "Midnight" Fix)
  if (filters.startDate || filters.endDate) {
    query.d = {};

    if (filters.startDate) {
      // Start Date defaults to 00:00:00 (Start of day) - This is correct.
      query.d.$gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      // FIX: Set End Date to 23:59:59.999 so we include the full day
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      query.d.$lte = end;
    }
  }

  return query;
};