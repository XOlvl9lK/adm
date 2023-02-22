import { Injectable } from '@nestjs/common';
import { TreeBuilder } from '../infrastructure/tree-builder';
import { NsiDictionaryRequestService } from './nsi-dictionary-request.service';
import { GetNsiRegionService } from './get-nsi-region.service';
import { GetNsiDepartmentService } from './get-nsi-department.service';
import { FindAllNsiSubdivisionDto } from '@modules/nsi-dictionary/controllers/dtos/find-all-nsi-subdivision.dto';
import { User } from '@common/auth/infrastructure/user.interface';

export interface GetNsiSubdivision {
  departmentTitle: string;
  regionTitle?: string;
  showHidden?: boolean;
}

@Injectable()
export class GetNsiSubdivisionService {
  constructor(
    private requests: NsiDictionaryRequestService,
    private getNsiRegionService: GetNsiRegionService,
    private getNsiDepartmentService: GetNsiDepartmentService,
  ) {}

  // prettier-ignore
  async getAll(dto: FindAllNsiSubdivisionDto) {
    const { departmentTitle, regionTitle, showHidden } = dto;
    const departmentId = (await this.getNsiDepartmentService.getDepartmentByName(departmentTitle))?.id;
    const regionId = (await this.getNsiRegionService.getRegionByName(regionTitle))?.id
    const treeBuilder = new TreeBuilder();
    let subdivisions = await this.requests.getSubdivisions(false, { departmentId, regionId });
    if (!showHidden) {
      subdivisions = subdivisions.filter(
        (subdivision) => new Date(subdivision.version.period.upper) > new Date(),
      );
    }
    subdivisions.forEach(({ id, elementId, version: { data } }) =>
      treeBuilder.addNode(
        id,
        `[${data.UNIQ}] ${data.NAME}`,
        undefined,
        { id: data.ID, elementId },
      ),
    );
    return treeBuilder.getArray(dto).data;
  }

  // prettier-ignore
  async getAllByUser(dto: FindAllNsiSubdivisionDto, user: User) {
    const { departmentTitle, regionTitle, showHidden } = dto;
    const departmentId = (await this.getNsiDepartmentService.getDepartmentByName(departmentTitle))?.id;
    const regionId = (await this.getNsiRegionService.getRegionByName(regionTitle))?.id
    const treeBuilder = new TreeBuilder();
    let subdivisions = await this.requests.getSubdivisions(false, { departmentId, regionId });
    if (!showHidden) {
      subdivisions = subdivisions.filter(
        (subdivision) => new Date(subdivision.version.period.upper) > new Date(),
      );
    }
    subdivisions.forEach((subdivision) =>
      treeBuilder.addNode(
        subdivision.id,
        `[${subdivision.version.data.UNIQ}] ${subdivision.version.data.NAME}`,
        undefined,
        { id: subdivision.version.data.ID },
      ),
    );
    const userSubdivisionNames = user.subdivisions.map(({ name }) => name);
    const userSubdivisions = subdivisions.filter((subdivision) =>
      userSubdivisionNames.includes(subdivision.version.data.NAME),
    );
    treeBuilder.enableNodesById(userSubdivisions.map(({ id }) => id));
    return treeBuilder.getTree(dto).data;
  }

  async getSubdivisionByName(name: string) {
    const filteredName = name.replace(/^[\[].*?[\]][ ]/gm, '').toLocaleLowerCase();
    const subdivisions = await this.requests.getSubdivisions();
    return subdivisions.find((subdivision) => subdivision.version.data.NAME.toLocaleLowerCase() === filteredName);
  }
}
