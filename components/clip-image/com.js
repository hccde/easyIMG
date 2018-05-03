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
        height:'',
        base64:"111"
      },
      observer:"imageChange"      
    },
  },
  data:{
    context:null,
    screenWidth:system.screenWidth,
    screenHeight:system.screenHeight,
    width:system.screenWidth-20,
    scaleNum:1,
    widthReal:system.screenWidth,
    heightReal:system.screenHeight,
    x:-100,
    y:-100
  },
  methods: {
    imageChange(newval,oldval){
        console.log(newval,22);
        this.setData({
            widthReal:newval.width,
            heightReal:newval.height
        })
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
    // console.log(e.detail.x,e.detail.y);
    this.setData({
      x:e.detail.x-100,
      y:e.detail.y-100
    })
  },
  scale(e){
    let scaleNum = e.detail.scale
    this.setData({
        scaleNum:scaleNum,
        widthReal:this.properties.image.width*scaleNum,
        heightReal:this.properties.image.height*scaleNum,
    })
  }
  },
  ready(){

  }
})