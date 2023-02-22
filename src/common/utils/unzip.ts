import * as extract from 'extract-zip';

export const unzip = async (inputPath: string, outputPath: string) => {
  return await extract(inputPath, { dir: outputPath });
};
