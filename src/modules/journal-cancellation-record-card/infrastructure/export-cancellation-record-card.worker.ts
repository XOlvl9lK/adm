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
import { CancellationRecordCardElasticRepo } from '@modules/journal-cancellation-record-card/infrastructure/cancellation-record-card.elastic-repo';
// eslint-disable-next-line max-len
import { CancellationRecordCardEntity } from '@modules/journal-cancellation-record-card/domain/cancellation-record-card.entity';
// eslint-disable-next-line max-len
import { FindCancellationRecordCardService } from '@modules/journal-cancellation-record-card/services/find-cancellation-record-card.service';
// eslint-disable-next-line max-len
import { ExportCancellationRecordCardDto } from '@modules/journal-cancellation-record-card/controllers/dto/export-cancellation-record-card.dto';

export const exportCancellationRecordCardWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportCancellationRecordCardDto>) => {
  try {
    const journalUserEventsElasticRepo = getElasticRepo(CancellationRecordCardElasticRepo);
    const findCancellationRecordCardService = new FindCancellationRecordCardService(journalUserEventsElasticRepo);
    const getDataInLoop: GetDataInLoopFn<CancellationRecordCardEntity> = ({ pageSize, page }) => {
      return findCancellationRecordCardService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getRowData: GetXlsxRowFn<CancellationRecordCardEntity> = (data) => ({
      uniqueNumber: data.uniqueNumber,
      cardId: data.cardId,
      operationDate: getClientDateAndTime(dto.timeZone, data.operationDate),
      divisionTitle: data.divisionTitle,
      formNumber: data.formNumber,
      operationTypeTitle: data.operationTypeTitle,
      comment: data.comment,
      userLogin: data.userLogin,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал аннулирования учётных карточек',
      getDataInLoop,
      firstDataRow: 11,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getRowData);

    await journalUserEventsElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
