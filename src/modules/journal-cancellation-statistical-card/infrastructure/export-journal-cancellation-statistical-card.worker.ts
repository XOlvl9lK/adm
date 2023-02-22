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
import { JournalCancellationStatisticalCardElasticRepo } from '@modules/journal-cancellation-statistical-card/infrastructure/journal-cancellation-statistical-card.elastic-repo';
// eslint-disable-next-line max-len
import { JournalCancellationStatisticalCardEntity } from '@modules/journal-cancellation-statistical-card/domain/journal-cancellation-statistical-card.entity';
// eslint-disable-next-line max-len
import { FindJournalCancellationStatisticalCardService } from '@modules/journal-cancellation-statistical-card/services/find-journal-cancellation-statistical-card.service';
// eslint-disable-next-line max-len
import { ExportJournalCancellationStatisticalCardDto } from '@modules/journal-cancellation-statistical-card/controllers/dtos/export-journal-cancellation-statistical-card.dto';

export const exportJournalCancellationStatisticalCardWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportJournalCancellationStatisticalCardDto>) => {
  try {
    const journalCancellationStatisticalCardElasticRepo = getElasticRepo(JournalCancellationStatisticalCardElasticRepo);
    const findJournalCancellationStatisticalCardService = new FindJournalCancellationStatisticalCardService(
      journalCancellationStatisticalCardElasticRepo,
    );
    const getDataInLoop: GetDataInLoopFn<JournalCancellationStatisticalCardEntity> = ({ pageSize, page }) => {
      return findJournalCancellationStatisticalCardService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getXlsxRow: GetXlsxRowFn<JournalCancellationStatisticalCardEntity> = (data) => ({
      ikud: data.ikud,
      uniqueNumber: data.uniqueNumber,
      formNumber: data.formNumber,
      cardId: data.cardId,
      sourceTitle: data.sourceTitle,
      versionDate: getClientDateAndTime(dto.timeZone, data.versionDate),
      operationDate: getClientDateAndTime(dto.timeZone, data.operationDate),
      operationTypeTitle: data.operationTypeTitle,
      userLogin: data.userLogin,
      comment: data.comment,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал аннулирования статистических карточек',
      getDataInLoop,
      firstDataRow: 12,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getXlsxRow);

    await journalCancellationStatisticalCardElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
