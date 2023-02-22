export interface FileFilter {
  unloadDpuAndKuspArrays: boolean;
  onlyDepartments: number[];
  onlyArraysOfDpuAndKusp: string[];
  unloadStatisticalReports: boolean;
  onlyStatisticalReports: string[];
  unloadChangesFromLastUnload: boolean;
}

export const initialFileFilter: FileFilter = {
  unloadDpuAndKuspArrays: true,
  onlyDepartments: [],
  onlyArraysOfDpuAndKusp: [],
  unloadStatisticalReports: true,
  onlyStatisticalReports: ['1-ЕГС', '2-ЕГС', '3-ЕГС', '4-ЕГС', '1-КОРР', '1-Е', '1-ЕМ', '2-Е', '1-Э'],
  unloadChangesFromLastUnload: true,
};
