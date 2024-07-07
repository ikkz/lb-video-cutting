import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { resultFieldAtom, selectionAtom } from '../state';
import {
  bitable,
  checkers,
  FieldType,
  IAttachmentField,
} from '@lark-base-open/js-sdk';
import { useGetState, useRequest } from 'ahooks';
import { Button, Divider, Input, Message } from '@arco-design/web-react';
import i18n from '../i18n';
import { TaskEditor } from '../components/task-editor';
import { CellLoc } from '../types';
import { useTranslation } from 'react-i18next';
import { createTasks } from '../task';
import { ResultField } from '../components/result-field';
import { writeFiles } from '../utils';

const SingleView = () => {
  const resultField = useAtomValue(resultFieldAtom);
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

  const { run, loading } = useRequest(
    () => {
      const [start, end] = range;
      if (start >= end) {
        Message.error(i18n.t('invalid_range'));
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
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
                  content: i18n.t(`status_${status}`),
                  duration: 1e9,
                });
                break;
              }
              case 'success': {
                Message.success({ id, content: i18n.t(`status_${status}`) });
                break;
              }
              case 'failed': {
                Message.error({ id, content: i18n.t(payload) });
              }
            }
          },
        );
        task$.subscribe(async ({ task, result, video }) => {
          await writeFiles(
            [
              {
                name: video.name,
                type: video.type,
                buffer: result,
                recordId: task.recordId,
              },
            ],
            task.tableId,
            resultField === 'new' ? undefined : task.fieldId,
          );
          resolve();
        });
      });
    },
    {
      manual: true,
    },
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          className="flex-1 pointer-events-none"
          value={target?.name}
          placeholder={t('invalid_cell')}
        />
        <Button disabled={loading} onClick={() => setTarget(null)}>
          {t('cancel')}
        </Button>
      </div>
      <div className="mb-4 flex gap-x-4">
        <ResultField disabled={loading} />
        <Button onClick={run} disabled={loading || !target} type="primary">
          {t('process')}
        </Button>
      </div>
      <Divider />
      {target ? (
        <>
          <TaskEditor
            {...target}
            range={range}
            setRange={setRange}
            disabled={loading}
          />
        </>
      ) : null}
    </div>
  );
};

export { SingleView };
