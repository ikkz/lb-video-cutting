import './i18n';
import { useState } from 'react';
import { Radio, Spin } from '@arco-design/web-react';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';
import { SingleView } from './views/single';
import { BatchView } from './views/batch';
import { ffmpegAtom } from './state';

const App = () => {
  const [isBatch, setIsBatch] = useState(true);
  const { t } = useTranslation();
  const { state } = useAtomValue(ffmpegAtom);

  if (state !== 'hasData') {
    return (
      <div className="flex flex-col items-center pt-4">
        {state === 'loading' ? <Spin dot /> : null}
        <div className="mt-4">
          {state === 'loading' ? t('loading_resource') : t('load_failed')}
        </div>
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex justify-center">
        <Radio.Group
          type="button"
          value={isBatch}
          onChange={(value) => setIsBatch(value)}
        >
          <Radio value={false}>{t('single_mode')}</Radio>
          <Radio value={true}>{t('batch_mode')}</Radio>
        </Radio.Group>
      </div>
      <div className="mt-4 px-6">
        {isBatch ? <BatchView /> : <SingleView />}
      </div>
    </div>
  );
};

export { App };
