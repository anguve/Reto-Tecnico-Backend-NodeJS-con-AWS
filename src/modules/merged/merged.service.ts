import { SWAPI_URL } from '../../config/api/swapi.config';

export class MergedService {
  async fetchMergedData(): Promise<{
    totalCharacters: number;
    characters: any[];
    error?: string;
  }> {
    try {
      const charactersData = await this.fetchJson(SWAPI_URL);
      const charactersList = this.normalizeCharacters(charactersData);

      const mergedData = await Promise.all(
        charactersList.map(async (character) => {
          const planetNumber = this.extractPlanetNumber(character.homeworld);
          const weatherUrl = this.buildWeatherUrl(planetNumber);
          const weatherData = await this.fetchJson(weatherUrl);

          return {
            ...character,
            weatherData,
          };
        }),
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
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=167.6917&current_weather=true`;
  }
}
