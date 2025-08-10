import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { HistoryController } from '../../../../src/modules/history/history.controller';

const feature = loadFeature(path.join(__dirname, '../features/history.controller.feature'));

defineFeature(feature, (test) => {
  let controller: HistoryController;
  let mockHistoryService: any;
  let response: any;
  let event: any;

  test('Successfully fetch history', ({ given, when, then, and }) => {
    given('the history service returns valid data', () => {
      mockHistoryService = {
        fetchHistory: jest.fn().mockResolvedValue({
          items: [{ id: 1, name: 'Item 1' }],
          lastEvaluatedKey: { id: 2 },
        }),
      };
      controller = new HistoryController(mockHistoryService);

      event = {
        queryStringParameters: {
          limit: '5',
          order: 'asc',
          lastKey: JSON.stringify({ id: 1 }),
        },
      };
    });

    when('I call getHistory with query parameters', async () => {
      response = await controller.getHistory(event);
    });

    then('the response statusCode should be 200', () => {
      expect(response.statusCode).toBe(200);
    });

    and('the response body should contain a success message and data', () => {
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Historial obtenido correctamente');
      expect(body.data.items).toEqual([{ id: 1, name: 'Item 1' }]);
      expect(body.data.lastKey).toBe(JSON.stringify({ id: 2 }));
    });
  });

  test('Failed to fetch history', ({ given, when, then, and }) => {
    given('the history service throws an error', () => {
      mockHistoryService = {
        fetchHistory: jest.fn().mockRejectedValue(new Error('Service failure')),
      };
      controller = new HistoryController(mockHistoryService);

      event = {
        queryStringParameters: {
          limit: '5',
          order: 'asc',
          lastKey: JSON.stringify({ id: 1 }),
        },
      };
    });

    when('I call getHistory with query parameters', async () => {
      response = await controller.getHistory(event);
    });

    then('the response statusCode should be 502', () => {
      expect(response.statusCode).toBe(502);
    });

    and('the response body should contain an error message', () => {
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Error al obtener historial');
      expect(body.error.message).toBe('Service failure');
      expect(body.error.stack).toBeDefined();
    });
  });
});
