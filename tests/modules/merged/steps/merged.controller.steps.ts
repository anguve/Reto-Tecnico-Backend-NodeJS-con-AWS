import { defineFeature, loadFeature } from 'jest-cucumber';
import path from 'path';
import { MergedController } from '../../../../src/modules/merged/merged.controller';

const feature = loadFeature(path.join(__dirname, '../features/merged.controller.feature'));

defineFeature(feature, (test) => {
  let controller: MergedController;
  let mockMergedService: any;
  let response: any;

  test('Successfully fetch merged data', ({ given, when, then, and }) => {
    given('the merged service returns valid data', () => {
      mockMergedService = {
        fetchMergedData: jest.fn().mockResolvedValue({ some: 'data' }),
      };
      controller = new MergedController(mockMergedService);
    });

    when('I call getMergedData', async () => {
      response = await controller.getMergedData();
    });

    then('the response statusCode should be 200', () => {
      expect(response.statusCode).toBe(200);
    });

    and('the response body should contain a success message and data', () => {
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Data fetched successfully');
      expect(body.data).toEqual({ some: 'data' });
    });
  });

  test('Failed to fetch merged data', ({ given, when, then, and }) => {
    given('the merged service throws an error', () => {
      mockMergedService = {
        fetchMergedData: jest.fn().mockRejectedValue(new Error('Service failure')),
      };
      controller = new MergedController(mockMergedService);
    });

    when('I call getMergedData', async () => {
      response = await controller.getMergedData();
    });

    then('the response statusCode should be 502', () => {
      expect(response.statusCode).toBe(502);
    });

    and('the response body should contain an error message', () => {
      const body = JSON.parse(response.body);
      expect(body.message).toBe('Failed to fetch data from controller');
      expect(body.error.message).toBe('Service failure');
      expect(body.error.stack).toBeDefined();
    });
  });
});
