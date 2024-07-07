import {
  distinctUntilChanged,
  from,
  fromEventPattern,
  startWith,
  switchMap,
  Observable,
} from 'rxjs';
import { bitable, Selection } from '@lark-base-open/js-sdk';
import isEqual from 'lodash-es/isEqual';

export const userSelection$: Observable<Selection> = from(
  bitable.base.getSelection(),
).pipe(
  switchMap((selection) =>
    fromEventPattern<Selection>(
      (handler) => bitable.base.onSelectionChange(({ data }) => handler(data)),
      (_, signal) => signal(),
    ).pipe(startWith(selection)),
  ),
  distinctUntilChanged(isEqual),
);
