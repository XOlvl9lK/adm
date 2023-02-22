import { transformAuthorities } from '@common/utils/transformAuthorities';
import { User } from '../infrastructure/user.interface';

export const filterUserDivisions = <T extends { divisionTitles?: string[] | undefined }>(data: T, user?: User): T => {
  const divisionTitles = transformAuthorities(data.divisionTitles || []);
  if (!user) return data;
  const allowedDivisions = user.subdivisions.map(({ name }) => name);
  return {
    ...data,
    divisionTitles:
      divisionTitles && divisionTitles.length
        ? divisionTitles.filter((division) => allowedDivisions.includes(division))
        : allowedDivisions,
  };
};
