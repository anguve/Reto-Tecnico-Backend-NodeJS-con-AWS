import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { storageSchema } from '../../../src/validators/storage.validator';

const feature = loadFeature(path.join(__dirname, '../features/storage.validator.feature'));

defineFeature(feature, (test) => {
  let data: any;
  let validationError: any;

  test('Valid data passes validation', async ({ given, when, then }) => {
    given('I have valid data', () => {
      data = {
        title: 'My Custom Data',
        description: 'Information to store',
        userId: 'user-123',
        timestamp: 1691563200000,
      };
    });

    when('I validate the data', async () => {
      validationError = null;
      try {
        await storageSchema.validate(data, { abortEarly: false });
      } catch (err) {
        validationError = err;
      }
    });

    then('the validation should succeed', () => {
      expect(validationError).toBeNull();
    });
  });

  test('Missing required fields fail validation', async ({ given, when, then }) => {
    given('I have data missing required fields', () => {
      data = {
        title: '',
        description: '',
        userId: '',
        timestamp: null,
      };
    });

    when('I validate the data', async () => {
      validationError = null;
      try {
        await storageSchema.validate(data, { abortEarly: false });
      } catch (err) {
        validationError = err;
      }
    });

    then('the validation should fail with the corresponding errors', () => {
      expect(validationError).not.toBeNull();
      expect(validationError.errors).toContain('Title is required');
      expect(validationError.errors).toContain('Description is required');
      expect(validationError.errors).toContain('User ID is required');
      expect(validationError.errors).toContain('Timestamp is required');
    });
  });

  test('Timestamp is invalid', async ({ given, when, then }) => {
    given('I have data with invalid timestamp', () => {
      data = {
        title: 'Valid Title',
        description: 'Valid Description',
        userId: 'user-123',
        timestamp: -1000,
      };
    });

    when('I validate the data', async () => {
      validationError = null;
      try {
        await storageSchema.validate(data, { abortEarly: false });
      } catch (err) {
        validationError = err;
      }
    });

    then('the validation should fail with timestamp errors', () => {
      expect(validationError).not.toBeNull();
      expect(validationError.errors).toContain('Timestamp must be positive');
    });
  });
});
