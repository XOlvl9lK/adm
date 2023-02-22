export interface SpvSmevFilter {
  unloadDpuAndKuspArrays: boolean;
  onlyDepartments: number[];
  onlyArraysOfDpuAndKusp: string[];
  unloadStatisticalReports: boolean;
  onlyStatisticalReports: string[];
  loadKuspPackages: boolean;
  loadStatisticalCards: boolean;
}

export const initialSpvSmevFilter: SpvSmevFilter = {
  unloadDpuAndKuspArrays: true,
  onlyDepartments: [],
  onlyArraysOfDpuAndKusp: [],
  unloadStatisticalReports: true,
  onlyStatisticalReports: ['1-ЕГС', '2-ЕГС', '3-ЕГС', '4-ЕГС', '1-КОРР', '1-Е', '1-ЕМ', '2-Е', '1-Э'],
  loadKuspPackages: true,
  loadStatisticalCards: true,
};
