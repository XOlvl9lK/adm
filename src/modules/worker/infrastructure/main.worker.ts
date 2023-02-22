import { exportJournalUserEvents } from '@modules/journal-user-event/infrastructure/export-journal-user-events.worker';
// eslint-disable-next-line max-len
import { exportTypicalViolationWorker } from '@modules/journal-typical-violation/infrastructure/export-typical-violation.worker';
import { exportSpvHistoryWorker } from '@modules/spv-history/infrastructure/export-spv-history.worker';
import { exportSmevHistoryWorker } from '@modules/smev-history/infrastructure/export-smev-history.worker';
// eslint-disable-next-line max-len
import { exportJournalStatisticalCardWorker } from '@modules/journal-statistical-card/infrastructure/export-journal-statistical-card.worker';
import { exportNsiChangeWorker } from '@modules/journal-nsi-change/infrastructure/export-nsi-change.worker';
// eslint-disable-next-line max-len
import { exportJournalLoadingUnloadingWorker } from '@modules/journal-loading-unloading/infrastructure/export-journal-loading-unloading.worker';
import { exportJournalKuspWorker } from '@modules/journal-kusp/infrastructure/export-journal-kusp.worker';
import { exportJournalErrorsWorker } from '@modules/journal-errors/infrastructure/export-journal-errors.worker';
// eslint-disable-next-line max-len
import { exportJournalCancellationStatisticalCardWorker } from '@modules/journal-cancellation-statistical-card/infrastructure/export-journal-cancellation-statistical-card.worker';
// eslint-disable-next-line max-len
import { exportCancellationRecordCardWorker } from '@modules/journal-cancellation-record-card/infrastructure/export-cancellation-record-card.worker';
// eslint-disable-next-line max-len
import { exportCancellationKuspWorker } from '@modules/journal-cancellation-kusp/infrastructure/export-cancellation-kusp.worker';
import { exportFileHistoryWorker } from '@modules/file-history/infrastructure/export-file-history.worker';

const main = () => {
  return 1;
};

main.exportJournalUserEvents = exportJournalUserEvents;
main.exportTypicalViolationWorker = exportTypicalViolationWorker;
main.exportSpvHistoryWorker = exportSpvHistoryWorker;
main.exportSmevHistoryWorker = exportSmevHistoryWorker;
main.exportJournalStatisticalCardWorker = exportJournalStatisticalCardWorker;
main.exportNsiChangeWorker = exportNsiChangeWorker;
main.exportJournalLoadingUnloadingWorker = exportJournalLoadingUnloadingWorker;
main.exportJournalKuspWorker = exportJournalKuspWorker;
main.exportJournalErrorsWorker = exportJournalErrorsWorker;
main.exportJournalCancellationStatisticalCardWorker = exportJournalCancellationStatisticalCardWorker;
main.exportCancellationRecordCardWorker = exportCancellationRecordCardWorker;
main.exportCancellationKuspWorker = exportCancellationKuspWorker;
main.exportFileHistoryWorker = exportFileHistoryWorker;

module.exports = main;
