/**
 * img:object
 */
//overflow:hidden
import regeneratorRuntime from "../../libs/regenerator-runtime";
import { system } from "../../utils/index";
let cut = {}
let width = 300, height = 300, id = "";
import WeCropper from "./cropper";

Component({
  properties: {
    id: {
      type:String,
      value:'cropper'
    },
    width: Number,
    height: Number,
    cut: Object
  },
  data: {
  },
  ready() {

  },
  methods:{
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
     }

  },
  attached() {
    cut = this.properties.cut;
    width = this.properties.width;
    height = this.properties.height;
    id = this.properties.id;
    console.log(this.properties.id, 33)
    this.wecropper = new WeCropper(this.properties)
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