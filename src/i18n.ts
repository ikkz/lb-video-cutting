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
      },
    },
    en: {
      translation: {
      },
    },
    ja: {
      translation: {
      },
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