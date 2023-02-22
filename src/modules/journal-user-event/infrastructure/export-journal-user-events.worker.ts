import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
// eslint-disable-next-line max-len
import { JournalUserEventsElasticRepo } from '@modules/journal-user-event/infrastructure/journal-user-events.elastic-repo';
import { ExportUserEventDto } from '@modules/journal-user-event/controllers/dtos/export-user-event.dto';
import { FindJournalUserEventsService } from '@modules/journal-user-event/services/find-journal-user-events.service';
import { JournalUserEventsEntity } from '@modules/journal-user-event/domain/journal-user-events.entity';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';

export const exportJournalUserEvents = async ({ exportJob, format, dto, token }: ExportWorkerArgs<ExportUserEventDto>) => {
  try {
    const journalUserEventsElasticRepo = getElasticRepo(JournalUserEventsElasticRepo);
    const findJournalUserEventsService = new FindJournalUserEventsService(journalUserEventsElasticRepo);
    const getDataInLoop: GetDataInLoopFn<JournalUserEventsEntity> = ({ pageSize, page }) => {
      return findJournalUserEventsService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getDataRow: GetXlsxRowFn<JournalUserEventsEntity> = (data) => ({
      regionTitle: data.regionTitle,
      departmentTitle: data.departmentTitle,
      divisionTitle: data.divisionTitle,
      userLogin: data.userLogin,
      url: data.url,
      browserVersion: data.browserVersion,
      eventDate: getClientDateAndTime(dto.timeZone, data.eventDate),
      ipAddress: data.ipAddress,
      resultTitle: data.resultTitle,
      queryParam: data.queryParam,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал действий пользователей',
      getDataInLoop,
      firstDataRow: 11,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getDataRow);

    await journalUserEventsElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
