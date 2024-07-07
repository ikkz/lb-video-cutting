import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
export default defineConfig({
  output: {
    copy: [{ from: 'node_modules/@ffmpeg/core/dist/umd', to: 'ffmpeg-core' }],
  },
  plugins: [pluginReact()],
});
