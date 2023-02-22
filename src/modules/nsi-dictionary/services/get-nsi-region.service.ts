import { Injectable } from '@nestjs/common';
import { NsiDictionaryRequestService } from './nsi-dictionary-request.service';
import { TreeBuilder } from '../infrastructure/tree-builder';
import { FindAuthorityDto } from '@modules/nsi-dictionary/controllers/dtos/find-authority.dto';
import { NsiRegion } from '../domain/nsi-region.interface';
import { User } from '@common/auth/infrastructure/user.interface';

@Injectable()
export class GetNsiRegionService {
  constructor(private requests: NsiDictionaryRequestService) {}

  async getRegionTreeData() {
    const treeBuilder = new TreeBuilder();
    const regions = await this.requests.getRegions();
    regions.forEach((region) =>
      treeBuilder.addNode(region.id, region.version.data.NAME, region.version.data.PARENT_ID?.pointer?.id),
    );
    return treeBuilder;
  }

  async getAll(dto: FindAuthorityDto) {
    return (await this.getRegionTreeData()).getTree(dto).data;
  }

  async getAllByUser(dto: FindAuthorityDto, user: User) {
    const requiredSubdivisionNames = user.subdivisions.map(({ name }) => name);
    const subdivisions = await this.requests.getSubdivisions();
    const userSubdivisions = subdivisions.filter((subdivision) =>
      requiredSubdivisionNames.includes(subdivision.version.data.NAME),
    );
    const regionIds = userSubdivisions.map((subdivision) => subdivision.version.data.OKATO_ID.pointer.id);
    const regionTree = await this.getRegionTreeData();
    regionTree.enableNodesById(regionIds);
    return regionTree.getTree(dto).data;
  }

  async getRegionByName(name: string): Promise<NsiRegion | undefined> {
    if (!name) return undefined;
    const filteredName = name.toLocaleLowerCase();
    const regions = await this.requests.getRegions();
    return regions.find((region) => region.version.data.NAME.toLocaleLowerCase() === filteredName);
  }
}
