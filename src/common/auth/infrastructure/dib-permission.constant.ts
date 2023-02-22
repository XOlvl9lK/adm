export const dibPermission = {
  userActions: {
    read: 'objects.gasps.section.administration.user-actions',
  },
  nsiChanges: {
    read: 'objects.gasps.section.administration.nsi-changes',
  },
  statisticalCards: {
    read: 'objects.gasps.section.administration.processing-statistical-cards.statistical-cards',
    reProcessing: 'objects.gasps.section.administration.processing-statistical-cards.statistical-cards.re-processing',
    procuracyFilter:
      'objects.gasps.section.administration.processing-statistical-cards.statistical-cards.procuracy-filter',
  },
  statisticalCardsUpload: {
    read: 'objects.gasps.section.administration.processing-statistical-cards.uploads-and-downloads',
  },
  kuspProcessing: {
    read: 'objects.gasps.section.administration.kusp-processing',
    reProcessing: 'objects.gasps.section.administration.kusp-processing.re-processing',
  },
  cancellation: {
    statisticalCards: {
      read: 'objects.gasps.section.administration.cancellation.statistical-cards',
      procuracyFilter: 'objects.gasps.section.administration.cancellation.statistical-cards.procuracy-filter',
    },
    kusp: {
      read: 'objects.gasps.section.administration.cancellation.kusp',
      procuracyFilter: 'objects.gasps.section.administration.cancellation.kusp.procuracy-filter',
    },
    indexCards: {
      read: 'objects.gasps.section.administration.cancellation.index-cards',
    },
  },
  errorLogging: {
    read: 'objects.gasps.section.administration.error-logging',
  },
  typicalViolations: {
    read: 'objects.gasps.section.administration.typical-violations-changes',
    procuracyFilter: 'objects.gasps.section.administration.typical-violations-changes.procuracy-filter',
  },
  externalInteractions: {
    records: {
      read: 'objects.gasps.section.administration.settings.external-interactions',
      spv: 'objects.gasps.section.administration.external-interactions.spv',
      smev: 'objects.gasps.section.administration.external-interactions.smev',
      file: 'objects.gasps.section.administration.external-interactions.file',
      create: 'objects.gasps.section.administration.settings.external-interactions.create',
      update: 'objects.gasps.section.administration.settings.external-interactions.update',
      delete: 'objects.gasps.section.administration.settings.external-interactions.delete',
    },
    settings: {
      read: 'objects.gasps.section.administration.settings.component-common',
      update: 'objects.gasps.section.administration.settings.component-common.update',
    },
  },
  manualExport: {
    /** Перечень выгрузок */
    records: {
      read: 'objects.gasps.section.administration.manual-export.list',
      unload: 'objects.gasps.section.administration.manual-export.list.execute',
    },
    /** Настройки */
    settings: {
      read: 'objects.gasps.section.administration.manual-export.settings',
      create: 'objects.gasps.section.administration.manual-export.settings.create',
      update: 'objects.gasps.section.administration.manual-export.settings.update',
      delete: 'objects.gasps.section.administration.manual-export.settings.delete',
    },
  },
};
