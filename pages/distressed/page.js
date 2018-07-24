// 【重要】名称不能修改
const regeneratorRuntime = require('../../libs/regenerator-runtime')
Page({
  data:{
    src:''
  },
  width:395,
  height:395,
  async initCanvas(){
    const context = wx.createCanvasContext('distressed');
    this.ctx = context;
    this.ctx.drawImage('/assets/timg.jpeg',0,0,395,395);
    await this.draw();
    let res = await this.getImageData({width:395,height:395});
    if(res.success){
      new Array(40).fill(1).map(()=>{
        this.processImage(res.context.data,395)
      })
      await this.putImageData({
        x:0,
        y:0,
        width:395,
        height:395,
        data:res.context.data
      });
      this.waterFlow(new Array(50).fill({text:'大葱哥'}))
    }
  },
  ctx:null,
  onLoad: async function () {
    this.initCanvas();
  },
  async draw(clear){
    await new Promise((reslove,reject)=>{
      this.ctx.draw(clear,function(){
        reslove()
      })
    })
  },
  processImage(data,width){
    for(let p = 0;p<data.length;p=p+4){
      let row  = Math.floor(p / (width<<2))%8
      let col = ((p % (width<<2) )%(32))>>2
      const r = data[p];
      const g = data[p+1];
      const b = data[p+2];
      let y = (  77*r + 150*g +  29*b) >> 8;
      let u = clampuv(((-43*r -  85*g + 128*b) >> 8) - 1);
      let v = clampuv(((128*r - 107*g -  21*b) >> 8) - 1);
      [y,u,v] = quantification(y,u,v,col,row);
      const r1 = clamp((65536*y           + 91881*v) >> 16);
      const g1 = clamp((65536*y - 22553*u - 46802*v) >> 16);
      const b1 = clamp((65536*y + 116130*u         ) >> 16);
      data[p] = r1;
      data[p+1] = g1;
      data[p+2] = b1;
    }
  },
  fillText(obj){
    this.ctx.setFillStyle('#dbdbdb')
    this.ctx.setFontSize(obj.fontSize)
    this.ctx.fillText(obj.text,obj.x, obj.y);
  },
  waterFlow(arr,mode='small'){
    const width = this.width;
    const height = this.height;
    arr.map((e,index)=>{
      const wr = Math.random();
      const hr = Math.random();
      const x = width-e.text.length*14-index*wr*5;
      const y = height-6-index*hr*3
      if(index>10)
        index/=10
      if(wr>0.5){
        if(wr>0.8)
          this.ctx.drawImage('/assets/baidu.png',x-20,y-14,20,20);
        else
          this.ctx.drawImage('/assets/weibo.png',x-20,y-14,20,20);
      }
      this.fillText({
        x:x,
        y:y,
        fontSize:12,
        text:'@大葱哥'
      });
    })
    this.ctx.draw(true);
  },
  async getImageData(obj){
    return await new Promise((reslove,reject)=>{
      wx.canvasGetImageData({
        x: 0,
        y: 0,
        width: obj.width,
        height:obj.height,
        canvasId: 'distressed',
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
  async canvasToImage(obj){
    // let quality = obj.quality==='small'?0.01:(obj.quality==='middle'?0.05:0.1)
    return await new Promise((reslove,reject)=>{
      wx.canvasToTempFilePath({
        canvasId: 'distressed',
        fileType:'jpg',
        // quality:0.05,
        success: function(res) {
          reslove({
            success:true,
            content:res
          })
        },
        fail:function(err){
          reject({
            success:false,
            content:err
          })
        }
      })
    })
  },
  async putImageData(obj){
    await new Promise((reslove,reject)=>{
      wx.canvasPutImageData({
        canvasId:'distressed',
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
  }
})

const clamp = x => x >= 0 ? x <= 255 ? x : 255 : 0;
const clampuv = x => x >= -128 ? x <= 127 ? x : 127 : -128;
function quantification(y,u,v,col,row){
  const yArray = [
    [16,11,10,16,,24,40,51,61],
    [12,12,14,19,26,58,60,55],
    [14,13,16,24,40,57,69,56],
    [14,17,22,29,51,87,80,62],
    [18,22,37,56,68,109,103,77],
    [24,35,55,64,81,104,113,92],
    [49,64,78,87,103,121,120,101],
    [72,92,95,98,112,100,103,99],
  ];
  const uvArray = [
    [17,18,24,47,99,99,99,99],
    [18,21,26,66,99,99,99,99],
    [24,26,56,99,99,99,99,99],
    [99,99,99,99,99,99,99,99],
    [99,99,99,99,99,99,99,99],
    [99,99,99,99,99,99,99,99],
    [99,99,99,99,99,99,99,99],
    [99,99,99,99,99,99,99,99],
  ]
  let yy = Math.round(y/uvArray[row][col])*uvArray[row][col];
  return [yy,u,v]
}