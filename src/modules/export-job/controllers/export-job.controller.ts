import { Controller, Get, Param, Res } from '@nestjs/common';
import { DownloadExportJobService } from '@modules/export-job/services/download-export-job.service';
import { Response } from 'express';

@Controller('export-job')
export class ExportJobController {
  constructor(private downloadExportJobService: DownloadExportJobService) {}

  @Get(':fileName')
  async downloadExportJob(@Param('fileName') fileName: string, @Res() response: Response) {
    const fileStream = await this.downloadExportJobService.download(fileName);
    response.setHeader('Content-Disposition', `attachment; filename=${encodeURI(fileName)}`);
    return fileStream.pipe(response);
  }
}
