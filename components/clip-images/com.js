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
      
    },
    containerChange(){
        console.log(1)
        this.drawImage();
    },
    drawImage() {
        if(!this.ctx){
          let context = wx.createCanvasContext('bottom-image', this);
          this.ctx = context
        }
        this.ctx.setFillStyle('red')
        this.ctx.fillRect(0, 0, 50, 50)

        let that = this;
        this.ctx.draw(false, function(){ //wx bug attetion
          wx.canvasGetImageData({
            x: 0,
            y: 0,
            width: 50,
            height: 50,
            canvasId: 'bottom-image',
            success:function(res){
              console.log(res);
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