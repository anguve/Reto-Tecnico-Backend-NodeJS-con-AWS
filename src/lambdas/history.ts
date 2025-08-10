import { HistoryController } from '../modules/history/history.controller';
import { HistoryRepository } from '../modules/history/history.repository';
import { HistoryService } from '../modules/history/history.service';

const repository = new HistoryRepository();
const service = new HistoryService(repository);
const controller = new HistoryController(service);

export const handler = async (event: any) => {
  return await controller.getHistory(event);
};
