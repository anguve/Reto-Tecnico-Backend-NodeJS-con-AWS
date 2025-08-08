/**
 * Interface representing the current weather response from the Weather API.
 */
export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather_units: WeatherUnits;
  current_weather: CurrentWeather;
}

export interface SwapiPeopleApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SwapiPeopleResponse[];
}

/**
 * Interface for units used in the Weather API response.
 */
export interface WeatherUnits {
  time: string;
  interval: string;
  temperature: string;
  windspeed: string;
  winddirection: string;
  is_day: string;
  weathercode: string;
}

/**
 * Interface for the current weather details in the Weather API response.
 */
export interface CurrentWeather {
  time: string;
  interval: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: number;
}

/**
 * Interface representing a single Star Wars character returned by the SWAPI.
 */
export interface SwapiPeopleResponse {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface CharacterWithWeather {
  name: string;
  gender: string;
  homeworld: string;
  weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    is_day: boolean;
    weathercode: number;
  };
}

/**
 * Interface representing the combined data returned by the merged service.
 */
export interface MergedData {
  characters: SwapiPeopleResponse[];
  weatherData: WeatherApiResponse;
}
