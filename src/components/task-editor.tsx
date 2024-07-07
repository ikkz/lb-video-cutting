import { FC, useEffect, useId, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Time } from './time';
import { Button, Spin, Tooltip } from '@arco-design/web-react';
import Player, { Events, I18N } from 'xgplayer';
import JP from 'xgplayer/es/lang/jp';

import 'xgplayer/dist/index.min.css';
import { IconClockCircle } from '@arco-design/web-react/icon';
import { useGetState, useRequest } from 'ahooks';
import { getCellVideo } from '../utils';
import { CellLoc } from '../types';
import { clamp } from 'lodash-es';
import i18n from '../i18n';

I18N.use(JP);

type TaskEditorProps = CellLoc & {
  range: [number, number];
  setRange: (range: [number, number]) => void;
  disabled?: boolean;
};

export const TaskEditor: FC<TaskEditorProps> = ({
  tableId,
  fieldId,
  recordId,
  range,
  setRange,
  disabled,
}) => {
  const { t, i18n } = useTranslation();
  const [duration, setDuration, getDuration] = useGetState(0);
  const [start, end] = range;
  const setStart = (value: number) =>
    setRange([clamp(value, 0, getDuration()), end]);
  const setEnd = (value: number) =>
    setRange([start, clamp(value, 0, getDuration())]);

  const {
    data: url,
    loading: urlLoading,
    error: urlError,
  } = useRequest(
    async () => {
      const data = await getCellVideo({ tableId, recordId, fieldId }, true);
      if (!data) {
        return;
      }
      const blob = new Blob([data.buffer!], { type: data.video.type });
      return URL.createObjectURL(blob);
    },
    {
      ready: Boolean(tableId && fieldId && recordId),
    },
  );

  useEffect(() => {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }, [url]);

  const playerId = useId();
  const player = useRef<Player | null>(null);

  useEffect(() => {
    if (!url) {
      return;
    }
    const instance = new Player({
      id: playerId,
      url,
      autoplay: false,
      width: '100%',
      height: '100%',
      lang: i18n.language === 'ja' ? 'jp' : i18n.language,
    });
    instance.on(Events.DURATION_CHANGE, () => {
      if (instance.duration) {
        const duration = Math.floor(instance.duration * 1000);
        setDuration(duration);
        setRange([0, duration]);
      }
    });

    player.current = instance;
    return () => {
      instance.offAll();
      instance.destroy();
      player.current = null;
    };
  }, [playerId, url]);

  if (urlLoading) {
    return (
      <div className="flex justify-center">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {duration ? (
        <>
          <div className="flex justify-between items-center gap-x-2">
            <span className="whitespace-nowrap text-gray-500 text-xs">
              {t('start_time')}
            </span>
            <Time value={start} onChange={setStart} disabled={disabled} />
            <Tooltip content={t('fill_current')}>
              <Button
                icon={<IconClockCircle />}
                size="mini"
                type="primary"
                className="flex-shrink-0"
                disabled={disabled}
                onClick={() =>
                  player.current && setStart(player.current.currentTime * 1000)
                }
              />
            </Tooltip>
          </div>
          <div className="flex justify-between items-center gap-x-2">
            <span className="whitespace-nowrap text-gray-500 text-xs">
              {t('end_time')}
            </span>
            <Time value={end} onChange={setEnd} disabled={disabled} />
            <Tooltip content={t('fill_current')}>
              <Button
                icon={<IconClockCircle />}
                size="mini"
                type="primary"
                className="flex-shrink-0"
                onClick={() =>
                  player.current && setEnd(player.current.currentTime * 1000)
                }
                disabled={disabled}
              />
            </Tooltip>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <Spin />
        </div>
      )}

      <div className="h-64 w-full">
        <div id={playerId} />
      </div>
    </div>
  );
};
