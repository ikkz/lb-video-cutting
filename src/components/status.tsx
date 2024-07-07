import { FC } from 'react';
import { TaskStatus } from '../task';
import { useTranslation } from 'react-i18next';
import { Tag } from '@arco-design/web-react';

export const Status: FC<{
  status: TaskStatus | string;
}> = ({ status }) => {
  const { t } = useTranslation();
  const statusText = t(
    ALL_STATUS.includes(status) ? `status_${status}` : status,
  );

  return <Tag color={STATUS_MAP[status] || 'read'}>{statusText}</Tag>;
};

const STATUS_MAP: Record<string, string> = {
  init: 'gray',
  pending: 'gray',
  downloading: 'blue',
  downloaded: 'blue',
  processing: 'purple',
  processed: 'purple',
  writing: 'cyan',
  success: 'green',
  failed: 'red',
};

const ALL_STATUS = Object.keys(STATUS_MAP);
