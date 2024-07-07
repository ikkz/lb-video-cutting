import { Input, InputNumber } from '@arco-design/web-react';
import { FC, useState } from 'react';
import { msToTime, timeToMs } from '../utils';
import { useTranslation } from 'react-i18next';

type TimeProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
};

export const Time: FC<TimeProps> = ({ value, onChange, disabled }) => {
  const time = msToTime(value);
  const [hour, minute, second, ms] = time
    .split(/[:\.]/)
    .map((v) => parseInt(v));
  const { t } = useTranslation();

  const onValueChange = (pos: number, value: number) => {
    const ns = [hour, minute, second, ms];
    ns[pos] = value;
    onChange(timeToMs.apply(null, ns as any));
  };

  return (
    <div className="flex gap-x-1">
      <InputNumber
        placeholder={t('hour')}
        size="mini"
        value={hour}
        onChange={(value) => onValueChange(0, value)}
        disabled={disabled}
      />
      <span>:</span>
      <InputNumber
        placeholder={t('minute')}
        size="mini"
        value={minute}
        max={60}
        onChange={(value) => onValueChange(1, value)}
        disabled={disabled}
      />
      <span>:</span>
      <InputNumber
        placeholder={t('second')}
        size="mini"
        value={second}
        max={60}
        onChange={(value) => onValueChange(2, value)}
        disabled={disabled}
      />
      <span>.</span>
      <InputNumber
        placeholder={t('millisecond')}
        size="mini"
        value={ms}
        max={999}
        onChange={(value) => onValueChange(3, value)}
        disabled={disabled}
      />
    </div>
  );
};
