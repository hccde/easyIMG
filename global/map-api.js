const QQMapWX = require('../libs/qqmap-wx-jssdk.js')
import key from '../conf/qqmap'
let qqmapsdk = null;

export default () => {
  console.log('key:', key)
  if (!qqmapsdk){
    qqmapsdk = new QQMapWX({
      key: key
    })
  }

  return qqmapsdk
}
