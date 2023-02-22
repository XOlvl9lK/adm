import { transformAuthorities } from '@common/utils/transformAuthorities';

const mockAuthorities = ['[20] орган прокуратуры', '[20007711] Генеральная прокуратура российской федерации'];

describe('transformAuthorities', () => {
  test('Should return authorities in correct format', () => {
    const result = transformAuthorities(mockAuthorities);

    expect(result).toEqual(['орган прокуратуры', 'Генеральная прокуратура российской федерации']);
  });
});
