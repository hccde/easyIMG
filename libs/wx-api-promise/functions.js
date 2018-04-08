module.exports = [
  // 网络-发起请求
  'request',
  // 网络-上传下载
  'uploadFile',
  'downloadFile',

  // 网络-websocket
  'connectSocket',
  'sendSocketMessage',
  'closeSocket',

  // 媒体-图片
  'chooseImage',
  'previewImage',
  'getImageInfo',
  'saveImageToPhotosAlbum',

  // 媒体-录音
  'startRecord',
  'stopRecord',

  // 媒体-音频播放控制
  'playVoice',
  'pauseVoice',
  'stopVoice',

  // todo

  'getLocation',
  'getStorage',
  'getSystemInfo',
  'getUserInfo',
  'login',
  'setStorage',
  'getNetworkType',
  'showToast',
  'showModal',
  'showLoading',
  'openSetting'
];
