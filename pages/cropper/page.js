const regeneratorRuntime = require('../../libs/regenerator-runtime')
import wxapi from '../../libs/wx-api-promise/index';
let width = '',height = '',cut = {},id = 'cropper',cropperWidth = 200;
import store from '../../store/index';
import WeCropper from './cropper';

Page({
  data: {
    width: width,
    height: height,
    cut: {},
    id: id
  },
  onReady() {
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]

        self.wecropper.pushOrign(src)
      }
    })
  },
  getCropperImage() {
    this.wecropper.getCropperImage((src) => {
      if (src) {
        console.log(src);
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  async onLoad() {
   let systemInfo =  await store.getSystem();
    this.data.width = systemInfo.windowWidth;
    this.data.height = systemInfo.windowHeight;
    this.data.cut =  {
      x: (this.data.width - cropperWidth) / 2, // 裁剪框x轴起点
      y: (this.data.height - cropperWidth) / 2, // 裁剪框y轴期起点
      width: cropperWidth, // 裁剪框宽度
      height: cropperWidth // 裁剪框高度
    };
    this.setData({
      ...this.data
    },()=>{
      this.wecropper = new WeCropper(this.data)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context: ${ctx}`)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context: ${ctx}`)
        console.log(ctx)
        wx.hideToast()
      });
      this.wecropper.pushOrign('https://www.baidu.com/img/bd_logo1.png?where=super')
    })
  }
})