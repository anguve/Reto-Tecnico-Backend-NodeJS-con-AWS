import * as yup from 'yup';
/**
 * Converts a string value to a number.
 * Returns `undefined` if the input is `undefined`, `null`, or an empty string.
 * Returns `undefined` if the conversion results in NaN.
 *
 * @param {string} originalValue - The original string value.
 * @returns {number | undefined} - The converted number or undefined if invalid.
 */
export const toNumber = (originalValue: string) => {
  if (originalValue === undefined || originalValue === null || originalValue === '')
    return undefined;
  const parsed = Number(originalValue);
  return isNaN(parsed) ? undefined : parsed;
};
/**
 * Normalizes a string value by trimming whitespace and converting to lowercase.
 * Returns `undefined` if the input is not a string, or if the normalized value is
 * 'n/a', 'unknown', or an empty string.
 *
 * @param {string} originalValue - The original string value.
 * @returns {string | undefined} - The original string if valid, otherwise undefined.
 */
export const normalizeString = (originalValue: string) => {
  if (typeof originalValue !== 'string') return undefined;
  const v = originalValue.trim().toLowerCase();
  if (v === 'n/a' || v === 'unknown' || v === '') return undefined;
  return originalValue;
};
/**
 * Validates and normalizes a date string.
 * Returns the original string if it represents a valid date.
 * Returns `undefined` if input is not a string or is an invalid date.
 *
 * @param {string} originalValue - The original string value representing a date.
 * @returns {string | undefined} - The valid date string or undefined if invalid.
 */
export const normalizeDateString = (originalValue: string) => {
  if (typeof originalValue !== 'string') return undefined;
  const date = new Date(originalValue);
  return isNaN(date.getTime()) ? undefined : originalValue;
};
/**
 * Yup schema to validate a character object.
 * Validates fields such as name, height, mass, colors, birth year, gender,
 * homeworld URL, arrays of URLs (films, species, vehicles, starships),
 * and created/edited date strings.
 */
export const characterSchema = yup.object({
  name: yup.string().required(),
  height: yup.number().notRequired().transform(toNumber).nullable(),
  mass: yup.number().notRequired().transform(toNumber).nullable(),
  hair_color: yup.string().notRequired().transform(normalizeString).nullable(),
  skin_color: yup.string().notRequired().transform(normalizeString).nullable(),
  eye_color: yup.string().notRequired().transform(normalizeString).nullable(),
  birth_year: yup.string().notRequired().transform(normalizeString).nullable(),
  gender: yup.string().notRequired().transform(normalizeString).nullable(),
  homeworld: yup.string().url().required(),
  films: yup.array().of(yup.string().url()).default([]),
  species: yup.array().of(yup.string().url()).default([]),
  vehicles: yup.array().of(yup.string().url()).default([]),
  starships: yup.array().of(yup.string().url()).default([]),
  created: yup.string().notRequired().transform(normalizeDateString).nullable(),
  edited: yup.string().notRequired().transform(normalizeDateString).nullable(),
  url: yup.string().url().required(),
});
/**
 * Yup schema to validate an array of character objects.
 */
export const charactersListSchema = yup.array().of(characterSchema).required();
/**
 * Yup schema to validate weather data.
 * Validates latitude, longitude, generation time, UTC offset, timezone strings,
 * elevation, and nested objects for current weather units and current weather values.
 */
export const weatherDataSchema = yup.object({
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  generationtime_ms: yup.number().notRequired().transform(toNumber).nullable(),
  utc_offset_seconds: yup.number().notRequired().transform(toNumber).nullable(),
  timezone: yup.string().notRequired().transform(normalizeString).nullable(),
  timezone_abbreviation: yup.string().notRequired().transform(normalizeString).nullable(),
  elevation: yup.number().notRequired().transform(toNumber).nullable(),
  current_weather_units: yup
    .object({
      time: yup.string().notRequired().transform(normalizeString).nullable(),
      interval: yup.string().notRequired().transform(normalizeString).nullable(),
      temperature: yup.string().notRequired().transform(normalizeString).nullable(),
      windspeed: yup.string().notRequired().transform(normalizeString).nullable(),
      winddirection: yup.string().notRequired().transform(normalizeString).nullable(),
      is_day: yup.string().notRequired().transform(normalizeString).nullable(),
      weathercode: yup.string().notRequired().transform(normalizeString).nullable(),
    })
    .notRequired()
    .nullable(),
  current_weather: yup
    .object({
      time: yup.string().notRequired().transform(normalizeString).nullable(),
      interval: yup.number().notRequired().transform(toNumber).nullable(),
      temperature: yup.number().notRequired().transform(toNumber).nullable(),
      windspeed: yup.number().notRequired().transform(toNumber).nullable(),
      winddirection: yup.number().notRequired().transform(toNumber).nullable(),
      is_day: yup.number().notRequired().transform(toNumber).nullable(),
      weathercode: yup.number().notRequired().transform(toNumber).nullable(),
    })
    .notRequired()
    .nullable(),
});
