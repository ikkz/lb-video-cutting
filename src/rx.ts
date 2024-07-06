import {
  BehaviorSubject,
  distinctUntilChanged,
  from,
  fromEventPattern,
  startWith,
  switchMap,
  merge,
  map,
  Observable,
  combineLatest,
  catchError,
  of,
  share,
  EMPTY,
} from 'rxjs';
import {
  bitable,
  FieldType,
  Selection,
  ToastType,
} from '@lark-base-open/js-sdk';
import isEqual from 'lodash-es/isEqual';
import pick from 'lodash-es/pick';
import isEmpty from 'lodash-es/isEmpty';

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
