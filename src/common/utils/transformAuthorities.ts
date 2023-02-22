export const transformAuthorities = (authorities?: string[]) => {
  return authorities?.map((val) => val.replace(/^[\[].*?[\]][ ]/gm, ''));
};
