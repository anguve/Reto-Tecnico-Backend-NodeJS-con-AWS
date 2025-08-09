import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { MergedService } from '../../../../src/modules/merged/merged.service';
import { MergedRepository } from '../../../../src/modules/merged/merged.repository';
jest.mock('p-limit', () => {
  return jest.fn(() => (fn: any) => fn());
});
const feature = loadFeature(path.join(__dirname, '../features/merged.service.feature'));

defineFeature(feature, (test) => {
  let service: MergedService;
  let repositoryMock: Partial<MergedRepository>;
  let fetchMock: jest.Mock;
  let response: any;

  beforeEach(() => {
    fetchMock = jest.fn();

    global.fetch = fetchMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully fetch and merge data', ({ given, and, when, then }) => {
    const sampleCharactersApiResponse = {
      results: [
        {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          birth_year: '19BBY',
          gender: 'male',
          homeworld: 'https://swapi.dev/api/planets/1/',
          films: ['https://swapi.dev/api/films/1/'],
          species: [],
          vehicles: [],
          starships: [],
          created: '2014-12-09T13:50:51.644000Z',
          edited: '2014-12-20T21:17:56.891000Z',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    };

    const sampleWeatherApiResponse = {
      latitude: 1.6895,
      longitude: 50,
      generationtime_ms: '10',
      utc_offset_seconds: '3600',
      timezone: 'GMT',
      timezone_abbreviation: 'GMT',
      elevation: '100',
      current_weather_units: {
        time: 'iso8601',
        interval: 'hourly',
        temperature: '°C',
        windspeed: 'km/h',
        winddirection: 'degrees',
        is_day: '1',
        weathercode: '0',
      },
      current_weather: {
        time: '2023-01-01T00:00:00Z',
        interval: '1',
        temperature: '20',
        windspeed: '5',
        winddirection: '180',
        is_day: '1',
        weathercode: '0',
      },
    };

    given('the SWAPI API returns character data', () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(sampleCharactersApiResponse),
        }),
      );
    });

    and('the weather API returns weather data', () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(sampleWeatherApiResponse),
        }),
      );
    });

    and('the repository saves the merged data successfully', () => {
      repositoryMock = {
        saveMergedData: jest.fn().mockResolvedValue(undefined),
      };
      service = new MergedService(repositoryMock as MergedRepository);
    });

    when('I call fetchMergedData', async () => {
      response = await service.fetchMergedData();
    });

    then('the response should include totalCharacters greater than 0', () => {
      expect(response.totalCharacters).toBeGreaterThan(0);
    });

    and('the response should include an array of characters with weather data', () => {
      expect(Array.isArray(response.characters)).toBe(true);
      expect(response.characters.length).toBeGreaterThan(0);
      expect(response.characters[0]).toHaveProperty('weatherData');
    });

    and('the response should not contain an error', () => {
      expect(response.error).toBeUndefined();
    });
  });

  test('SWAPI API fetch fails', ({ given, when, then, and }) => {
    given('the SWAPI API throws an error', () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        }),
      );
      repositoryMock = {
        saveMergedData: jest.fn(),
      };
      service = new MergedService(repositoryMock as MergedRepository);
    });

    when('I call fetchMergedData', async () => {
      response = await service.fetchMergedData();
    });

    then('the response should have totalCharacters equal to 0', () => {
      expect(response.totalCharacters).toBe(0);
    });

    and('the response characters array should be empty', () => {
      expect(response.characters).toEqual([]);
    });

    and('the response should contain an error message', () => {
      expect(response.error).toBeDefined();
    });
  });

  test('Weather API fetch fails', ({ given, and, when, then }) => {
    const sampleCharactersApiResponse = {
      results: [
        {
          name: 'Luke Skywalker',
          height: '172',
          mass: '77',
          hair_color: 'blond',
          skin_color: 'fair',
          eye_color: 'blue',
          birth_year: '19BBY',
          gender: 'male',
          homeworld: 'https://swapi.dev/api/planets/1/',
          films: ['https://swapi.dev/api/films/1/'],
          species: [],
          vehicles: [],
          starships: [],
          created: '2014-12-09T13:50:51.644000Z',
          edited: '2014-12-20T21:17:56.891000Z',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    };

    given('the SWAPI API returns character data', () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(sampleCharactersApiResponse),
        }),
      );
    });

    and('the weather API throws an error for any character', () => {
      fetchMock.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        }),
      );
      repositoryMock = {
        saveMergedData: jest.fn(),
      };
      service = new MergedService(repositoryMock as MergedRepository);
    });

    when('I call fetchMergedData', async () => {
      response = await service.fetchMergedData();
    });

    then('the response should have totalCharacters equal to 0', () => {
      expect(response.totalCharacters).toBe(0);
    });

    and('the response characters array should be empty', () => {
      expect(response.characters).toEqual([]);
    });

    and('the response should contain an error message', () => {
      expect(response.error).toBeDefined();
    });
  });
});
