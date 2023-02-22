import {
  createWorkerConnection,
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { FileHistoryEntity } from '@modules/file-history/domain/file-history.entity';
import { FindAllFileHistoryService } from '@modules/file-history/services/find-all-file-history.service';
import { FileHistoryStatusEnum } from '@modules/file-history/domain/file-history-status.enum';
import { ExportFileHistory } from '@modules/file-history/services/export-file-history.service';

export const exportFileHistoryWorker = async ({ exportJob, format, dto, token }: ExportWorkerArgs<ExportFileHistory>) => {
  try {
    const connection = await createWorkerConnection();
    const fileHistoryRepo = connection.getRepository(FileHistoryEntity);
    const findFileHistoryService = new FindAllFileHistoryService(fileHistoryRepo);
    const getDataInLoop: GetDataInLoopFn<FileHistoryEntity> = ({ pageSize, page }) => {
      return findFileHistoryService.handle({
        ...dto,
        page,
        pageSize,
      });
    };

    const statusTranslations = {
      [FileHistoryStatusEnum.COMPLETED]: 'Выполнено',
      [FileHistoryStatusEnum.ERROR]: 'Ошибка',
      [FileHistoryStatusEnum.IN_PROCESS]: 'В процессе',
      [FileHistoryStatusEnum.COMPLETED_WITH_ERRORS]: 'Выполнено с ошибками',
    };

    const getRowData: GetXlsxRowFn<FileHistoryEntity> = (data) => ({
      startDate: getClientDateAndTime(dto.timeZone, data.startDate),
      departmentTitle: data.integration?.departmentName || 'Не указано',
      status: statusTranslations[data.status] || '',
      fileUrl: data.fileUrl,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал выгрузок в файл',
      getDataInLoop,
      firstDataRow: 10,
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
