import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { HistoryService } from '../../../../src/modules/history/history.service';

const feature = loadFeature(path.join(__dirname, '../features/history.service.feature'));

defineFeature(feature, (test) => {
  let service: HistoryService;
  let mockRepository: any;
  let result: any;
  let error: any;

  test('Successfully fetch history data from repository', ({ given, when, then }) => {
    given('the repository returns valid data', () => {
      mockRepository = {
        getHistory: jest.fn().mockResolvedValue({
          items: [{ id: 1 }],
          lastEvaluatedKey: { id: 2 },
        }),
      };
      service = new HistoryService(mockRepository);
    });

    when(/^I call fetchHistory with limit (\d+), lastKey and ascending order$/, async (limit) => {
      result = await service.fetchHistory(parseInt(limit, 10), { id: 1 }, true);
    });

    then('the service should return the data from repository', () => {
      expect(result).toEqual({
        items: [{ id: 1 }],
        lastEvaluatedKey: { id: 2 },
      });
      expect(mockRepository.getHistory).toHaveBeenCalledWith(5, { id: 1 }, true);
    });
  });

  test('Repository throws an error', ({ given, when, then }) => {
    given('the repository throws an error', () => {
      mockRepository = {
        getHistory: jest.fn().mockRejectedValue(new Error('DB failure')),
      };
      service = new HistoryService(mockRepository);
    });

    when('I call fetchHistory', async () => {
      try {
        result = await service.fetchHistory(5);
      } catch (err) {
        error = err;
      }
    });

    then('the service should propagate the error', () => {
      expect(error).toBeDefined();
      expect(error.message).toBe('DB failure');
    });
  });
});
