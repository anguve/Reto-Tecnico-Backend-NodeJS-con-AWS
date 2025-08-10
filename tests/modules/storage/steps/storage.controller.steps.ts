import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { StorageController } from '../../../../src/modules/storage/storage.controller';
import { StorageData } from '../../../../src/modules/storage/interfaces/storage.interfaces';

const feature = loadFeature(path.join(__dirname, '../features/storage.controller.feature'));

defineFeature(feature, (test) => {
  let controller: StorageController;
  let mockService: any;
  let response: any;

  const validData: StorageData = {
    title: 'Test Title',
    description: 'Test Description',
    userId: 'user-123',
    timestamp: Date.now(),
  };

  const invalidData: StorageData = {
    title: '',
    description: '',
    userId: '',
    timestamp: -1,
  };
  test('Successfully validate and store data', ({ given, when, then, and }) => {
    given('the storage service stores data successfully', () => {
      mockService = {
        storeData: jest.fn().mockResolvedValue(undefined),
      };
      controller = new StorageController(mockService);
    });

    when('I call store with valid data', async () => {
      response = await controller.store(validData);
    });

    then('the response statusCode should be 201', () => {
      expect(response.statusCode).toBe(201);
    });

    and('the response body should contain a success message', () => {
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Data stored successfully.');
      expect(mockService.storeData).toHaveBeenCalledWith(validData);
    });
  });

  test('Validation or storage failure', ({ given, when, then, and }) => {
    given('the storage service throws an error', () => {
      mockService = {
        storeData: jest.fn().mockRejectedValue(new Error('Storage failure')),
      };
      controller = new StorageController(mockService);
    });

    when('I call store with invalid data', async () => {
      response = await controller.store(invalidData);
    });

    then('the response statusCode should be 502', () => {
      expect(response.statusCode).toBe(502);
    });

    and('the response body should contain an error message', () => {
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Failed to store data.');
      expect(body.error.message).toBeDefined();
      expect(body.error.stack).toBeDefined();
    });
  });
});
