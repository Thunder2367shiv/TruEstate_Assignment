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

  if (filters.dateRange) {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    let startDate;
    let endDate = today;

    switch (filters.dateRange) {
      case 'Today':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0); 
        break;
      case 'Last 7 Days':
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        break;
      case 'Last 30 Days':
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); 
        break;
      case 'Last Month':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        break;
    }

    if (startDate) {
      query.d = { $gte: startDate, $lte: endDate };
    }
  }

  if (filters.startDate || filters.endDate) {
    if (!query.d) query.d = {}; 
    if (filters.startDate) query.d.$gte = new Date(filters.startDate);
    if (filters.endDate) query.d.$lte = new Date(filters.endDate);
  }

  return query;
};