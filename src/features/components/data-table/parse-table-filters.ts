export function parseTableFilters(sParams: {
  [key: string]: string | string[] | undefined;
}) {
  let columnsArr: string[] = [];
  if (sParams.columns) {
    columnsArr = Array.isArray(sParams.columns)
      ? sParams.columns
      : [sParams.columns];
  }

  let contentArr: string[] = [];
  if (sParams.content) {
    contentArr = Array.isArray(sParams.content)
      ? sParams.content
      : [sParams.content];
  }

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
