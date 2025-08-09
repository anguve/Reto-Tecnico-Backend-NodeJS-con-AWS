import * as yup from 'yup';
/**
 * Schema for validating a single character object with required and optional fields.
 *
 * @type {yup.ObjectSchema}
 * @property {string} name - Name of the character (required).
 * @property {string} height - Height of the character (required).
 * @property {string} mass - Mass of the character (required).
 * @property {string} hair_color - Hair color of the character (required).
 * @property {string} skin_color - Skin color of the character (required).
 * @property {string} eye_color - Eye color of the character (required).
 * @property {string} birth_year - Birth year of the character (required).
 * @property {string} gender - Gender of the character (required).
 * @property {string} homeworld - URL of the character's homeworld (required).
 * @property {string[]} [films] - Array of URLs to films featuring the character.
 * @property {string[]} [species] - Array of species the character belongs to.
 * @property {string[]} [vehicles] - Array of vehicles the character uses.
 * @property {string[]} [starships] - Array of starships the character uses.
 * @property {string} [created] - Creation date string.
 * @property {string} [edited] - Last edited date string.
 * @property {string} [url] - URL of the character resource.
 */
export const characterSchema = yup.object({
  name: yup.string().required(),
  height: yup.string().required(),
  mass: yup.string().required(),
  hair_color: yup.string().required(),
  skin_color: yup.string().required(),
  eye_color: yup.string().required(),
  birth_year: yup.string().required(),
  gender: yup.string().required(),
  homeworld: yup.string().url().required(),
  films: yup.array().of(yup.string().url()),
  species: yup.array().of(yup.string()),
  vehicles: yup.array().of(yup.string()),
  starships: yup.array().of(yup.string()),
  created: yup.string(),
  edited: yup.string(),
  url: yup.string().url(),
});

/**
 * Schema for validating an array of characters.
 *
 * @type {yup.ArraySchema<yup.ObjectSchema>}
 */
export const charactersListSchema = yup.array().of(characterSchema);

/**
 * Schema for validating weather data with geographic coordinates and current weather details.
 *
 * @type {yup.ObjectSchema}
 * @property {number} latitude - Latitude coordinate (required).
 * @property {number} longitude - Longitude coordinate (required).
 * @property {object} current_weather - Object containing current weather details.
 * @property {number} current_weather.temperature - Current temperature (required).
 * @property {number} current_weather.windspeed - Current wind speed (required).
 * @property {number} current_weather.winddirection - Current wind direction (required).
 * @property {number} current_weather.is_day - Indicator if it is daytime (required).
 * @property {number} current_weather.weathercode - Weather condition code (required).
 * @property {string} current_weather.time - Timestamp of the weather data (required).
 */
export const weatherDataSchema = yup.object({
  latitude: yup.number().required(),
  longitude: yup.number().required(),
  current_weather: yup.object({
    temperature: yup.number().required(),
    windspeed: yup.number().required(),
    winddirection: yup.number().required(),
    is_day: yup.number().required(),
    weathercode: yup.number().required(),
    time: yup.string().required(),
  }),
});
