import { Injectable } from '@nestjs/common';
import { NsiDictionaryRequestService } from './nsi-dictionary-request.service';
import { TreeBuilder } from '../infrastructure/tree-builder';
import { FindAuthorityDto } from '@modules/nsi-dictionary/controllers/dtos/find-authority.dto';

@Injectable()
export class GetNsiProsecutorOfficeService {
  constructor(private requests: NsiDictionaryRequestService) {}

  async findAll(dto: FindAuthorityDto) {
    const offices = await this.requests.getProsecutorOffices();
    const treeBuilder = new TreeBuilder();
    offices.forEach((record) =>
      treeBuilder.addNode(
        record.id,
        `[${record.version.data.UNIQ}] ${record.version.data.NAME}`,
        record.version.data.PARENT_ID?.pointer?.id,
      ),
    );
    return treeBuilder.getTree(dto).data;
  }
}
