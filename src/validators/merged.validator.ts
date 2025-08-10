import * as yup from 'yup';

const URL_MAX = 2048;
const NAME_MAX = 100;
const COLOR_MAX = 40;
const GENERIC_STR_MAX = 50;
const BIRTH_YEAR_MAX = 12;
const ISO_DATE_STR_MAX = 40;

const ARRAY_URL_MAX_LEN = 30;
const CHAR_LIST_MAX = 1000;

const HEIGHT_MAX = 500;
const MASS_MAX = 1000;

const LAT_MAX = 90;
const LON_MAX = 180;
const GEN_TIME_MS_MAX = 60000;
const UTC_OFFSET_MAX = 50400;
const ELEVATION_MAX = 10000;
const INTERVAL_SEC_MAX = 86400;
const TEMP_C_MAX = 100;
const WIND_KMH_MAX = 500;
const WIND_DIR_MAX = 360;
const IS_DAY_MAX = 1;
const WEATHER_CODE_MAX = 99;

const RE_URL =
  /^(https?):\/\/[A-Za-z0-9][A-Za-z0-9+.\-]*:\/\/(?!$)|^https?:\/\/[A-Za-z0-9\-._~:/?#\[\]@!$&'()*+,;=%]+$/u;

const RE_NAME = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N} .,'\-]*$/u;

const RE_COLOR_LIST = /^[\p{L}\p{M}\d\s,\-]+$/u;
const RE_GENERIC_TEXT = /^[\p{L}\p{M}\p{N}\s.,'()_\-\/+]+$/u;

const RE_BIRTH_YEAR = /^\d+(?:\.\d+)?(?:BBY|ABY)$/u;

const RE_ISO_Z = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/u;

const RE_ISO_FLEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?Z?$/u;

const RE_TZ_ABBR = /^[A-Z]{1,10}$/u;
const RE_TZ = /^[A-Za-z_\-+/]+(?:\/[A-Za-z_\-+]+)*$/u;

const RE_UNITS = /^[\p{L}\p{M}\d\s\/°\-]+$/u;
/**
 * Convierte un string a número; retorna `undefined` si viene vacío, null,
 * undefined o no es convertible.
 *
 * @param {string} originalValue - Valor original a convertir.
 * @returns {number|undefined} Número convertido o `undefined` si no aplica.
 *
 */
export const toNumber = (originalValue: string) => {
  if (originalValue === undefined || originalValue === null || originalValue === '')
    return undefined;
  const parsed = Number(originalValue);
  return isNaN(parsed) ? undefined : parsed;
};
/**
 * Normaliza strings: `trim` + `toLowerCase`. Si el valor es 'n/a', 'unknown'
 * o vacío, retorna `undefined` para excluirlos del payload final.
 *
 * @param {string} originalValue - Valor original a normalizar.
 * @returns {string|undefined} El valor original (si válido) o `undefined`.
 *
 */
export const normalizeString = (originalValue: string) => {
  if (typeof originalValue !== 'string') return undefined;
  const v = originalValue.trim().toLowerCase();
  if (v === 'n/a' || v === 'unknown' || v === '') return undefined;
  return originalValue;
};
/**
 * Valida que un string represente una fecha válida (Date no NaN).
 * Si no lo es, retorna `undefined` para descartarlo.
 *
 * @param {string} originalValue - Fecha en string.
 * @returns {string|undefined} El valor original si es fecha válida; `undefined` si no.
 *
 */
export const normalizeDateString = (originalValue: string) => {
  if (typeof originalValue !== 'string') return undefined;
  const date = new Date(originalValue);
  return isNaN(date.getTime()) ? undefined : originalValue;
};
/**
 * Esquema de un **personaje** de SWAPI con:
 * - `max` para longitudes y límites numéricos
 * - `transform` para normalizar y convertir
 * - `matches` para restringir formato y evitar inyección
 *
 * Campos:
 * - name (string, requerido)
 * - height (number, opcional)
 * - mass (number, opcional)
 * - hair_color / skin_color / eye_color (string, opcional, lista de colores segura)
 * - birth_year (string, opcional, formato "##(.#)?(BBY|ABY)")
 * - gender (string, opcional, enum regex)
 * - homeworld / url (string URL, requerido)
 * - films / species / vehicles / starships (array de URLs)
 * - created / edited (ISO 8601 con Z)
 *
 * @type {yup.ObjectSchema<any>}
 */
export const characterSchema = yup.object({
  name: yup
    .string()
    .required('name es requerido')
    .max(NAME_MAX, `name: máximo ${NAME_MAX} chars`)
    .matches(RE_NAME, 'name: caracteres inválidos'),

  height: yup
    .number()
    .notRequired()
    .transform(toNumber)
    .nullable()
    .max(HEIGHT_MAX, `height: máximo ${HEIGHT_MAX}`),

  mass: yup
    .number()
    .notRequired()
    .transform(toNumber)
    .nullable()
    .max(MASS_MAX, `mass: máximo ${MASS_MAX}`),

  hair_color: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(COLOR_MAX, `hair_color: máximo ${COLOR_MAX} chars`)
    .matches(RE_COLOR_LIST, 'hair_color: solo letras, espacios, comas y guiones'),

  skin_color: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(COLOR_MAX, `skin_color: máximo ${COLOR_MAX} chars`)
    .matches(RE_COLOR_LIST, 'skin_color: solo letras, espacios, comas y guiones'),

  eye_color: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(COLOR_MAX, `eye_color: máximo ${COLOR_MAX} chars`)
    .matches(RE_COLOR_LIST, 'eye_color: solo letras, espacios, comas y guiones'),

  birth_year: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(BIRTH_YEAR_MAX, `birth_year: máximo ${BIRTH_YEAR_MAX} chars`)
    .matches(RE_BIRTH_YEAR, 'birth_year: formato válido ej. 19BBY, 41.9BBY, 8ABY'),

  gender: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(GENERIC_STR_MAX, `gender: máximo ${GENERIC_STR_MAX} chars`)
    .matches(
      /^(male|female|hermaphrodite|none)$/i,
      'gender: valores válidos male|female|hermaphrodite|none',
    ),

  homeworld: yup
    .string()
    .url('homeworld: URL inválida')
    .required('homeworld es requerido')
    .max(URL_MAX, `homeworld: URL > ${URL_MAX}`)
    .matches(RE_URL, 'homeworld: caracteres inválidos en URL'),

  films: yup
    .array()
    .of(
      yup
        .string()
        .url('film URL inválida')
        .max(URL_MAX, `film URL > ${URL_MAX}`)
        .matches(RE_URL, 'film URL: caracteres inválidos en URL'),
    )
    .max(ARRAY_URL_MAX_LEN, `films: máximo ${ARRAY_URL_MAX_LEN} elementos`)
    .default([]),

  species: yup
    .array()
    .of(
      yup
        .string()
        .url('species URL inválida')
        .max(URL_MAX, `species URL > ${URL_MAX}`)
        .matches(RE_URL, 'species URL: caracteres inválidos en URL'),
    )
    .max(ARRAY_URL_MAX_LEN, `species: máximo ${ARRAY_URL_MAX_LEN} elementos`)
    .default([]),

  vehicles: yup
    .array()
    .of(
      yup
        .string()
        .url('vehicle URL inválida')
        .max(URL_MAX, `vehicle URL > ${URL_MAX}`)
        .matches(RE_URL, 'vehicle URL: caracteres inválidos en URL'),
    )
    .max(ARRAY_URL_MAX_LEN, `vehicles: máximo ${ARRAY_URL_MAX_LEN} elementos`)
    .default([]),

  starships: yup
    .array()
    .of(
      yup
        .string()
        .url('starship URL inválida')
        .max(URL_MAX, `starship URL > ${URL_MAX}`)
        .matches(RE_URL, 'starship URL: caracteres inválidos en URL'),
    )
    .max(ARRAY_URL_MAX_LEN, `starships: máximo ${ARRAY_URL_MAX_LEN} elementos`)
    .default([]),

  created: yup
    .string()
    .notRequired()
    .transform(normalizeDateString)
    .nullable()
    .max(ISO_DATE_STR_MAX, `created: máximo ${ISO_DATE_STR_MAX} chars`)
    .matches(RE_ISO_Z, 'created: formato ISO 8601 con Z'),

  edited: yup
    .string()
    .notRequired()
    .transform(normalizeDateString)
    .nullable()
    .max(ISO_DATE_STR_MAX, `edited: máximo ${ISO_DATE_STR_MAX} chars`)
    .matches(RE_ISO_Z, 'edited: formato ISO 8601 con Z'),

  url: yup
    .string()
    .url('url inválida')
    .required('url es requerido')
    .max(URL_MAX, `url: URL > ${URL_MAX}`)
    .matches(RE_URL, 'url: caracteres inválidos en URL'),
});
/**
 * Esquema para **listado de personajes** (array) con límite de tamaño.
 * @type {yup.ArraySchema<any>}
 */
export const charactersListSchema = yup
  .array()
  .of(characterSchema)
  .required('characters es requerido')
  .max(CHAR_LIST_MAX, `characters: máximo ${CHAR_LIST_MAX} elementos`);
/**
 * Esquema de **datos de clima actual** (Open-Meteo):
 * - límites numéricos y de longitud
 * - regex para tz y abbreviations
 * - sub-objetos para unidades y lectura actual
 *
 * @type {yup.ObjectSchema<any>}
 */
export const weatherDataSchema = yup.object({
  latitude: yup
    .number()
    .required('latitude es requerido')
    .max(LAT_MAX, `latitude: máximo ${LAT_MAX}`),
  longitude: yup
    .number()
    .required('longitude es requerido')
    .max(LON_MAX, `longitude: máximo ${LON_MAX}`),

  generationtime_ms: yup
    .number()
    .notRequired()
    .transform(toNumber)
    .nullable()
    .max(GEN_TIME_MS_MAX, `generationtime_ms: máximo ${GEN_TIME_MS_MAX}`),

  utc_offset_seconds: yup
    .number()
    .notRequired()
    .transform(toNumber)
    .nullable()
    .max(UTC_OFFSET_MAX, `utc_offset_seconds: máximo ${UTC_OFFSET_MAX}`),

  timezone: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(GENERIC_STR_MAX, `timezone: máximo ${GENERIC_STR_MAX} chars`)
    .matches(RE_TZ, 'timezone: formato inválido (ej. America/Bogota, GMT)'),

  timezone_abbreviation: yup
    .string()
    .notRequired()
    .transform(normalizeString)
    .nullable()
    .max(10, 'timezone_abbreviation: máximo 10 chars')
    .matches(RE_TZ_ABBR, 'timezone_abbreviation: solo A-Z'),

  elevation: yup
    .number()
    .notRequired()
    .transform(toNumber)
    .nullable()
    .max(ELEVATION_MAX, `elevation: máximo ${ELEVATION_MAX}`),

  current_weather_units: yup
    .object({
      time: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.time: caracteres inválidos'),
      interval: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.interval: caracteres inválidos'),
      temperature: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.temperature: caracteres inválidos'),
      windspeed: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.windspeed: caracteres inválidos'),
      winddirection: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.winddirection: caracteres inválidos'),
      is_day: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.is_day: caracteres inválidos'),
      weathercode: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(GENERIC_STR_MAX)
        .matches(RE_UNITS, 'units.weathercode: caracteres inválidos'),
    })
    .notRequired()
    .nullable(),

  current_weather: yup
    .object({
      time: yup
        .string()
        .notRequired()
        .transform(normalizeString)
        .nullable()
        .max(ISO_DATE_STR_MAX)
        .matches(RE_ISO_FLEX, 'time: formato ISO inválido (YYYY-MM-DDTHH:mm[:ss][.SSS][Z])'),
      interval: yup
        .number()
        .notRequired()
        .transform(toNumber)
        .nullable()
        .max(INTERVAL_SEC_MAX, `interval: máximo ${INTERVAL_SEC_MAX}`),
      temperature: yup
        .number()
        .notRequired()
        .transform(toNumber)
        .nullable()
        .max(TEMP_C_MAX, `temperature: máximo ${TEMP_C_MAX} °C`),
      windspeed: yup
        .number()
        .notRequired()
        .transform(toNumber)
        .nullable()
        .max(WIND_KMH_MAX, `windspeed: máximo ${WIND_KMH_MAX} km/h`),
      winddirection: yup
        .number()
        .notRequired()
        .transform(toNumber)
        .nullable()
        .max(WIND_DIR_MAX, `winddirection: máximo ${WIND_DIR_MAX}°`),
      is_day: yup
        .number()
        .notRequired()
        .transform(toNumber)
        .nullable()
        .max(IS_DAY_MAX, `is_day: máximo ${IS_DAY_MAX}`),
      weathercode: yup
        .number()
        .notRequired()
        .transform(toNumber)
        .nullable()
        .max(WEATHER_CODE_MAX, `weathercode: máximo ${WEATHER_CODE_MAX}`),
    })
    .notRequired()
    .nullable(),
});
