import {
  Button,
  Divider,
  Message,
  Radio,
  Select,
  Table,
} from '@arco-design/web-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createTasks, Task } from '../task';
import { Time } from '../components/time';
import { useRequest } from 'ahooks';
import {
  bitable,
  FieldType,
  ToastType,
  ViewType,
} from '@lark-base-open/js-sdk';
import i18n from '../i18n';
import { FieldRender } from '../components/field';
import { identity } from 'lodash-es';
import { createAttachmentField, getCellVideo, writeFiles } from '../utils';
import { Status } from '../components/status';
import { produce } from 'immer';
import { ResultField } from '../components/result-field';
import { useAtomValue } from 'jotai';
import { resultFieldAtom } from '../state';

const BatchView = () => {
  const resultField = useAtomValue(resultFieldAtom);
  const { t } = useTranslation();
  const [actionType, setActionType] =
    useState<Task['action']['type']>('start_duration');

  const [sdStart, setSdStart] = useState(0);
  const [sdDuration, setSdDuration] = useState(0);

  const [seStart, setSeStart] = useState(0);
  const [seEnd, setSeEnd] = useState(0);

  const [edDuration, setEdDuration] = useState(0);
  const [edEnd, setEdEnd] = useState(0);

  const { data: tableData, loading: fieldLoading } = useRequest(async () => {
    const table = await bitable.base.getActiveTable();
    const fields = await table.getFieldMetaListByType(FieldType.Attachment);
    const fieldOptions = fields.map((field) => ({
      label: field.name,
      value: field.id,
    }));
    const view = await table.getActiveView();
    if ((await view.getType()) !== ViewType.Grid) {
      Message.warning(i18n.t('grid_view'));
    }
    return { fieldOptions, table, view };
  });

  const { fieldOptions, table, view } = tableData || {};

  const [fieldId, setFieldId] = useState<string | undefined>(undefined);
  const {
    data: tasks,
    loading: tasksLoading,
    mutate: setTasks,
  } = useRequest(
    async () => {
      if (!(table && view)) {
        return [];
      }
      try {
        bitable.ui.showToast({
          toastType: ToastType.info,
          message: i18n.t('select_record'),
        });
        return (
          await Promise.all(
            (await bitable.ui.selectRecordIdList(table.id, view.id)).map(
              async (recordId) => ({
                recordId,
                status: 'init' as string,
                video: await getCellVideo(
                  { tableId: table.id, recordId, fieldId: fieldId! },
                  false,
                ),
              }),
            ),
          )
        )
          .filter(({ video }) => video)
          .map(({ recordId, status }) => ({ recordId, status }));
      } catch (error) {
        return [];
      }
    },
    {
      ready: Boolean(fieldId && table && view),
      refreshDeps: [fieldId, table, view],
    },
  );

  const { data: hintOptions, loading: hintLoading } = useRequest(
    async () => {
      if (!(table && view)) {
        return [];
      }
      const options = (await view.getFieldMetaList()).map((field) => ({
        label: field.name,
        value: field.id,
      }));
      if (options[0]) {
        setHintField(options[0].value);
      }
      return options;
    },
    {
      ready: Boolean(table && view),
    },
  );
  const [hintField, setHintField] = useState<string | undefined>();

  const { loading: processLoading, run: startProcess } = useRequest(
    async () => {
      if (!tasks || !table) {
        return;
      }
      let action: Task['action'];
      switch (actionType) {
        case 'start_end':
          action = {
            type: 'start_end',
            start: seStart,
            end: seEnd,
          };
          break;
        case 'start_duration':
          action = {
            type: 'start_duration',
            start: sdStart,
            duration: sdDuration,
          };
          break;
        case 'end_duration':
          action = {
            type: 'end_duration',
            end: edEnd,
            duration: edDuration,
          };
          break;
      }
      const tasks$ = createTasks(
        tasks.map((task) => ({
          tableId: table.id,
          fieldId: fieldId!,
          recordId: task.recordId,
          action,
        })),
        (task, status) => {
          setTasks((old) => {
            return produce(old, (draft) => {
              const target = draft?.find(
                ({ recordId }) => recordId === task.recordId,
              );
              if (target) {
                target.status = status;
              }
            });
          });
        },
      );
      const resultFieldId =
        resultField === 'new'
          ? await createAttachmentField(table.id)
          : undefined;
      return new Promise<void>((resolve, reject) => {
        const total = tasks.length;
        let ok = 0;
        tasks$.subscribe(async ({ result, task, video }) => {
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
            resultFieldId || task.fieldId,
          );

          ok++;
          if (ok === total) {
            resolve();
          }
        });
      });
    },
    {
      manual: true,
      ready: Boolean(table),
      refreshDeps: [table],
    },
  );

  return (
    <div>
      <Select
        value={fieldId}
        onChange={setFieldId}
        options={fieldOptions}
        loading={fieldLoading}
        placeholder={t('select_field')}
        disabled={processLoading}
      />
      <div className="flex gap-x-4 mt-4">
        <ResultField disabled={processLoading} />
        <Button
          type="primary"
          onClick={startProcess}
          disabled={processLoading}
          loading={processLoading}
        >
          {t('process')}
        </Button>
      </div>
      <Divider />
      <div className="text-lg font-bold text-center">{t('default_action')}</div>
      <Radio.Group
        direction="vertical"
        value={actionType}
        onChange={setActionType}
        disabled={processLoading}
      >
        <Radio value="start_duration">{t('action_start_duration')}</Radio>
        {actionType === 'start_duration' && (
          <div className="mx-7 mt-2 mb-4 flex flex-col gap-y-3">
            <div className="flex justify-between items-center gap-x-2">
              <span className="whitespace-nowrap text-gray-500 text-xs">
                {t('start_time')}
              </span>
              <Time value={sdStart} onChange={setSdStart} />
            </div>
            <div className="flex justify-between items-center gap-x-2">
              <span className="whitespace-nowrap text-gray-500 text-xs">
                {t('duration_time')}
              </span>
              <Time value={sdDuration} onChange={setSdDuration} />
            </div>
          </div>
        )}
        <Radio value="start_end">{t('action_start_end')}</Radio>
        {actionType === 'start_end' && (
          <div className="mx-7 mt-2 mb-4 flex flex-col gap-y-3">
            <div className="flex justify-between items-center gap-x-2">
              <span className="whitespace-nowrap text-gray-500 text-xs">
                {t('se_start')}
              </span>
              <Time value={seStart} onChange={setSeStart} />
            </div>
            <div className="flex justify-between items-center gap-x-2">
              <span className="whitespace-nowrap text-gray-500 text-xs">
                {t('se_end')}
              </span>
              <Time value={seEnd} onChange={setSeEnd} />
            </div>
          </div>
        )}
        <Radio value="end_duration">{t('action_end_duration')}</Radio>
        {actionType === 'end_duration' && (
          <div className="mx-7 mt-2 mb-4 flex flex-col gap-y-3">
            <div className="flex justify-between items-center gap-x-2">
              <span className="whitespace-nowrap text-gray-500 text-xs">
                {t('duration_time')}
              </span>
              <Time value={edDuration} onChange={setEdDuration} />
            </div>
            <div className="flex justify-between items-center gap-x-2">
              <span className="whitespace-nowrap text-gray-500 text-xs">
                {t('ed_end')}
              </span>
              <Time value={edEnd} onChange={setEdEnd} />
            </div>
          </div>
        )}
      </Radio.Group>
      <Divider />
      <div className="text-lg font-bold text-center mb-3">{t('task_list')}</div>
      <Table
        data={tasks}
        loading={tasksLoading}
        rowKey={identity}
        columns={[
          {
            title: (
              <Select
                loading={hintLoading}
                options={hintOptions}
                value={hintField}
                onChange={setHintField}
                renderFormat={(_, v) =>
                  hintOptions?.find(({ value }) => value === v)?.label || '-'
                }
              />
            ),
            dataIndex: 'recordId',
            render: (value) =>
              hintField && <FieldRender recordId={value} fieldId={hintField} />,
          },

          {
            title: t('task_status'),
            dataIndex: 'status',
            render: (status) => <Status status={status} />,
          },
        ]}
      />
    </div>
  );
};

export { BatchView };
