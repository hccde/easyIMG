/**
 * img:object
 */
//overflow:hidden
import regeneratorRuntime from "../../libs/regenerator-runtime";
import { system } from "../../utils/index";
import wxapi from '../../libs/wx-api-promise/index';

Component({
  properties: {
    image:{
      type:Object,
      value:{
        path:'',
        width:'',
        height:''
      },
      observer:"imageChange"      
    },
  },
  data:{
    context:null,
    screenWidth:system.screenWidth,
    screenHeight:system.screenHeight,
    width:system.screenWidth-20,
  },
  methods: {
    imageChange(newval,oldval){

    },
    getContext(){
      if(this.data.context){
          return this.data.context
      }else{
          const context = wx.createCanvasContext('mask-canvas',this);                
          this.setData({
              context
          })
          return context;
      }
  },
  move(e){
    console.log(e.detail.x,e.detail.y);
    this.setData({
      x:-e.detail.x,
      y:-e.detail.y
    })
  },
  scale(e){

  }
  },
  ready(){
    let context = this.data.context;
    if(!this.data.context){
      context = this.getContext();
    }
    context.fillStyle = 'rgba(0,0,0,0.5)';
    context.fillRect(0, 0, system.screenWidth*2, system.screenHeight*2);
    context.draw(this)
  }
})