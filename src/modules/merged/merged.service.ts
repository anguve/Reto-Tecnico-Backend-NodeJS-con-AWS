import { SWAPI_URL } from '../../config/api/swapi.config';
import { WEATHER_URL } from '../../config/api/weather.config';
import {
  MergedData,
  SwapiPeopleResponse,
  WeatherApiResponse,
} from './interfaces/merged.interfaces';

export class MergedService {
  async fetchMergedData(): Promise<MergedData> {
    const [characterResponse, weatherResponse] = await Promise.all([
      this.fetchFromUrl(SWAPI_URL),
      this.fetchFromUrl(WEATHER_URL),
    ]);

    const characters = (await characterResponse.json()) as SwapiPeopleResponse[];
    const weatherData = (await weatherResponse.json()) as WeatherApiResponse;

    return { characters, weatherData };
  }

  private async fetchFromUrl(url: string): Promise<Response> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${url}. Status: ${response.status}`);
    }

    return response;
  }
}
