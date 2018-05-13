/**
 * img:object
 */
//overflow:hidden
import regeneratorRuntime from "../../libs/regenerator-runtime";
import { system } from "../../utils/index";
Component({
  properties: {
    img:{
        type:Object,
        observer:"containerChange"
    }
  },
  data:{
  },
  methods: {
    containerChange(){
        console.log(1)
        this.drawImage();
    },
    drawImage() {
        let info = this.properties.img;
        if (!info.path) {
          return;
        }
        info.width = info.width //rpx;
        info.height = info.height
        if(!this.ctx){
          let context = wx.createCanvasContext('bottom-image', this);
          this.ctx = context
        }
        this.ctx.drawImage(info.path, 0, 0, info.width, info.height);
        let that = this;
        this.ctx.draw(false, function(){ //wx bug attetion
            console.log(222)
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
  },
  ready(){

  }
})