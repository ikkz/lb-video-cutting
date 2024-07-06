import { FFmpeg } from '@ffmpeg/ffmpeg';
import { uniqueId } from 'lodash-es';
import { concatMap, from, Subject } from 'rxjs';

interface LogEvent {
  type: string;
  message: string;
}

const ffmpeg = new FFmpeg();

const ffmpegTasks = new Subject<() => Promise<void>>();

ffmpegTasks
  .asObservable()
  .pipe(concatMap((task) => from(task())))
  .subscribe();

export const operateFFmpeg = <T>(
  action: (ffmpeg: FFmpeg, logs: LogEvent[]) => Promise<T>,
) =>
  new Promise<{
    result: T;
    logs: LogEvent[];
  }>((resolve, reject) => {
    ffmpegTasks.next(async () => {
      const logs: LogEvent[] = [];
      const onLog = (log: LogEvent) => logs.push(log);
      ffmpeg.on('log', onLog);
      try {
        resolve({
          result: await action(ffmpeg, logs),
          logs,
        });
      } catch (error) {
        reject(error);
      } finally {
        ffmpeg.off('log', onLog);
      }
    });
  });

export const ffmpegReady = operateFFmpeg(async (instance) => {
  console.log('loading ffmpeg');
  const baseURL = '/ffmpeg-core';
  instance.on('log', ({ message }) => {
    console.log(message);
  });
  await instance.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });
  console.log('loaded ffmpeg');
  return instance;
});

export const operateVideo = async <T>(
  file: {
    buffer: ArrayBuffer;
    filename: string;
  },
  action: (params: {
    ffmpeg: FFmpeg;
    path: string;
    ext: string;
    logs: LogEvent[];
  }) => Promise<T>,
) => {
  const ext = file.filename.split('.').pop() || 'mp4';
  const path = `${uniqueId('lb-task-')}.${ext}`;
  let shouldDeleteSource = false;
  try {
    return (
      await operateFFmpeg(async (ffmpeg, logs) => {
        await ffmpeg.writeFile(path, new Uint8Array(file.buffer));
        shouldDeleteSource = true;
        return await action({ ffmpeg, path, ext, logs });
      })
    ).result;
  } finally {
    if (shouldDeleteSource) {
      await ffmpeg.deleteFile(path);
    }
  }
};
