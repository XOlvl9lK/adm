import { Client } from '@elastic/elasticsearch';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { join } from 'path';
import { readdir, readFile } from 'fs/promises';
import { LoggerService } from '@common/logger/logger.service';

@Injectable()
export class ElasticMigrationService implements OnModuleInit {
  // protected readonly client: Client;
  // protected readonly mappingFolder = join(process.cwd(), 'index-init', 'mappings');
  // protected readonly logger: LoggerService = new LoggerService('ElasticMigrationService');

  constructor(elasticService: ElasticService) {
    // this.client = elasticService.client;
  }

  async onModuleInit() {
    // const configurations = await this.getIndicesConfiguration();
    //
    // for (const { index, file } of configurations) {
    //   const configuration = JSON.parse(await readFile(file, { encoding: 'latin1' }));
    //   const isIndexExists = await this.client.indices.exists({ index });
    //   if (!isIndexExists) {
    //     await this.client.indices.create({ index, ...configuration });
    //   } else {
    //     const status = await this.client.indices.close({ index });
    //     if (!status.acknowledged) continue;
    //     try {
    //       if (configuration.settings) {
    //         await this.client.indices.putSettings({
    //           index,
    //           settings: configuration.settings,
    //         });
    //       }
    //       if (configuration.mappings) {
    //         await this.client.indices.putMapping({
    //           index,
    //           ...configuration.mappings,
    //         });
    //       }
    //     } catch (err) {
    //       this.logger.error(err);
    //     } finally {
    //       await this.client.indices.open({ index });
    //     }
    //   }
    // }
  }

  // private async getIndicesConfiguration(): Promise<Array<{ index: string; file: string }>> {
    // const files = await readdir(this.mappingFolder, { withFileTypes: true });
    // return files
    //   .filter((file) => file.isFile())
    //   .filter((file) => file.name.endsWith('.json'))
    //   .map((file) => ({
    //     index: file.name.replace('.json', ''),
    //     file: join(this.mappingFolder, file.name),
    //   }));
  // }
}
