import { MergedService } from './merged.service';

export class MergedController {
  constructor(private readonly mergedService: MergedService) {}

  /**
   * Handles the process of retrieving merged data.
   *
   * Calls the `fetchMergedData` method from the service layer and returns
   * a structured HTTP response with status code and JSON stringified body.
   *
   * @returns {Promise<{statusCode: number, body: string}>} The HTTP response object with status and body.
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
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: 'Failed to fetch data from controller',
          error,
        }),
      };
    }
  }
}
