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
import { CancellationKuspElasticRepo } from '@modules/journal-cancellation-kusp/infrastructure/cancellation-kusp.elastic-repo';
import { CancellationKuspEntity } from '@modules/journal-cancellation-kusp/domain/cancellation-kusp.entity';
// eslint-disable-next-line max-len
import { FindCancellationKuspService } from '@modules/journal-cancellation-kusp/services/find-cancellation-kusp.service';
// eslint-disable-next-line max-len
import { ExportCancellationKuspDto } from '@modules/journal-cancellation-kusp/controllers/dtos/export-cancellation-kusp.dto';

export const exportCancellationKuspWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportCancellationKuspDto>) => {
  try {
    const cancellationKuspElasticRepo = getElasticRepo(CancellationKuspElasticRepo);
    const findCancellationKuspService = new FindCancellationKuspService(cancellationKuspElasticRepo);
    const getDataInLoop: GetDataInLoopFn<CancellationKuspEntity> = ({ pageSize, page }) => {
      return findCancellationKuspService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getRowData: GetXlsxRowFn<CancellationKuspEntity> = (data) => ({
      kuspNumber: data.kuspNumber,
      divisionTitle: data.divisionTitle,
      solutionTitle: data.solutionTitle,
      registrationDate: getClientDateAndTime(dto.timeZone, data.registrationDate),
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
      exportName: 'Журнал аннулирования КУСП',
      getDataInLoop,
      firstDataRow: 12,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getRowData);

    await cancellationKuspElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
