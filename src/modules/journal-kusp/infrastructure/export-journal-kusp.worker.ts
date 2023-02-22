import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { JournalKuspElasticRepo } from '@modules/journal-kusp/infrastructure/journal-kusp.elastic-repo';
import { JournalKuspEntity } from '@modules/journal-kusp/domain/journal-kusp.entity';
import { FindJournalKuspService } from '@modules/journal-kusp/services/find-journal-kusp.service';
import { ExportJournalKuspDto } from '@modules/journal-kusp/controllers/dtos/export-journal-kusp.dto';

export const exportJournalKuspWorker = async ({ exportJob, format, dto, token }: ExportWorkerArgs<ExportJournalKuspDto>) => {
  try {
    const journalKuspElasticRepo = getElasticRepo(JournalKuspElasticRepo);
    const findJournalKuspService = new FindJournalKuspService(journalKuspElasticRepo);
    const getDataInLoop: GetDataInLoopFn<JournalKuspEntity> = ({ pageSize, page }) => {
      return findJournalKuspService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getXlsxRow: GetXlsxRowFn<JournalKuspEntity> = (data) => ({
      divisionTitle: data.divisionTitle,
      regionTitle: data.regionTitle,
      fileTitle: data.fileTitle,
      packageKuspId: data.packageKuspId,
      createDate: getClientDateAndTime(dto.timeZone, data.createDate),
      allPackageRecordsNumber: data.allPackageRecordsNumber,
      downloadedRecordsNumber: data.downloadedRecordsNumber,
      errorProcessedRecordsNumber: data.errorProcessedRecordsNumber,
      sourceTitle: data.sourceTitle,
      startProcessingDate: getClientDateAndTime(dto.timeZone, data.startProcessingDate),
      endProcessingDate: getClientDateAndTime(dto.timeZone, data.endProcessingDate),
      signer: data.signer
        ?.map((s) => `${`${s.role}:` || ''} ${s.fullName || ''} ${s.position || ''} ${s.divisionTitle || ''}`)
        .join('\n'),
      operatorLogin: data.operatorLogin,
      statusTitle: data.statusTitle,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал обработки КУСП',
      getDataInLoop,
      firstDataRow: 13,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getXlsxRow);

    await journalKuspElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
