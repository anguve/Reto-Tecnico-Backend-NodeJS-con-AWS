import * as yup from 'yup';

export const storageSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  userId: yup.string().required('User ID is required'),
  timestamp: yup
    .number()
    .required('Timestamp is required')
    .typeError('Timestamp must be a number')
    .positive('Timestamp must be positive'),
});
