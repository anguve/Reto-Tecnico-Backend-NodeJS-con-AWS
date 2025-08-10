import * as yup from 'yup';

export const TITLE_MAX = 120;
export const DESCRIPTION_MAX = 5000;
export const USER_ID_MAX = 64;

export const TITLE_ALLOWED_RE = /^[\p{L}\p{N} .,_\-()¡!¿?:;#@]+$/u;

export const DESCRIPTION_NO_TAGS_RE = /^[^<>]*$/u;

export const USER_ID_RE = new RegExp(`^[a-zA-Z0-9_\\-:]{1,${USER_ID_MAX}}$`);

export const titleSchema = yup
  .string()
  .trim()
  .max(TITLE_MAX, `Title cannot exceed ${TITLE_MAX} characters`)
  .matches(TITLE_ALLOWED_RE, 'Invalid characters in title')
  .required('Title is required');

export const descriptionSchema = yup
  .string()
  .trim()
  .max(DESCRIPTION_MAX, `Description cannot exceed ${DESCRIPTION_MAX} characters`)
  .matches(DESCRIPTION_NO_TAGS_RE, 'Description cannot contain HTML tags')
  .required('Description is required');

export const userIdSchema = yup
  .string()
  .trim()
  .matches(USER_ID_RE, 'Invalid userId')
  .required('User ID is required');

export const timestampSchema = yup
  .number()
  .integer('Timestamp must be an integer')
  .positive('Timestamp must be positive')
  .required('Timestamp is required');

export const storageSchema = yup
  .object({
    title: titleSchema,
    description: descriptionSchema,
    userId: userIdSchema,
    timestamp: timestampSchema,
  })
  .noUnknown(true, 'Unknown fields are not allowed')
  .strict(true);

export const storagePatchSchema = yup
  .object({
    title: titleSchema.notRequired(),
    description: descriptionSchema.notRequired(),
    userId: userIdSchema.notRequired(),
    timestamp: timestampSchema.notRequired(),
  })
  .noUnknown(true, 'Unknown fields are not allowed')
  .strict(true);

export type StorageData = yup.InferType<typeof storageSchema>;
