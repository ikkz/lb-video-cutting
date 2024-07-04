import { FFmpeg } from '@ffmpeg/ffmpeg';
import { atom } from 'jotai';
import { loadable } from 'jotai/utils';

const ffmpeg = loadable(atom(async () => {
    const instance = new FFmpeg();
    const baseURL = '/ffmpeg-core';
    instance.on('log', ({ message }) => {
        console.log(message);
    });
    await instance.load({
        coreURL: `${baseURL}/ffmpeg-core.js`,
        wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    })
    return instance;
}));

export { ffmpeg }