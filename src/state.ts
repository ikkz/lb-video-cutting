import { atom, createStore } from 'jotai';
import { atomWithObservable, loadable } from 'jotai/utils';
import { ffmpegReady } from './ffmpeg';
import { userSelection$ } from './rx';

export const store = createStore();

export const ffmpegAtom = loadable(atom(() => ffmpegReady));

export const selectionAtom = atomWithObservable(() => userSelection$, {
  initialValue: null,
});
