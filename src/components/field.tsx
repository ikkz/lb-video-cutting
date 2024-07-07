import { FC } from 'react';
import { CellLoc } from '../types';
import { useRequest } from 'ahooks';
import { bitable } from '@lark-base-open/js-sdk';

export const FieldRender: FC<Omit<CellLoc, 'tableId'>> = ({
  recordId,
  fieldId,
}) => {
  const { data } = useRequest(
    async () => {
      const table = await bitable.base.getActiveTable();
      console.log({ fieldId, recordId });
      return await table.getCellString(fieldId, recordId);
    },
    {
      refreshDeps: [fieldId, recordId],
    },
  );

  return <span>{data || '-'}</span>;
};
