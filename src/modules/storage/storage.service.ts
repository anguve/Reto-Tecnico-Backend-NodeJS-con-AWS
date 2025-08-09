import { StorageRepository } from './storage.repository';

export class StorageService {
  constructor(private readonly repository: StorageRepository) {}
  /**
   * Stores the provided data by delegating to the repository.
   *
   * @param {object} data - The data object to be stored.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  async storeData(data: object): Promise<void> {
    await this.repository.saveCustomData(data);
  }
}
