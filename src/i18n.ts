import { bitable } from '@lark-base-open/js-sdk';
import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: {
        single_mode: '手动裁剪',
        batch_mode: '批量裁剪',
        loading_resource: '加载资源中...',
        load_failed: '加载失败',
        invalid_cell: '请在表格中选择仅有一个视频的附件字段',
        invalid_range: '开始时间需要小于结束时间',
        status_pending: '排队中',
        status_downloading: '下载中',
        status_downloaded: '下载完成',
        status_processing: ' 处理中',
        status_success: '处理成功',
        status_failed: '处理失败',
        download_failed: '下载失败',
        duration_failed: '获取时长失败',
        process_failed: '处理失败',
        preview: '预览',
        process: '开始处理',
        start_time: '开始时间',
        end_time: ' 结束时间',
        fill_current: '填入下方播放器的当前时间',
        hour: '时',
        minute: '分',
        second: '秒',
        millisecond: '毫秒',
      },
    },
    en: {
      translation: {},
    },
    ja: {
      translation: {},
    },
  },
  lng: 'zh',
  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

bitable.bridge.getLanguage().then(i18n.changeLanguage).finally(console.error);

export default i18n;
