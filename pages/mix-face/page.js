// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime')
import {Font} from '../../utils/index';

Page({
  async initCanvas(){
    const context = wx.createCanvasContext('mix-face');
    this.ctx = context;
    this.ctx.drawImage('/assets/face2.png',0,0,160,240);
    await this.draw();
    let res = await this.getImageData({width:160,height:240});
    if(res.success){
      res.context.data = this.processImage(res.context.data,160,240);
      await this.putImageData({
        x:0,
        y:0,
        width:160,
        height:240,
        data:res.context.data
      });
      this.ctx.drawImage('/assets/mask.png',0,0,160,240);
      this.draw(true);

    }
  },
  ctx:null,
  mostPix:-1, //人脸中最多的一个像素 决定了la
  onLoad: async function () {
    this.initCanvas();
    // new Font(this.ctx).normal();
  },
  processImage(data,width,height){
    let count = [];
    for(let p = 0;p<data.length;p=p+4){
      let row  = Math.floor(p / (width<<2))
      let col = ((p % (width<<2) ))>>2
      const r = data[p];
      const g = data[p+1];
      const b = data[p+2];
      let grey = r*0.3+g*0.59+b*0.11;
      let index = parseInt(grey);
      count[index]?count[index]+=1:count[index]=1;
      data[p] = grey;
      data[p+1] = grey;
      data[p+2] = grey;
    }
    let max = -1;
    let maxIndex = -1;
    for(let i = 0;i<count.length;i++){
      if(count[i]>max){
        max = count[i];
        maxIndex = i;
      }
    }
    this.mostPix = maxIndex;
    return this.LaplaceSharpen(data,width,height);
  },
  
  async draw(clear){
    await new Promise((reslove,reject)=>{
      this.ctx.draw(clear,function(){
        reslove()
      })
    })
  },
  async getImageData(obj){
    return await new Promise((reslove,reject)=>{
      wx.canvasGetImageData({
        x: 0,
        y: 0,
        width: obj.width,
        height:obj.height,
        canvasId: 'mix-face',
        success:function(res){
          reslove({
            success:true,
            context:res
          });
        },
        fail:function(err){
          reject({
            success:false,
            context:err
          })
        }
      });
    })
  },
  async putImageData(obj){
    await new Promise((reslove,reject)=>{
      wx.canvasPutImageData({
        canvasId:'mix-face',
        data:obj.data,
        x:obj.x,
        y:obj.y,
        width:obj.width,
        height:obj.height,
        success:function(){
          reslove({
            success:true
          })
        },
        fail:function(){
          reject({
            success:false,
            context:err
          })
        }
      })
    })
  },
  LaplaceSharpen(imagedata,width,height){
    let floatNum = (this.mostPix - 120 )/105
    console.log(floatNum,44)
    const mask = [
      [0, 1, 0],
      [1, -2-floatNum, 1],
      [0, 1, 0]
    ];
    let imgdata = new Uint8ClampedArray(width*height*4);
    height-=2;
    width-=2;
    for(let i = 0;i<height;i++){
      for(let j =0;j<width*4;j+=4){
        let sum = 0;
        for (let m = 0; m < 3; m++) {
          for (let n = 0; n < 3; n++) {
            sum += mask[m][n] * imagedata[(i+m)*width*4+j+n];
          }
        }
        imgdata[i*width*4+j] = sum;
        imgdata[i*width*4+j+1] = sum;
        imgdata[i*width*4+j+2] = sum;
        imgdata[i*width*4+j+3] = 255;
  
      }
    }
    return imgdata;
  }
})

// todo
// movable-view