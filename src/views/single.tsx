import { useEffect, useState } from 'react';
import { atomWithObservable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { selectionAtom } from '../state';
import {
  bitable,
  checkers,
  FieldType,
  Selection,
  ToastType,
  IAttachmentField,
} from '@lark-base-open/js-sdk';
import { useGetState, useRequest } from 'ahooks';
import { Button, Divider, Input, Message } from '@arco-design/web-react';
import i18n from '../i18n';
import { TaskEditor } from '../components/task-editor';
import { CellLoc } from '../types';
import { useTranslation } from 'react-i18next';
import { createTasks } from '../task';

const SingleView = () => {
  const { t } = useTranslation();
  const selection = useAtomValue(selectionAtom);
  const [target, setTarget, getTarget] = useGetState<
    (CellLoc & { name: string }) | null
  >(null);

  useEffect(() => {
    if (getTarget() || !selection) {
      return;
    }
    const { tableId, recordId, fieldId } = selection;
    if (!(tableId && recordId && fieldId)) {
      return;
    }
    (async () => {
      const table = await bitable.base.getTableById(tableId);
      const cell = await table.getCellValue(fieldId, recordId);
      if (
        !checkers.isAttachments(cell) ||
        cell.length !== 1 ||
        !cell[0].type.startsWith('video/')
      ) {
        Message.warning(i18n.t('invalid_cell'));
        return;
      }
      setTarget({ fieldId, tableId, recordId, name: cell[0].name });
    })();
  }, [selection]);

  const [range, setRange] = useState([0, 0] as [number, number]);

  const process = async () => {
    const [start, end] = range;
    if (start >= end) {
      Message.error(i18n.t('invalid_range'));
      return;
    }
    const id = 'single_prcess';
    const task$ = createTasks(
      [
        {
          ...target!,
          action: {
            type: 'start_duration',
            start,
            duration: end - start,
          },
        },
      ],
      (_, status, payload) => {
        switch (status) {
          case 'pending':
          case 'downloading':
          case 'downloaded':
          case 'processing': {
            Message.loading({
              id,
              content: `status_${status}`,
              duration: 1e9,
            });
            break;
          }
          case 'success': {
            Message.success({ id, content: `status_${status}` });
            break;
          }
          case 'failed': {
            Message.error({ id, content: payload });
          }
        }
      },
    );
    task$.subscribe(async ({ task, result, video }) => {
      const table = await bitable.base.getTableById(task.tableId);
      const newField = await table.addField({
        type: FieldType.Attachment,
        name: 'video result',
      });
      const field = await table.getFieldById<IAttachmentField>(newField);
      const file = new File([result], video.name, {
        type: video.type,
      });
      field.setValue(task.recordId, file);
    });
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          className="flex-1 pointer-events-none"
          value={target?.name}
          placeholder="请选中仅包含一个视频的附件单元格"
        />
        <Button onClick={() => setTarget(null)}>取消</Button>
      </div>
      <Divider />
      {target ? (
        <>
          <div className="mb-4">
            <Button onClick={process} long type="primary" className={'flex-1'}>
              {t('process')}
            </Button>
          </div>
          <TaskEditor {...target} range={range} setRange={setRange} />
        </>
      ) : null}
    </div>
  );
};

export { SingleView };
