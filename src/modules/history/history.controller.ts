import { HistoryService } from './history.service';

export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  async getHistory(event: any) {
    try {
      const queryParams = event.queryStringParameters || {};
      const limit = queryParams.limit ? parseInt(queryParams.limit, 10) : 10;
      const ascending = queryParams.order === 'asc';
      const lastKey = queryParams.lastKey ? JSON.parse(queryParams.lastKey) : undefined;

      const { items, lastEvaluatedKey } = await this.historyService.fetchHistory(
        limit,
        lastKey,
        ascending,
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Historial obtenido correctamente',
          data: {
            items,
            lastKey: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null,
          },
        }),
      };
    } catch (error) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          message: 'Error al obtener historial',
          error:
            error instanceof Error ? { message: error.message, stack: error.stack } : String(error),
        }),
      };
    }
  }
}
