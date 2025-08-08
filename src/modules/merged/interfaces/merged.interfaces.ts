export interface Character {
  name: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  birth_year?: string;
  gender?: string;
  homeworld: string;
  films?: string[];
  species?: string[];
  vehicles?: string[];
  starships?: string[];
  created?: string;
  edited?: string;
  url: string;
}
export interface WeatherDataUnits {
  time?: string;
  interval?: string;
  temperature?: string;
  windspeed?: string;
  winddirection?: string;
  is_day?: string;
  weathercode?: string;
}

export interface CurrentWeather {
  time?: string;
  interval?: number;
  temperature?: number;
  windspeed?: number;
  winddirection?: number;
  is_day?: number;
  weathercode?: number;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone?: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current_weather_units?: WeatherDataUnits;
  current_weather?: CurrentWeather;
}
