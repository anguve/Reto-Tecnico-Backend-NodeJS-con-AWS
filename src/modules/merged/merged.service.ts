import { SWAPI_URL } from '../../config/api/swapi.config';
import { buildWeatherUrl } from '../../config/api/weather.config';
import { charactersListSchema, weatherDataSchema } from '../../validators/merged.validator';
import pLimit from 'p-limit';
import { Character, WeatherData } from './interfaces/merged.interfaces';
import { MergedRepository } from './merged.repository';

export class MergedService {
  private readonly repository: MergedRepository;

  /**
   * Creates an instance of MergedService.
   * @param {MergedRepository} repository - Repository instance for data persistence.
   */
  constructor(repository: MergedRepository) {
    this.repository = repository;
  }

  /**
   * Fetches character data from SWAPI, enriches each character with weather data
   * based on their homeworld, validates the combined data, saves it to DynamoDB,
   * and returns the merged results.
   *
   * @async
   * @returns {Promise<{
   *   totalCharacters: number;
   *   characters: (Character & { weatherData: WeatherData })[];
   *   error?: string;
   * }>} An object containing the total number of characters, an array of merged character and weather data,
   * and optionally an error message if the operation failed.
   */
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

      await this.repository.saveMergedData({
        totalCharacters: charactersList.length,
        characters: mergedData,
      });

      return {
        totalCharacters: charactersList.length,
        characters: mergedData,
      };
    } catch (error) {
      return {
        totalCharacters: 0,
        characters: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
  /**
   * Fetches JSON data from a given URL.
   *
   * @private
   * @template T
   * @param {string} url - The URL to fetch JSON data from.
   * @returns {Promise<T>} The parsed JSON data.
   * @throws Will throw an error if the fetch response is not ok.
   */
  private async fetchJson<T = any>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching ${url}: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  }

  /**
   * Normalizes the raw character data into a consistent array of characters.
   *
   * @private
   * @param {any} data - The raw data to normalize.
   * @returns {any[]} An array of character objects.
   */

  private normalizeCharacters(data: any): any[] {
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data)) return data;
    return [];
  }
  /**
   * Extracts the planet number from a given homeworld URL.
   *
   * @private
   * @param {string} homeworldUrl - The URL of the character's homeworld.
   * @returns {number} The extracted planet number or 0 if not found.
   */
  private extractPlanetNumber(homeworldUrl: string): number {
    const match = homeworldUrl.match(/\/planets\/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  /**
   * Builds the weather API URL based on the given planet number.
   *
   * @private
   * @param {number} planetNumber - The number identifier of the planet.
   * @returns {string} The constructed weather API URL.
   */
  private buildWeatherUrl(planetNumber: number): string {
    const latitude = Math.min(planetNumber + 0.6895, 90);
    return buildWeatherUrl(latitude);
  }
}
