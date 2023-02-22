import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { SpvHistoryElasticRepo } from '@modules/spv-history/infrastructure/spv-history.elastic-repo';
import { SpvHistoryEntity } from '@modules/spv-history/domain/spv-history.entity';
import { FindSpvHistoryService } from '@modules/spv-history/services/find-spv-history.service';
import { RequestStateEnumTranslated } from '@modules/spv-history/domain/request-state.enum';
import { ExportSpvHistory } from '@modules/spv-history/services/export-spv-history.service';

export const exportSpvHistoryWorker = async ({ exportJob, format, dto, token }: ExportWorkerArgs<ExportSpvHistory>) => {
  try {
    const spvHistoryElasticRepo = getElasticRepo(SpvHistoryElasticRepo);
    const findSpvHistoryService = new FindSpvHistoryService(spvHistoryElasticRepo);
    const getDataInLoop: GetDataInLoopFn<SpvHistoryEntity> = ({ pageSize, page }) => {
      return findSpvHistoryService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getRowData: GetXlsxRowFn<SpvHistoryEntity> = (data) => ({
      startDate: getClientDateAndTime(dto.timeZone, data.startDate),
      finishDate: getClientDateAndTime(dto.timeZone, data.finishDate),
      integrationName: data.integrationName,
      uniqueSecurityKey: data.uniqueSecurityKey,
      requestMethod: data.requestMethod?.name || '',
      requestState: RequestStateEnumTranslated[data.requestState],
      requestXmlUrl: data.requestXmlUrl,
      responseXmlUrl: data.responseXmlUrl,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал СПВ',
      getDataInLoop,
      firstDataRow: 11,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getRowData);

    await spvHistoryElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
