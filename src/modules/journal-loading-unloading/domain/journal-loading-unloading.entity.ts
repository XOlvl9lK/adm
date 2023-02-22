import { ProcessingResultEnum } from '@modules/journal-loading-unloading/domain/processing-result.enum';

export class JournalLoadingUnloadingEntity {
  fileTitle: string;
  allCardsNumber: number;
  importDate: string;
  exportDate: string;
  processingResultTitle: ProcessingResultEnum;
  downloadedCardsNumber: number;
  errorProcessedCardsNumber: number;
}
