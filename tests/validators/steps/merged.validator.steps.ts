import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';

import {
  toNumber,
  normalizeString,
  normalizeDateString,
  characterSchema,
  charactersListSchema,
  weatherDataSchema,
} from '../../../src/validators/merged.validator';

const feature = loadFeature(path.join(__dirname, '../features/merged.validator.feature'));

defineFeature(feature, (test) => {
  let result: any;
  let error: any;

  const givenValidationsLoaded = () => {
    result = undefined;
    error = undefined;
  };

  test('Convert string to number', ({ given, when, then }) => {
    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    when(/^I convert "([^"]*)" using toNumber$/, (value) => {
      result = toNumber(value);
    });

    then(/^the result should be (\d+)$/, (expected) => {
      expect(result).toBe(Number(expected));
    });
  });

  test('Convert non-numeric string', ({ given, when, then }) => {
    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    when(/^I convert "([^"]*)" using toNumber$/, (value) => {
      result = toNumber(value);
    });

    then(/^the result should be undefined$/, () => {
      expect(result).toBeUndefined();
    });
  });

  test('Normalize valid string', ({ given, when, then }) => {
    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    when(/^I normalize "([^"]*)"$/, (value) => {
      result = normalizeString(value);
    });

    then(/^the result should be "([^"]*)"$/, (expected) => {
      expect(result).toBe(expected);
    });
  });

  test('Normalize invalid values', ({ given, when, then }) => {
    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    when(/^I normalize "([^"]*)"$/, (value) => {
      result = normalizeString(value);
    });

    then(/^the result should be undefined$/, () => {
      expect(result).toBeUndefined();
    });
  });

  test('Normalize valid date', ({ given, when, then }) => {
    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    when(/^I normalize the date "([^"]*)"$/, (value) => {
      result = normalizeDateString(value);
    });

    then(/^the result should be "([^"]*)"$/, (expected) => {
      expect(result).toBe(expected);
    });
  });

  test('Normalize invalid date', ({ given, when, then }) => {
    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    when(/^I normalize the date "([^"]*)"$/, (value) => {
      result = normalizeDateString(value);
    });

    then(/^the result should be undefined$/, () => {
      expect(result).toBeUndefined();
    });
  });

  test('Validate valid character', ({ given, when, then }) => {
    let character: any;

    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    given(/^a valid character with all required fields$/, () => {
      character = {
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
      };
    });

    when(/^I validate it with characterSchema$/, async () => {
      result = await characterSchema.validate(character);
    });

    then(/^the validation should pass$/, () => {
      expect(result).toBeDefined();
    });
  });

  test('Validate incomplete character', ({ given, when, then }) => {
    let character: any;

    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    given(/^a character without required fields$/, () => {
      character = { height: '172' };
    });

    when(/^I validate it with characterSchema$/, async () => {
      try {
        await characterSchema.validate(character);
        result = 'pass';
      } catch {
        result = 'fail';
      }
    });

    then(/^the validation should fail$/, () => {
      expect(result).toBe('fail');
    });
  });

  test('Validate list of characters', ({ given, when, then }) => {
    let characters: any[];

    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    given(/^a list of valid characters$/, () => {
      characters = [
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
      ];
    });

    when(/^I validate it with charactersListSchema$/, async () => {
      result = await charactersListSchema.validate(characters);
    });

    then(/^the validation should pass$/, () => {
      expect(result).toBeDefined();
    });
  });

  test('Validate valid weather data', ({ given, when, then }) => {
    let weather: any;

    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    given(/^complete and correct weather data$/, () => {
      weather = {
        latitude: 12.34,
        longitude: 56.78,
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
    });

    when(/^I validate it with weatherDataSchema$/, async () => {
      result = await weatherDataSchema.validate(weather);
    });

    then(/^the validation should pass$/, () => {
      expect(result).toBeDefined();
    });
  });

  test('Validate incomplete weather data', ({ given, when, then }) => {
    let weather: any;

    given(/^I have loaded the validation functions and schemas$/, givenValidationsLoaded);

    given(/^weather data without required fields$/, () => {
      weather = {};
    });

    when(/^I validate it with weatherDataSchema$/, async () => {
      try {
        result = await weatherDataSchema.validate(weather);
      } catch (err) {
        error = err;
      }
    });

    then(/^the validation should fail$/, () => {
      expect(error).toBeDefined();
    });
  });
});
