import type { WeatherForecast, MarketPrice } from '@/types';
import { subDays, startOfHour } from 'date-fns';

const weatherConditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// We need a fixed date to avoid hydration errors
const getFixedDate = () => {
    // This will be consistent across server and client
    const now = new Date();
    // Set minutes, seconds, and milliseconds to 0 to make it more stable
    now.setMinutes(0, 0, 0);
    return now;
}

export const getDemoWeather = (): WeatherForecast => {
  const today = getFixedDate();
  
  const hourly = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(today.getTime() + i * 60 * 60 * 1000);
    const hour = date.getHours();
    return {
      time: `${hour}:00`,
      temperature: 20 + Math.floor(Math.sin(i / 2) * 5) + Math.floor(Math.random() * 2), // More predictable
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

const generatePriceData = (basePrice: number, numDays: number): { date: string; price: number }[] => {
  const today = new Date();
  return Array.from({ length: numDays }, (_, i) => ({
    date: subDays(today, numDays - 1 - i).toISOString(),
    price: parseFloat((basePrice + (Math.random() - 0.5) * (basePrice * 0.2)).toFixed(2)),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getMarketPrices = (t: (key: string) => string): MarketPrice[] => [
  {
    crop: t('crops.wheat'),
    data: generatePriceData(250, 30),
  },
  {
    crop: t('crops.rice'),
    data: generatePriceData(400, 30),
  },
  {
    crop: t('crops.corn'),
    data: generatePriceData(180, 30),
  },
    {
    crop: t('crops.soybean'),
    data: generatePriceData(550, 30),
  },
];
