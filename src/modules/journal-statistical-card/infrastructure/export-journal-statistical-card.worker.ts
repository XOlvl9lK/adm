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
import { JournalStatisticalCardElasticRepo } from '@modules/journal-statistical-card/infrastructure/journal-statistical-card.elastic-repo';
import { JournalStatisticalCardEntity } from '@modules/journal-statistical-card/domain/journal-statistical-card.entity';
// eslint-disable-next-line max-len
import { FindJournalStatisticalCardService } from '@modules/journal-statistical-card/services/find-journal-statistical-card.service';
// eslint-disable-next-line max-len
import { ExportJournalStatisticalCardDto } from '@modules/journal-statistical-card/controllers/dtos/export-journal-statistical-card.dto';

export const exportJournalStatisticalCardWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportJournalStatisticalCardDto>) => {
  try {
    const journalStatisticalCardElasticRepo = getElasticRepo(JournalStatisticalCardElasticRepo);
    const findJournalStatisticalCardService = new FindJournalStatisticalCardService(journalStatisticalCardElasticRepo);
    const getDataInLoop: GetDataInLoopFn<JournalStatisticalCardEntity> = ({ pageSize, page }) => {
      return findJournalStatisticalCardService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getDataRow: GetXlsxRowFn<JournalStatisticalCardEntity> = (data) => ({
      ikud: data.ikud,
      divisionTitle: data.divisionTitle,
      regionTitle: data.regionTitle,
      procuracyTitle: data.procuracyTitle,
      formNumber: data.formNumber,
      cardId: data.cardId,
      sourceTitle: data.sourceTitle,
      startProcessingDate: getClientDateAndTime(dto.timeZone, data.startProcessingDate),
      endProcessingDate: getClientDateAndTime(dto.timeZone, data.startProcessingDate),
      operatorLogin: data.operatorLogin,
      signer: data.signer
        ?.slice(0, 3)
        .map((s) => `${`${s.role}:` || ''} ${s.fullName || ''} ${s.position || ''} ${s.divisionTitle || ''}`)
        .join('\n'),
      status: data.status?.map((s) => s.title).pop() || '',
      isProsecutorChange: data?.isProsecutorChange ? 'Внесены' : 'Не внесены',
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал обработки статистических карточек',
      getDataInLoop,
      firstDataRow: 14,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getDataRow);

    await journalStatisticalCardElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
