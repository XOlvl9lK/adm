import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { SmevHistoryRepository } from '@modules/smev-history/infrastructure/smev-history.repository';
import { FindSmevHistoryService } from '@modules/smev-history/services/find-smev-history.service';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { SmevHistoryStateTranslated } from '@modules/smev-history/domain/smev-history-state.enum';
import { ExportSmevHistoryDto } from '@modules/smev-history/controllers/dtos/export-smev-history.dto';

export const exportSmevHistoryWorker = async ({ exportJob, format, dto, token }: ExportWorkerArgs<ExportSmevHistoryDto>) => {
  try {
    const connection = await createWorkerConnection();
    const smevHistoryRepo = connection.getCustomRepository(SmevHistoryRepository);
    const findSmevHistoryService = new FindSmevHistoryService(smevHistoryRepo);
    const getDataInLoop: GetDataInLoopFn<SmevHistoryEntity> = ({ pageSize, page }) => {
      return findSmevHistoryService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getRowData: GetXlsxRowFn<SmevHistoryEntity> = (data) => ({
      createDate: getClientDateAndTime(dto.timeZone, data.createDate),
      updateDate: getClientDateAndTime(dto.timeZone, data.updateDate),
      departmentName: data.integration?.departmentName,
      methodName: data.methodName,
      state: data.state ? SmevHistoryStateTranslated[data.state] : '',
      getTaskRequest: data.getTaskRequest,
      getTaskResponse: data.getTaskResponse,
      ackRequest: data.ackRequest,
      ackResponse: data.ackResponse,
      sendTaskRequestWithSignature: data.sendTaskRequestWithSignature,
      sendTaskResponse: data.sendTaskResponse,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал СМЭВ',
      getDataInLoop,
      firstDataRow: 12,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getRowData);

    await connection.close();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
