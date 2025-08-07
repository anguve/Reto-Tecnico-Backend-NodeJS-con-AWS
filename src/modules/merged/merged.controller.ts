import { MergedService } from './merged.service';

export class MergedController {
  constructor(private readonly mergedService: MergedService) {
    // Empty constructor for potential future dependency injection or extensions.
  }
  /**
   * Handles the process of retrieving merged data.
   *
   * Calls the `fetchMergedData` method from the service layer and returns
   * a structured HTTP response with status code and body.
   * In case of an error, it logs the error and returns a 502 response.
   *
   * @async
   * @method getMergedData
   * @returns {Promise<{statusCode: number, body: string}>} An object containing the HTTP status code and a JSON stringified body.
   *
   */
  async getMergedData() {
    try {
      const data = await this.mergedService.fetchMergedData();

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Data fetched successfully',
          ...data,
        }),
      };
    } catch (error) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: 'Failed to fetch data from controller',
        }),
      };
    }
  }
}
