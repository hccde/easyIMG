const regeneratorRuntime = require('../../libs/regenerator-runtime')
import wxapi from '../../libs/wx-api-promise/index';
let width =  350;
let height = 370;
Page({
    data:{
        img:{
            path:'/assets/test3.jpg',
            width:533,
            height:300,
        },
        width:width,
        height:height,
        cut:{
            x: (width - 200) / 2, // 裁剪框x轴起点
            y: (width - 200) / 2, // 裁剪框y轴期起点
            width: width, // 裁剪框宽度
            height: height // 裁剪框高度
          },
        container:{
            path: '/assets/test3.jpg',
            width: 533,
            height: 300
        },
        items:[{
            path: '/assets/test.jpg',
            width: 30,
            height: 30,
            x:0,
            y:0
        },{
            path: '/assets/test.jpg',
            width: 30,
            height: 30,
            x:60,
            y:60
        }]
    },
    imagedata:'',
    onLoad(){

    },
    onReady(){
        // this.drawImg('/assets/test.jpg',0,300);
    },
    drawImg(url,begin=0,size=600){
        const context = wx.createCanvasContext('canvas');
        context.drawImage(url, begin, begin, size, size)
        // context.drawImage('/assets/test2.jpg', 20, 20, size, size)
        context.draw(false,function(){
            // wx.canvasGetImageData({
            //     canvasId: 'canvas',
            //     x: 0,
            //     y: 0,
            //     width: 300,
            //     height: 300,
            //     success(res) {
            //      console.log(res,22)
            //     }
            //   })
        })
    },
    getImageData(e){
        this.imagedata = e.detail;
        console.log('get image data',e.detail);
    },
    canvasIdErrorCallback(e) {
        //dont support canvas
        console.error(e.detail.errMsg)
    },
    uploadImg(e){
        let url = e.detail.path;
        this.setData({
            img:e.detail
        })
    }
})