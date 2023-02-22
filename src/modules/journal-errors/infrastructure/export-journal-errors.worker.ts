import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { JournalErrorsElasticRepo } from '@modules/journal-errors/infrastructure/journal-errors.elastic-repo';
import { JournalErrorsEntity } from '@modules/journal-errors/domain/journal-errors.entity';
import { FindJournalErrorsService } from '@modules/journal-errors/services/find-journal-errors.service';
import { ExportJournalErrorsDto } from '@modules/journal-errors/controllers/dtos/export-journal-errors.dto';

export const exportJournalErrorsWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportJournalErrorsDto>) => {
  try {
    const journalErrorsElasticRepo = getElasticRepo(JournalErrorsElasticRepo);
    const findJournalErrorsService = new FindJournalErrorsService(journalErrorsElasticRepo);
    const getDataInLoop: GetDataInLoopFn<JournalErrorsEntity> = ({ pageSize, page }) => {
      return findJournalErrorsService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getXlsxRow: GetXlsxRowFn<JournalErrorsEntity> = (data) => ({
      regionTitle: data.regionTitle,
      departmentTitle: data.departmentTitle,
      divisionTitle: data.divisionTitle,
      siteSectionTitle: data.siteSectionTitle,
      userLogin: data.userLogin,
      eventDate: getClientDateAndTime(dto.timeZone, data.eventDate),
      ipAddress: data.ipAddress,
      errorTypeTitle: data.errorTypeTitle,
      errorDescription: data.errorDescription,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал регистрации ошибок',
      getDataInLoop,
      firstDataRow: 11,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getXlsxRow);

    await journalErrorsElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
