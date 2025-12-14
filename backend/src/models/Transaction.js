import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  n: { type: String, required: true }, 
  p: { type: String }, 
  g: { type: String }, 
  a: { type: Number }, 
  r: { type: String, index: true }, 
  ct: { type: String },

  pn: { type: String },
  b: { type: String },
  c: { type: String, index: true }, 
  tg: [String],

  q: { type: Number, required: true },
  ppu: { type: Number },
  dsc: { type: Number },
  ta: { type: Number },
  fa: { type: Number },

  d: { type: Date, required: true, index: true }, 
  pm: { type: String },
  st: { type: String },

}, { 
  timestamps: false, 
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

TransactionSchema.virtual('customer.name').get(function() { return this.n; });
TransactionSchema.virtual('customer.phone').get(function() { return this.p; });
TransactionSchema.virtual('customer.gender').get(function() { return this.g; });
TransactionSchema.virtual('customer.age').get(function() { return this.a; });
TransactionSchema.virtual('customer.region').get(function() { return this.r; });
TransactionSchema.virtual('customer.type').get(function() { return this.ct; });

TransactionSchema.virtual('product.name').get(function() { return this.pn; });
TransactionSchema.virtual('product.brand').get(function() { return this.b; });
TransactionSchema.virtual('product.category').get(function() { return this.c; });
TransactionSchema.virtual('product.tags').get(function() { return this.tg; });

TransactionSchema.virtual('sales.quantity').get(function() { return this.q; });
TransactionSchema.virtual('sales.pricePerUnit').get(function() { return this.ppu; });
TransactionSchema.virtual('sales.discount').get(function() { return this.dsc; });
TransactionSchema.virtual('sales.totalAmount').get(function() { return this.ta; });
TransactionSchema.virtual('sales.finalAmount').get(function() { return this.fa; });

TransactionSchema.virtual('meta.date').get(function() { return this.d; });
TransactionSchema.virtual('meta.paymentMethod').get(function() { return this.pm; });
TransactionSchema.virtual('meta.status').get(function() { return this.st; });

TransactionSchema.index({ r: 1, d: -1 }); 
TransactionSchema.index({ c: 1, q: -1 });

export default mongoose.model('Transaction', TransactionSchema);