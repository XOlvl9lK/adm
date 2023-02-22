import { EntityRepository } from 'typeorm';
import { SmevHistoryEntity } from '@modules/smev-history/domain/smev-history.entity';
import { FindSmevHistoryDto } from '@modules/smev-history/controllers/dtos/find-smev-history.dto';
import { RepoBase } from '@common/base/repo.base';

@EntityRepository(SmevHistoryEntity)
export class SmevHistoryRepository extends RepoBase<SmevHistoryEntity> {
  async findAll({
    sort,
    createDate,
    updateDate,
    departmentName,
    state,
    pageSize,
    page,
    methodName,
  }: FindSmevHistoryDto) {
    const qb = this.createQueryBuilder('smevHistory')
      .leftJoinAndSelect('smevHistory.integration', 'integration')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (state) {
      qb.andWhere('smevHistory.state IN (:...state)', { state });
    }

    if (methodName) {
      qb.andWhere('smevHistory.methodName IN (:...methodName)', { methodName });
    }

    if (departmentName) {
      qb.andWhere('integration.departmentName IN (:...departmentName)', { departmentName });
    }

    if (createDate) {
      if (createDate[0])
        qb.andWhere(`smevHistory.createDate >= :start`, {
          start: new Date(createDate[0]).toISOString(),
        });
      if (createDate[1])
        qb.andWhere(`smevHistory.createDate <= :finish`, {
          finish: new Date(createDate[1]).toISOString(),
        });
    }

    if (updateDate) {
      if (updateDate[0])
        qb.andWhere(`smevHistory.updateDate >= :start`, {
          start: new Date(updateDate[0]).toISOString(),
        });
      if (updateDate[1])
        qb.andWhere(`smevHistory.updateDate <= :finish`, {
          finish: new Date(updateDate[1]).toISOString(),
        });
    }

    if (sort) {
      qb.orderBy(sort);
    }

    return await qb.getManyAndCount();
  }

  async findIds(ids: number[], sort?: FindSmevHistoryDto['sort']) {
    const qb = this.createQueryBuilder('smevHistory')
      .leftJoinAndSelect('smevHistory.integration', 'integration')
      .where('smevHistory.id IN (:...ids)', { ids });

    if (sort) {
      qb.orderBy(sort);
    }

    return await qb.getMany();
  }
}
