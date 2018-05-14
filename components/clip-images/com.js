/**
 * img:object
 */
//overflow:hidden
import regeneratorRuntime from "../../libs/regenerator-runtime";
import { system } from "../../utils/index";
let imagedata = {}
Component({
  properties: {
    img:{
        type:Object,
        observer:"containerChange"
    }
  },
  data:{
  },
  ctx:null,
  methods: {
    move(event){
      let x = event.detail.x;
      let y = event.detail.y;
      for(let i = 0;i<40;i++ ){
        for(let j = 0;j<40;j++){
          // console.log(x+j*4+i*4*imagedata.width + 3)
          imagedata.data[x*4+j*4+(i+y)*4*imagedata.width + 3] = 255;
        }
      }
      wx.canvasPutImageData({
          canvasId: 'bottom-image',
          ...imagedata
      },this)
    },
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
            canvasId: 'bottom-image',
            success:function(res){
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