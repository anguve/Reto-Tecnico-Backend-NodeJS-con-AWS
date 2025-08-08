import { SWAPI_URL } from '../../config/api/swapi.config';
import { buildWeatherUrl } from '../../config/api/weather.config';
import { charactersListSchema, weatherDataSchema } from '../../validators/merged.validator';
import pLimit from 'p-limit';
import { Character, WeatherData } from './interfaces/merged.interfaces';
export class MergedService {
  async fetchMergedData(): Promise<{
    totalCharacters: number;
    characters: (Character & { weatherData: WeatherData })[];
    error?: string;
  }> {
    try {
      const charactersData = await this.fetchJson(SWAPI_URL);
      const charactersListRaw = this.normalizeCharacters(charactersData);

      const charactersList = await charactersListSchema.validate(charactersListRaw);

      const limit = pLimit(5);

      const mergedData = await Promise.all(
        charactersList.map((character) =>
          limit(async () => {
            const planetNumber = this.extractPlanetNumber(character.homeworld);
            const weatherUrl = this.buildWeatherUrl(planetNumber);
            const rawWeatherData = await this.fetchJson(weatherUrl);
            const weatherData = await weatherDataSchema.validate(rawWeatherData);
            return {
              ...character,
              weatherData,
            } as Character & { weatherData: WeatherData };
          }),
        ),
      );

      return {
        totalCharacters: charactersList.length,
        characters: mergedData,
      };
    } catch (error) {
      console.error('Error en fetchMergedData:', error);
      return {
        totalCharacters: 0,
        characters: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async fetchJson<T = any>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  }

  private normalizeCharacters(data: any): any[] {
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data)) return data;
    return [];
  }

  private extractPlanetNumber(homeworldUrl: string): number {
    const match = homeworldUrl.match(/\/planets\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private buildWeatherUrl(planetNumber: number): string {
    const latitude = Math.min(planetNumber + 0.6895, 90);
    return buildWeatherUrl(latitude);
  }
}
