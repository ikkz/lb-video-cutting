import { FC } from 'react';
import { CellLoc } from '../types';
import { useRequest } from 'ahooks';
import { bitable } from '@lark-base-open/js-sdk';

export const FieldRender: FC<Partial<CellLoc>> = ({
  recordId,
  fieldId,
  tableId,
}) => {
  const { data } = useRequest(
    async () => {
      const table = await bitable.base.getTableById(tableId!);
      return await table.getCellString(fieldId!, recordId!);
    },
    {
      refreshDeps: [fieldId, recordId, tableId],
      ready: Boolean(fieldId && recordId && tableId),
    },
  );

  return <span>{data || '-'}</span>;
};
