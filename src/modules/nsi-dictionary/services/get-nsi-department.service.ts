import { Injectable } from '@nestjs/common';
import { NsiDictionaryRequestService } from './nsi-dictionary-request.service';
import { TreeBuilder } from '../infrastructure/tree-builder';
import { FindAuthorityDto } from '@modules/nsi-dictionary/controllers/dtos/find-authority.dto';
import { NsiDepartment } from '../domain/nsi-department.interface';
import { User } from '@common/auth/infrastructure/user.interface';

@Injectable()
export class GetNsiDepartmentService {
  constructor(private requests: NsiDictionaryRequestService) {}

  async getDepartmentByName(name: string): Promise<NsiDepartment | undefined> {
    const filteredName = name.replace(/^[\[].*?[\]][ ]/gm, '').toLocaleLowerCase();
    const departments = await this.requests.getDepartments();
    return departments.find((department) => department.version.data.NAME.toLocaleLowerCase() === filteredName);
  }

  async getAll(dto: FindAuthorityDto) {
    const treeBuilder = new TreeBuilder();
    const departments = await this.requests.getDepartments();
    departments.forEach((department) =>
      treeBuilder.addNode(
        department.id,
        `[${department.version.data.CODE}] ${department.version.data.NAME}`,
        undefined,
        { id: department.version.data.ID },
      ),
    );
    return treeBuilder.getTree(dto).data;
  }

  async getAllByUser(dto: FindAuthorityDto, user: User) {
    const requiredSubdivisionNames = user.subdivisions.map(({ name }) => name);
    const subdivisions = await this.requests.getSubdivisions();
    const userSubdivisions = subdivisions.filter((subdivision) =>
      requiredSubdivisionNames.includes(subdivision.version.data.NAME),
    );
    const departmentIds = userSubdivisions.map((subdivision) => subdivision.version.data.VED_ID.pointer.id);
    const departments = await this.requests.getDepartments();
    const userDepartments = departments.filter((department) => departmentIds.includes(department.id));
    const treeBuilder = new TreeBuilder();
    userDepartments.forEach((department) =>
      treeBuilder.addNode(
        department.id,
        `[${department.version.data.CODE}] ${department.version.data.NAME}`,
        undefined,
        { id: department.version.data.ID },
      ),
    );
    return treeBuilder.getTree(dto).data;
  }
}
