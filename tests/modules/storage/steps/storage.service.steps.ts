import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { StorageService } from '../../../../src/modules/storage/storage.service';

const feature = loadFeature(path.join(__dirname, '../features/storage.service.feature'));

defineFeature(feature, (test) => {
  let service: StorageService;
  let mockRepository: any;
  let error: any;

  const validData = {
    title: 'Test Title',
    description: 'Test Description',
    userId: 'user-123',
    timestamp: Date.now(),
  };

  test('Successfully store data through repository', ({ given, when, then }) => {
    given('the repository saves data successfully', () => {
      mockRepository = {
        saveCustomData: jest.fn().mockResolvedValue(undefined),
      };
      service = new StorageService(mockRepository);
    });

    when('I call storeData with valid data', async () => {
      error = undefined;
      try {
        await service.storeData(validData);
      } catch (e) {
        error = e;
      }
    });

    then('the service should complete without error', () => {
      expect(error).toBeUndefined();
      expect(mockRepository.saveCustomData).toHaveBeenCalledWith(validData);
    });
  });

  test('Repository throws an error during store', ({ given, when, then }) => {
    given('the repository throws an error', () => {
      mockRepository = {
        saveCustomData: jest.fn().mockRejectedValue(new Error('DB failure')),
      };
      service = new StorageService(mockRepository);
    });

    when('I call storeData with any data', async () => {
      error = undefined;
      try {
        await service.storeData(validData);
      } catch (e) {
        error = e;
      }
    });

    then('the service should propagate the error', () => {
      expect(error).toBeDefined();
      expect(error.message).toBe('DB failure');
    });
  });
});
