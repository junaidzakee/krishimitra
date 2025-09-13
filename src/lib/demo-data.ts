import type { WeatherForecast, MarketPrice } from '@/types';
import { subDays } from 'date-fns';

const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const getDemoWeather = (): WeatherForecast => {
  const today = new Date();
  
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const hour = (today.getHours() + i) % 24;
    return {
      time: `${hour}:00`,
      temperature: 20 + Math.floor(Math.random() * 10) - i/4,
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    };
  });

  const daily = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      day: daysOfWeek[date.getDay()],
      high: 28 + Math.floor(Math.random() * 5),
      low: 18 + Math.floor(Math.random() * 5),
      condition: weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
    };
  });

  return {
    current: {
      temperature: 25,
      condition: 'Partly Cloudy',
      location: 'Bengaluru, India',
      humidity: 60,
      windSpeed: 15,
    },
    hourly,
    daily,
  };
};

export const getCurrentWeather = () => getDemoWeather().current;

const generatePriceData = (basePrice: number, numDays: number): { date: Date; price: number }[] => {
  const today = new Date();
  return Array.from({ length: numDays }, (_, i) => ({
    date: subDays(today, numDays - 1 - i),
    price: parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.2)).toFixed(2)),
  })).sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getMarketPrices = (): MarketPrice[] => [
  {
    crop: 'Wheat',
    data: generatePriceData(250, 30),
  },
  {
    crop: 'Rice',
    data: generatePriceData(400, 30),
  },
  {
    crop: 'Corn',
    data: generatePriceData(180, 30),
  },
    {
    crop: 'Soybean',
    data: generatePriceData(550, 30),
  },
];
