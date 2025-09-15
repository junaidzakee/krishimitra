export type WeatherForecast = {
  current: {
    temperature: number;
    condition: string;
    location: string;
    humidity: number;
    windSpeed: number;
  };
  hourly: {
    time: string;
    temperature: number;
    condition: string;
  }[];
  daily: {
    day: string;
    high: number;
    low: number;
    condition: string;
  }[];
};

export type MarketPrice = {
  crop: string;
  data: {
    date: string; // Changed from Date to string to avoid serialization issues
    price: number;
  }[];
};
