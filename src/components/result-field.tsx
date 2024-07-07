import { useAtom } from 'jotai';
import { FC } from 'react';
import { resultFieldAtom } from '../state';
import { Select } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
const Option = Select.Option;

export const ResultField: FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { t } = useTranslation();
  const [resultField, setResultField] = useAtom(resultFieldAtom);

  return (
    <Select value={resultField} onChange={setResultField} disabled={disabled}>
      <Option value={'new'}>{t('result_new')}</Option>
      <Option value={'override'}>{t('result_override')}</Option>
    </Select>
  );
};
