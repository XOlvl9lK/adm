import { Controller, Get } from '@nestjs/common';
import { execSync } from 'child_process';

@Controller('version')
export class AppController {

  @Get()
  async getVersion() {
    // const revision = execSync('git rev-parse HEAD').toString().trim()
    return { revision: 'f9625ce6fb8c3554e3eae6924d4442aaeb44ea2f' }
  }
}