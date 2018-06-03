const regeneratorRuntime = require('../../libs/regenerator-runtime')
import wxapi from '../../libs/wx-api-promise/index';
let width =  350;
let height = 370;
let cut = {};
let id = 'cropper'
import WeCropper from './cropper';

Page({
    data:{
        width:width,
        height:height,
        cut:{
            x: (width - 200) / 2, // 裁剪框x轴起点
            y: (width - 200) / 2, // 裁剪框y轴期起点
            width: width, // 裁剪框宽度
            height: height // 裁剪框高度
          },
          id:'cropper'
        },
    onLoad(){

    },
    onReady(){
    },
      touchStart (e) {
        this.wecropper.touchStart(e)
      },
      touchMove (e) {
        this.wecropper.touchMove(e)
      },
      touchEnd (e) {
        this.wecropper.touchEnd(e)
      },
      uploadTap () {
        const self = this
  
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success (res) {
            const src = res.tempFilePaths[0]
  
            self.wecropper.pushOrign(src)
          }
        })
      },
      getCropperImage () {
        this.wecropper.getCropperImage((src) => {
          if (src) {
            wx.previewImage({
              current: '', // 当前显示图片的http链接
              urls: [src] // 需要预览的图片http链接列表
            })
          } else {
            console.log('获取图片地址失败，请稍后重试')
          }
        })
       },
    onLoad() {
      cut = this.data.cut;
      width = this.data.width;
      height = this.data.height;
      id = this.data.id;
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
        })
    }
})