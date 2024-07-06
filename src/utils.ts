import { bitable, checkers } from '@lark-base-open/js-sdk';
import { CellLoc } from './types';

const MS_PER_HOUR = 3600000;
const MS_PER_MINUTE = 60000;
const MS_PER_SECOND = 1000;

export function timeToMs(
  hours: number,
  minutes: number,
  seconds: number,
  ms: number = 0,
): number {
  const hoursInMs = hours * MS_PER_HOUR;
  const minutesInMs = minutes * MS_PER_MINUTE;
  const secondsInMs = seconds * MS_PER_SECOND;
  return hoursInMs + minutesInMs + secondsInMs + ms;
}

export function msToTime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / MS_PER_HOUR);
  milliseconds %= MS_PER_HOUR;
  const minutes = Math.floor(milliseconds / MS_PER_MINUTE);
  milliseconds %= MS_PER_MINUTE;
  const seconds = Math.floor(milliseconds / MS_PER_SECOND);
  const ms = milliseconds % MS_PER_SECOND;

  const pad = (num: number, size: number) => num.toString().padStart(size, '0');

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(ms, 3)}`;
}

export async function getCellVideo(
  { tableId, recordId, fieldId }: CellLoc,
  download?: boolean,
) {
  const table = await bitable.base.getTableById(tableId);
  const cell = await table.getCellValue(fieldId, recordId);
  if (
    !checkers.isAttachments(cell) ||
    cell.length !== 1 ||
    !cell[0].type.startsWith('video/')
  ) {
    return null;
  }
  const video = cell[0];

  if (download) {
    const url = (
      await table.getCellAttachmentUrls([video.token], fieldId, recordId)
    )[0];
    const buffer = await fetch(url, { method: 'GET' }).then((res) =>
      res.arrayBuffer(),
    );

    return { video, url, buffer };
  }

  return { video };
}
