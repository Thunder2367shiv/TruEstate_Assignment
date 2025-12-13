import dotenv from 'dotenv';
import mongoose from 'mongoose';
import csv from 'csvtojson';
import Transaction from './src/models/Transaction.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB.');

    try {
      await mongoose.connection.db.dropCollection('transactions');
      console.log('Old Collection & Indexes Dropped (Fresh Start).');
    } catch (err) {
      if (err.code === 26) {
        console.log('Collection does not exist yet (Skipping drop).');
      } else {
        throw err;
      }
    }

    await Transaction.createCollection();
    console.log('New Collection Created.');

    const csvFilePath = path.join(__dirname, 'data.csv');
    const BATCH_SIZE = 5000; 
    let batch = [];
    let counter = 0;

    console.log('Starting Compressed Stream Import...');

    await csv()
      .fromFile(csvFilePath)
      .subscribe(async (json) => {
        const compressedItem = {
          n: json['Customer Name'],
          p: json['Phone Number'],
          g: json['Gender'],
          a: Number(json['Age']),
          r: json['Customer Region'],
          ct: json['Customer Type'],
          
          pn: json['Product Name'],
          b: json['Brand'],
          c: json['Product Category'],
          tg: json['Tags'] ? json['Tags'].split(',').map(t => t.trim()) : [],
          
          q: Number(json['Quantity']),
          ppu: Number(json['Price per Unit']),
          dsc: Number(json['Discount Percentage']),
          ta: Number(json['Total Amount']),
          fa: Number(json['Final Amount']),
          
          d: new Date(json['Date']),
          pm: json['Payment Method'],
          st: json['Order Status']
        };

        batch.push(compressedItem);

        if (batch.length >= BATCH_SIZE) {
          await Transaction.insertMany(batch);
          counter += batch.length;
          console.log(`Processed ${counter} records...`);
          batch = []; 
        }
      });

    if (batch.length > 0) {
      await Transaction.insertMany(batch);
      counter += batch.length;
      console.log(`Processed ${counter} records...`);
    }

    console.log('Full Dataset Import Completed Successfully!');
    process.exit();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedDB();