import type { WeatherForecast, MarketPrice } from '@/types';
import type { Product } from '@/types/shopping-cart';
import type { FarmHealthData } from '@/types/farm-health';
import { subDays } from 'date-fns';
import type { AnalyticsData } from '@/types/analytics';

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

export const getMarketplaceProducts = (t: (key: string) => string): Product[] => [
  {
    id: '1',
    name: t('products.fertilizer.name'),
    description: t('products.fertilizer.description'),
    price: 1250.00,
    category: t('products.categories.fertilizers'),
    imageUrl: 'https://picsum.photos/seed/fertilizer/400/400'
  },
  {
    id: '2',
    name: t('products.wheatSeeds.name'),
    description: t('products.wheatSeeds.description'),
    price: 800.00,
    category: t('products.categories.seeds'),
    imageUrl: 'https://picsum.photos/seed/wheat/400/400'
  },
  {
    id: '3',
    name: t('products.pesticide.name'),
    description: t('products.pesticide.description'),
    price: 1500.00,
    category: t('products.categories.pesticides'),
    imageUrl: 'https://picsum.photos/seed/pesticide/400/400'
  },
  {
    id: '4',
    name: t('products.spade.name'),
    description: t('products.spade.description'),
    price: 600.00,
    category: t('products.categories.tools'),
    imageUrl: 'https://picsum.photos/seed/spade/400/400'
  },
   {
    id: '5',
    name: t('products.cornSeeds.name'),
    description: t('products.cornSeeds.description'),
    price: 950.00,
    category: t('products.categories.seeds'),
    imageUrl: 'https://picsum.photos/seed/corn/400/400'
  },
  {
    id: '6',
    name: t('products.organicManure.name'),
    description: t('products.organicManure.description'),
    price: 500.00,
    category: t('products.categories.fertilizers'),
    imageUrl: 'https://picsum.photos/seed/manure/400/400'
  },
];

export const getFarmHealthData = (t: (key: string) => string): FarmHealthData => {
  return {
    overallScore: 0.85,
    soilQuality: {
      status: t('farmHealth.statuses.good'),
      ph: 6.8,
      nitrogen: 45,
    },
    cropVigor: {
      status: t('farmHealth.statuses.good'),
      ndvi: 0.78,
    },
    pestDiseaseRisk: {
      status: t('farmHealth.statuses.low'),
    },
    fieldStatus: [
      { id: '1', name: t('farmHealth.fields.north'), crop: t('crops.wheat'), status: t('farmHealth.statuses.healthy') },
      { id: '2', name: t('farmHealth.fields.south'), crop: t('crops.corn'), status: t('farmHealth.statuses.healthy') },
      { id: '3', name: t('farmHealth.fields.east'), crop: t('crops.soybean'), status: t('farmHealth.statuses.warning') },
      { id: '4', name: t('farmHealth.fields.west'), crop: t('crops.rice'), status: t('farmHealth.statuses.healthy') },
    ],
    activeAlerts: [
      { id: '1', title: t('farmHealth.alerts.soybean.title'), description: t('farmHealth.alerts.soybean.description'), risk: 'Medium' },
      { id: '2', title: t('farmHealth.alerts.weather.title'), description: t('farmHealth.alerts.weather.description'), risk: 'Low' },
    ],
  };
};

export const getAnalyticsData = (t: (key: string) => string): AnalyticsData => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return {
    farmHealthHistory: months.map((month, i) => ({
      month,
      score: 80 + Math.random() * 5 + i * 2,
    })),
    diseaseDetections: [
      { crop: t('crops.wheat'), detections: Math.floor(Math.random() * 10) + 5 },
      { crop: t('crops.rice'), detections: Math.floor(Math.random() * 5) + 2 },
      { crop: t('crops.corn'), detections: Math.floor(Math.random() * 15) + 8 },
      { crop: t('crops.soybean'), detections: Math.floor(Math.random() * 12) + 3 },
    ],
    soilNutrientHistory: months.map((month) => ({
      month,
      nitrogen: 40 + Math.random() * 15,
      phosphorus: 20 + Math.random() * 10,
      potassium: 30 + Math.random() * 12,
    })),
  };
};
