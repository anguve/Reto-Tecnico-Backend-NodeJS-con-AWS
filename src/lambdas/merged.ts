import { MergedController } from '../modules/merged/merged.controller';
import { MergedRepository } from '../modules/merged/merged.repository';
import { MergedService } from '../modules/merged/merged.service';

const repository = new MergedRepository();
const service = new MergedService(repository);
const controller = new MergedController(service);

/**
 * AWS Lambda handler that retrieves merged data using the `MergedController`.
 *
 * This function serves as the entry point for the Lambda. It initializes
 * the controller and delegates the logic to its `getMergedData` method.
 *
 * @async
 * @function handler
 * @param {unknown} event - The incoming event payload. Currently unused.
 * @returns {Promise<unknown>} The result of the `getMergedData` method.
 */
export const handler = async (_event: unknown) => {
  return await controller.getMergedData();
};
