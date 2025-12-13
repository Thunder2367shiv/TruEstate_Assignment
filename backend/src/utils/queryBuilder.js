export const buildMongoQuery = (filters) => {
  const query = {};

  if (filters.search) {
    const searchRegex = new RegExp(filters.search, 'i');
    query.$or = [
      { n: searchRegex },
      { p: searchRegex },
      { pn: searchRegex } 
    ];
  }

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

  if (filters.startDate || filters.endDate) {
    query.d = {};
    if (filters.startDate) query.d.$gte = new Date(filters.startDate);
    if (filters.endDate) query.d.$lte = new Date(filters.endDate);
  }

  return query;
};