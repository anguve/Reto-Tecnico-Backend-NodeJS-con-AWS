import { storageSchema } from '../../validators/storage.validator';
import { StorageData } from './interfaces/storage.interfaces';
import { StorageService } from './storage.service';

export class StorageController {
  constructor(private readonly service: StorageService) {}
  /**
   * Validates and stores the provided data.
   *
   * @param {StorageData} eventBody - The data to be validated and stored.
   * @returns {Promise<{ statusCode: number; body: string }>} An HTTP response-like object with status code and JSON string body.
   */
  async store(eventBody: StorageData): Promise<{ statusCode: number; body: string }> {
    try {
      const validatedData = await storageSchema.validate(eventBody, { abortEarly: false });

      await this.service.storeData(validatedData);

      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'Data stored successfully.' }),
      };
    } catch (error) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: 'Failed to store data.',
          error:
            error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        }),
      };
    }
  }
}
