import { clamp, uniqueId } from 'lodash-es';
import {
  catchError,
  concatMap,
  defer,
  EMPTY,
  from,
  mergeMap,
  retry,
  tap,
} from 'rxjs';
import { AsyncReturnType } from 'type-fest';
import { getCellVideo, msToTime, timeToMs } from './utils';
import { operateVideo } from './ffmpeg';
import i18n from './i18n';
import { CellLoc } from './types';

export type Task = CellLoc & {
  action:
    | {
        type: 'start_end';
        start: number;
        end: number;
      }
    | {
        type: 'start_duration';
        start: number;
        duration: number;
      }
    | {
        type: 'end_duration';
        end: number;
        duration: number;
      };
};

export type TaskStatus =
  | 'init'
  | 'pending'
  | 'downloading'
  | 'downloaded'
  | 'processing'
  | 'success'
  | 'failed';

const createTasks = (
  tasks: Task[],
  updateStatus: (task: Task, status: TaskStatus, payload?: any) => void,
) =>
  from(tasks).pipe(
    tap(console.log),
    tap((task) => updateStatus(task, 'pending')),
    mergeMap((task) => {
      updateStatus(task, 'downloading');
      return defer(() => from(downloadFile(task))).pipe(
        retry(3),
        tap(({ task }) => updateStatus(task, 'downloaded')),
        catchError(() => {
          updateStatus(task, 'failed', 'download_failed');
          task;
          return EMPTY;
        }),
      );
    }, 2),
    concatMap((payload) => {
      updateStatus(payload.task, 'processing');
      return from(processVideo(payload)).pipe(
        tap(({ task, result }) =>
          updateStatus(payload.task, 'success', result),
        ),
        catchError((err) => {
          console.error(err);
          updateStatus(payload.task, 'failed', 'process_failed');
          return EMPTY;
        }),
      );
    }),
  );
const downloadFile = async (task: Task) => {
  const info = await getCellVideo(task, true);
  if (!info) {
    throw new Error('only one video attachment is allowed');
  }
  return {
    task,
    video: info.video,
    buffer: info.buffer!,
  };
};

const processVideo = async ({
  task,
  video,
  buffer,
}: AsyncReturnType<typeof downloadFile>) =>
  await operateVideo(
    { buffer, filename: video.name },
    async ({ ffmpeg, path, logs, ext }) => {
      const dur_code = await ffmpeg.exec(['-i', path]);
      console.log(`get duration code: ${dur_code}`);
      const match = logs
        .map(({ message }) => message)
        .join('\n')
        .match(/Duration:\s(\d+):(\d+):(\d+)(\.\d+)?,/);
      if (!match) {
        throw new Error(i18n.t('duration_failed'));
      }
      const ms = timeToMs(
        parseInt(match[1]),
        parseInt(match[2]),
        parseInt(match[3]),
        parseInt(match[4]?.slice(1) || '0'),
      );

      console.log('video total duration', ms);

      let start = 0;
      let duration = 0;
      const { action } = task;
      switch (action.type) {
        case 'start_end': {
          start = clamp(action.start, 0, ms - 1);
          duration = clamp(ms - action.end - start, 1, ms - start);
          break;
        }
        case 'start_duration': {
          start = clamp(action.start, 0, ms - 1);
          duration = clamp(action.duration, 1, ms - start);
          break;
        }
        case 'end_duration': {
          start = clamp(ms - action.end, 0, ms - 1);
          duration = clamp(action.duration, 1, ms - start);
          break;
        }
        default: {
          throw new Error('unimplemented');
        }
      }
      const tmpFile = `${uniqueId('lb-task-result-')}.${ext}`;
      try {
        const args = [
          '-i',
          path,
          '-ss',
          msToTime(start),
          '-t',
          msToTime(duration),
          tmpFile,
        ];
        console.log('ffmpeg args', args);
        const code = await ffmpeg.exec(args);
        console.log(`get process code: ${code}`);
        console.log('process log', logs);
        const result = (await ffmpeg.readFile(tmpFile)) as Uint8Array;

        return { task, result, video };
      } catch (error) {
        throw error;
      } finally {
        await ffmpeg.deleteFile(tmpFile);
      }
    },
  );

export { createTasks };
