
export function parseTableFilters(sParams: { [key: string]: string | string[] | undefined }) {
  const columnsArr = Array.isArray(sParams.columns)
    ? sParams.columns
    : sParams.columns ? [sParams.columns] : [];

  const contentArr = Array.isArray(sParams.content)
    ? sParams.content
    : sParams.content ? [sParams.content] : [];

  const filterMap = new Map<string, string[]>();
  for (let i = 0; i < columnsArr.length; i++) {
    const col = columnsArr[i];
    const val = contentArr[i];
    if (col && val !== undefined) {
      if (!filterMap.has(col)) filterMap.set(col, []);
      filterMap.get(col)!.push(val);
    }
  }

  return filterMap;
}