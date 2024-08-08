import axios from 'axios';
import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve(__dirname, 'exchange-rate.json');
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; 

const calculateRate = async (allowedBudgetKM: number)=> {
  try {
    let exchangeRateData: { exchangeRate: number; dateOfCallingAPI: number } ;

    if (fs.existsSync(FILE_PATH)) {
      const fileContent = fs.readFileSync(FILE_PATH, 'utf8');
      exchangeRateData = JSON.parse(fileContent);
      const now = Date.now();
      if (now - exchangeRateData.dateOfCallingAPI < CACHE_DURATION_MS) {
        return Number(allowedBudgetKM * exchangeRateData.exchangeRate);
      }
    }
    const API_URL = process.env.EXCHANGE_API_URL as string;
    const response = await axios.get(API_URL);
    const conversionRate = response.data.rates.EUR;
    
    exchangeRateData = {
      exchangeRate: conversionRate,
      dateOfCallingAPI: Date.now()
    };
    
    fs.writeFileSync(FILE_PATH, JSON.stringify(exchangeRateData, null, 2), 'utf8');
    return Number(allowedBudgetKM * conversionRate);

  } catch (error) {
    console.error(error);
  }
};

export default calculateRate;
