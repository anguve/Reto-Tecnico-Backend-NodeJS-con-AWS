import { HistoryRepository } from './history.repository';

export class HistoryService {
  constructor(private readonly repository: HistoryRepository) {}

  async fetchHistory(limit: number, lastKey?: any, ascending: boolean = true) {
    return await this.repository.getHistory(limit, lastKey, ascending);
  }
}
