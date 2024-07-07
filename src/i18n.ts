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
        status_processed: '待写入',
        status_writing: '写入中',
        status_success: '成功',
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
      translation: {
        single_mode: 'Manual Editing',
        batch_mode: 'Batch Editing',
        loading_resource: 'Loading resources...',
        load_failed: 'Load Failed',
        invalid_cell:
          'Please select a field in the table that contains only one video attachment',
        cancel: 'Cancel',
        invalid_range: 'Start time must be less than end time',
        status_init: 'Not Started',
        status_pending: 'Queuing',
        status_downloading: 'Downloading',
        status_downloaded: 'Download Complete',
        status_processing: 'Processing',
        status_processed: 'Pending Write',
        status_writing: 'Writing',
        status_success: 'Successful',
        status_failed: 'Processing Failed',
        download_failed: 'Download Failed',
        duration_failed: 'Failed to Retrieve Duration',
        process_failed: 'Processing Failed',
        preview: 'Preview',
        process: 'Start Processing',
        start_time: 'Start Time',
        end_time: 'End Time',
        fill_current: 'Fill with the current time of the player below',
        hour: 'Hour',
        minute: 'Minute',
        second: 'Second',
        millisecond: 'Millisecond',
        process_result: 'Conversion Result',
        action_start_duration:
          'Capture the time segment after the starting time',
        action_start_end: 'Delete the fixed time segment at the start and end',
        action_end_duration: 'Capture the time segment before the end time',
        duration_time: 'Duration',
        se_start: 'Start Duration',
        se_end: 'End Duration',
        ed_end: 'End Time',
        select_field: 'Please select the video attachment column to process',
        default_action: 'Editing Mode',
        task_list: 'Task List',
        grid_view: 'Please switch to grid view',
        select_record:
          'Please select the records to be converted. If the attachment field of the selected records does not contain only one video, then the record will not be added to the task list below',
        task_status: 'Status',
        result_override: 'Output Overwrites Original Field',
        result_new: 'Output to New Field',
      },
    },
    ja: {
      translation: {
        single_mode: '手動編集',
        batch_mode: '一括編集',
        loading_resource: 'リソースを読み込み中...',
        load_failed: '読み込み失敗',
        invalid_cell:
          'テーブルからビデオの添付ファイルが1つだけ含まれるフィールドを選択してください',
        cancel: 'キャンセル',
        invalid_range: '開始時間は終了時間よりも前でなければなりません',
        status_init: '未開始',
        status_pending: '待機中',
        status_downloading: 'ダウンロード中',
        status_downloaded: 'ダウンロード完了',
        status_processing: '処理中',
        status_processed: '書き込み待ち',
        status_writing: '書き込み中',
        status_success: '成功',
        status_failed: '処理失敗',
        download_failed: 'ダウンロード失敗',
        duration_failed: '期間の取得失敗',
        process_failed: '処理失敗',
        preview: 'プレビュー',
        process: '処理開始',
        start_time: '開始時間',
        end_time: '終了時間',
        fill_current: '以下のプレイヤーの現在の時間で入力',
        hour: '時',
        minute: '分',
        second: '秒',
        millisecond: 'ミリ秒',
        process_result: '変換結果',
        action_start_duration: '開始時間点以降の時間帯をキャプチャ',
        action_start_end: '開始と終了の固定時間帯を削除',
        action_end_duration: '終了時間点前の時間帯をキャプチャ',
        duration_time: '期間',
        se_start: '開始期間',
        se_end: '終了期間',
        ed_end: '終了時間',
        select_field: '処理するビデオ添付列を選択してください',
        default_action: '編集モード',
        task_list: 'タスクリスト',
        grid_view: 'グリッドビューに切り替えてください',
        select_record:
          '変換するレコードを選択してください。選択されたレコードの添付ファイルフィールドがビデオ1つだけを含まない場合、そのレコードは以下のタスクリストに追加されません',
        task_status: 'ステータス',
        result_override: '出力が元のフィールドを上書き',
        result_new: '新しいフィールドに出力',
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
