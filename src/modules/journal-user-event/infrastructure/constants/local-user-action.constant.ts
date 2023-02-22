export const defaultTableUserActions = {
  setupColumns: 'SaveField',
  exportXlsx: 'ExportXlsx',
  exportXls: 'ExportXls',
  exportOds: 'ExportOds',
};

export const localUserAction = {
  userActions: {
    getData: 'JournalUserEvent',
    ...defaultTableUserActions,
  },
  nsiChanges: {
    getData: 'JournalNsiChange',
    ...defaultTableUserActions,
  },
  statisticalCards: {
    getData: 'JournalStatisticalCard',
    ...defaultTableUserActions,
    reprocessing: 'Reprocessing',
    viewByKey: 'ViewByKey',
    readStatus: 'StatusStatisticalCardRead',
    readError: 'ErrorStatisticalCardRead',
    readSignatory: 'SignatoryRead',
  },
  uploadAndDownloads: {
    getData: 'JournalLoadingUnloading',
    ...defaultTableUserActions,
  },
  kusp: {
    getData: 'JournalKusp',
    ...defaultTableUserActions,
    reprocessing: 'Reprocessing',
    viewByKey: 'ViewByKey',
    getKuspFile: 'GetKuspFile',
    readError: 'ErrorKuspRead',
    readSignatory: 'SignatoryRead',
  },
  cancellation: {
    statisticalCards: {
      getData: 'JournalCancellationStatisticalCard',
      ...defaultTableUserActions,
      viewByKey: 'ViewByKey',
    },
    kusp: {
      getData: 'JournalCancellationKusp',
      ...defaultTableUserActions,
      viewByKey: 'ViewByKey',
    },
    indexCards: {
      getData: 'JournalCancellationRecordCard',
      ...defaultTableUserActions,
      viewByKey: 'ViewByKey',
    },
  },
  errorLogging: {
    getData: 'JournalErrors',
    ...defaultTableUserActions,
    exportXml: 'ExportXml',
    readErrorDescription: 'ErrorDescriptionRead',
  },
  typicalViolations: {
    getData: 'JournalTypicalViolation',
    ...defaultTableUserActions,
  },
  manualExport: {
    getData: 'ManualExportIntegration',
    records: {
      executeUpload: 'ExecuteUpload',
      executeAllUploads: 'ExecuteAllUploads',
    },
    settings: {
      create: 'SettingsCreate',
      update: 'SettingsUpdate',
      delete: 'SettingsDelete',
    },
  },
  externalInteraction: {
    records: {
      getData: 'ExternalIntegration',
      create: 'IntegrationCreate',
      update: 'IntegrationUpdate',
      delete: 'IntegrationDelete',
    },
    settings: {
      getData: 'IntegrationCommonSetting',
      update: 'SettingsUpdate',
    },
  },
  history: {
    spv: {
      getData: 'SpvHistory',
      ...defaultTableUserActions,
      getXmlRequest: 'GetXmlRequest',
      getXmlResponse: 'GetXmlResponse',
    },
    smev: {
      getData: 'SmevHistory',
      ...defaultTableUserActions,
      getXmlGetTaskRequest: 'GetXmlGetTaskRequest',
      getXmlGetTaskResponse: 'GetXmlGetTaskResponse',
      getXmlAckRequest: 'GetXmlAckRequest',
      getXmlAckResponse: 'GetXmlAckResponse',
      getXmlSendTaskRequest: 'GetXmlSendTaskRequest',
      getXmlSendTaskResponse: 'GetXmlSendTaskResponse',
    },
    file: {
      getData: 'FileHistory',
      ...defaultTableUserActions,
    },
  },
};
