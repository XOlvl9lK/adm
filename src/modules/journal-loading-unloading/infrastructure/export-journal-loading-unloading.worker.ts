import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingElasticRepo } from '@modules/journal-loading-unloading/infrastructure/journal-loading-unloading.elastic-repo';
// eslint-disable-next-line max-len
import { JournalLoadingUnloadingEntity } from '@modules/journal-loading-unloading/domain/journal-loading-unloading.entity';
// eslint-disable-next-line max-len
import { FindJournalLoadingUnloadingService } from '@modules/journal-loading-unloading/services/find-journal-loading-unloading.service';
// eslint-disable-next-line max-len
import { ExportJournalLoadingUnloadingDto } from '@modules/journal-loading-unloading/controllers/dtos/export-journal-loading-unloading.dto';

export const exportJournalLoadingUnloadingWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportJournalLoadingUnloadingDto>) => {
  try {
    const journalLoadingUnloadingElasticRepo = getElasticRepo(JournalLoadingUnloadingElasticRepo);
    const findJournalLoadingUnloadingService = new FindJournalLoadingUnloadingService(
      journalLoadingUnloadingElasticRepo,
    );
    const getDataInLoop: GetDataInLoopFn<JournalLoadingUnloadingEntity> = ({ pageSize, page }) => {
      return findJournalLoadingUnloadingService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getDataRow: GetXlsxRowFn<JournalLoadingUnloadingEntity> = (data) => ({
      importDate: getClientDateAndTime(dto.timeZone, data.importDate),
      exportDate: getClientDateAndTime(dto.timeZone, data.exportDate),
      fileTitle: data.fileTitle,
      allCardsNumber: data.allCardsNumber,
      processingResultTitle: data.processingResultTitle,
      downloadedCardsNumber: data.downloadedCardsNumber,
      errorProcessedCardsNumber: data.errorProcessedCardsNumber,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал выгрузки и загрузки',
      getDataInLoop,
      firstDataRow: 10,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getDataRow);

    await journalLoadingUnloadingElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
