import Transaction from '../models/Transaction.js';
import { buildMongoQuery } from '../utils/queryBuilder.js';

export const fetchTransactions = async (params) => {
  const { page = 1, limit = 10, sortBy = 'date', order = 'desc' } = params;
  
  const query = buildMongoQuery(params);
  const sortOptions = {
    date: 'd',   
    quantity: 'q',  
    name: 'n',     
    amount: 'ta'
  };
  
  const sortField = sortOptions[sortBy] || 'd';
  const sortDirection = order === 'asc' ? 1 : -1;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Transaction.find(query)
      .select('-__v') 
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(Number(limit)),
      
    Transaction.countDocuments(query)
  ]);

  return {
    data,
    meta: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      limit: Number(limit)
    }
  };
};

export const fetchFilterOptions = async () => {
  const [regions, categories, paymentMethods, tags] = await Promise.all([
    Transaction.distinct('r'),  
    Transaction.distinct('c'),   
    Transaction.distinct('pm'),  
    Transaction.distinct('tg')   
  ]);
  
  return { 
    regions, 
    categories, 
    paymentMethods, 
    tags 
  };
};