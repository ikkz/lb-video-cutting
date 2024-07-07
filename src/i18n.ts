import { bitable } from '@lark-base-open/js-sdk';
import * as i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    zh: {
      translation: {
        single_mode: '手动剪辑',
        batch_mode: '批量剪辑',
        loading_resource: '加载资源中...',
        load_failed: '加载失败',
        invalid_cell: '请在表格中选择仅有一个视频的附件字段',
        cancel: '取消',
        invalid_range: '开始时间需要小于结束时间',
        status_init: '未开始',
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
        process_result: '转换结果',
        action_start_duration: '截取开始时间点之后的时间段',
        action_start_end: '删除首尾固定的时间段',
        action_end_duration: '截取结束时间点之前的时间段',
        duration_time: '时间长度',
        se_start: '首时间长度',
        se_end: '尾时间长度',
        ed_end: '结束时间',
        select_field: '请选择要处理的视频附件列',
        default_action: '剪辑方式',
        task_list: '任务列表',
        grid_view: '请切换至表格视图',
        select_record:
          '请选择要进行转换的记录，如果选择的记录中对应的附件字段不是仅包含一个视频，那么该记录将不会添加到下方的任务列表中',
        task_status: '状态',
        result_override: '输出覆盖原字段',
        result_new: ' 输出新建字段',
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
