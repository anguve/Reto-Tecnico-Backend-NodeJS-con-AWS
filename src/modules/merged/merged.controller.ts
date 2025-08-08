import { MergedService } from './merged.service';

export class MergedController {
  constructor(private readonly mergedService: MergedService) {}

  /**
   * Handles the process of retrieving merged data.
   *
   * Calls the `fetchMergedData` method from the service layer and returns
   * a structured HTTP response with status code and body.
   */
  async getMergedData() {
    try {
      const data = await this.mergedService.fetchMergedData();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Data fetched successfully',
          data,
        }),
      };
    } catch (error) {
      console.error('Error fetching merged data:', error);

      return {
        statusCode: 502,
        body: JSON.stringify({
          message: 'Failed to fetch data from controller',
          error:
            error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        }),
      };
    }
  }
}
