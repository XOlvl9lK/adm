import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { NsiChangeElasticRepo } from '@modules/journal-nsi-change/infrastructure/nsi-change.elastic-repo';
import { NsiChangeEntity } from '@modules/journal-nsi-change/domain/nsi-change.entity';
import { FindNsiChangeService } from '@modules/journal-nsi-change/services/find-nsi-change.service';
import { ExportNsiChangeDto } from '@modules/journal-nsi-change/controllers/dto/export-nsi-change.dto';

export const exportNsiChangeWorker = async ({ exportJob, format, dto, token }: ExportWorkerArgs<ExportNsiChangeDto>) => {
  try {
    const nsiChangeElasticRepo = getElasticRepo(NsiChangeElasticRepo);
    const findNsiChangeService = new FindNsiChangeService(nsiChangeElasticRepo);
    const getDataInLoop: GetDataInLoopFn<NsiChangeEntity> = ({ pageSize, page }) => {
      return findNsiChangeService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getDataRow: GetXlsxRowFn<NsiChangeEntity> = (data) => ({
      eventDate: getClientDateAndTime(dto.timeZone, data.eventDate),
      userName: data.userName,
      ipAddress: data.ipAddress,
      sessionId: data.sessionId,
      objectTitle: data.objectTitle,
      eventTitle: data.eventTitle,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал изменений НСИ',
      getDataInLoop,
      firstDataRow: 12,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getDataRow);

    await nsiChangeElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
