import {
  ExportWorker,
  ExportWorkerArgs,
  GetDataInLoopFn,
  getElasticRepo,
  updateExportJobWithError
} from '@common/utils/export.worker';
// eslint-disable-next-line max-len
import { ExportTypicalViolationDto } from '@modules/journal-typical-violation/controllers/dtos/export-typical-violation.dto';
import { GetXlsxRowFn } from '@common/utils/manual-xlsx-library';
import { getClientDateAndTime } from '@common/utils/getClientDateAndTime';
import { GetOdsRowFn } from '@common/utils/manual-ods-library';
// eslint-disable-next-line max-len
import { TypicalViolationsElasticRepo } from '@modules/journal-typical-violation/infrastructure/typical-violations.elastic-repo';
// eslint-disable-next-line max-len
import { FindTypicalViolationService } from '@modules/journal-typical-violation/services/find-typical-violation.service';
import { TypicalViolationsEntity } from '@modules/journal-typical-violation/domain/typical-violations.entity';

export const exportTypicalViolationWorker = async ({
  exportJob,
  format,
  dto,
  token,
}: ExportWorkerArgs<ExportTypicalViolationDto>) => {
  try {
    const typicalViolationElasticRepo = getElasticRepo(TypicalViolationsElasticRepo);
    const findTypicalViolationService = new FindTypicalViolationService(typicalViolationElasticRepo);
    const getDataInLoop: GetDataInLoopFn<TypicalViolationsEntity> = ({ pageSize, page }) => {
      return findTypicalViolationService.findAll({
        ...dto,
        page,
        pageSize,
      });
    };

    const getDataRow: GetXlsxRowFn<TypicalViolationsEntity> = (data) => ({
      uniqueNumber: data.uniqueNumber,
      cardId: data.cardId,
      versionDate: getClientDateAndTime(dto.timeZone, data.versionDate),
      formNumber: data.formNumber,
      entityTypeTitle: data.entityTypeTitle,
      examinationTypeTitle: data.examinationTypeTitle,
      operationTypeTitle: data.operationTypeTitle,
      operationDate: getClientDateAndTime(dto.timeZone, data.operationDate),
      comment: data.comment,
      userName: `${data.userName}\n${data.userPositionTitle}`,
    });

    const exportWorker = new ExportWorker({
      total: dto.pageSize,
      dto,
      exportJob,
      exportName: 'Журнал изменений типовых нарушений',
      getDataInLoop,
      firstDataRow: 13,
      columnKeys: dto.columnKeys,
    });

    const fileName = await exportWorker.run(format, getDataRow);

    await typicalViolationElasticRepo.closeConnection();
    return fileName;
  } catch (e) {
    await updateExportJobWithError(exportJob.id, JSON.stringify(e.message) + ' ' + JSON.stringify(e.stack), token)
    console.log(e);
  }
};
