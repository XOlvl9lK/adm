import { Injectable } from '@nestjs/common';
import { TreeBuilder } from '../infrastructure/tree-builder';
import { NsiDictionaryRequestService } from './nsi-dictionary-request.service';
import { FindAuthorityDto } from '@modules/nsi-dictionary/controllers/dtos/find-authority.dto';

@Injectable()
export class GetNsiResponseMeasureService {
  constructor(private requests: NsiDictionaryRequestService) {}

  async findAll(dto: FindAuthorityDto) {
    const treeBuilder = new TreeBuilder();
    const measures = await this.requests.getResponseMeasures();
    measures.forEach((measure) =>
      treeBuilder.addNode(measure.id, `[${measure.version.data.CODE}] ${measure.version.data.NAME}`, undefined),
    );
    return treeBuilder.getTree(dto).data;
  }
}
