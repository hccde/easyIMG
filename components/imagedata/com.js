/**
 * img:object
 */
import regeneratorRuntime from "../../libs/regenerator-runtime";
import wxapi from '../../libs/wx-api-promise/index';
Component({
  properties: {
    img: {
      type: Object,
      value: {},
      observer: "drawImage"
    },
  },
  ctx: null,
  methods: {
    drawImage() {
      let info = this.properties.img;
      if (!info.path) {
        return;
      }
      info.width = info.width*2 //rpx;
      info.height = info.height*2
      if(!this.ctx){
        let context = wx.createCanvasContext('imagedata-canvas', this);
        this.ctx = context
      }
      this.ctx.drawImage(info.path, 0, 0, info.width, info.height);
      let that = this;
      this.ctx.draw(false, function(){ //wx bug attetion
        wx.canvasGetImageData({
          x: 0,
          y: 0,
          width: info.width,
          height:info.height,
          canvasId: 'imagedata-canvas',
          success:function(res){
            that.triggerEvent('change',{
              ...res,
              path:that.properties.img.path
            })
          },
          fail:function(err){
            console.log(err)
          }
        },that);
      });
    },
    canvasError(e){
      console.log('canvas err',e)
    }
  }
})