import { StorageController } from '../modules/storage/storage.controller';
import { StorageRepository } from '../modules/storage/storage.repository';
import { StorageService } from '../modules/storage/storage.service';
import { MyLambdaEvent } from './interfaces/storage.interfaces';

const repository = new StorageRepository();
const service = new StorageService(repository);
const controller = new StorageController(service);

/**
 * AWS Lambda handler function for processing storage requests.
 *
 * Parses the incoming event body, validates it, and passes it to the StorageController
 * for further processing and data storage.
 *
 * @param {MyLambdaEvent} event - The Lambda event object, expected to contain the request body as a JSON string or object.
 * @returns {Promise<{ statusCode: number; body: string }>} The HTTP response with status code and JSON stringified body.
 */
export const handler = async (event: MyLambdaEvent) => {
  const eventBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  return await controller.store(eventBody);
};
