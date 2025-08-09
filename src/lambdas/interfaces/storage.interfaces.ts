import { StorageData } from '../../modules/storage/interfaces/storage.interfaces';

export interface MyLambdaEvent {
  body: string | StorageData | null;
}
