export const getExportJobLink = (fileName: string) => {
  return `/administration/api/export-job/${encodeURI(fileName)}`;
};
