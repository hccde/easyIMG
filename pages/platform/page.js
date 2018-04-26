const regeneratorRuntime = require('../../libs/regenerator-runtime')
import wxapi from '../../libs/wx-api-promise/index';

Page({
    data:{
        img:{}
    },
    imagedata:'',
    onLoad(){

    },
    onReady(){
        this.drawImg('/assets/test.jpg',0,300);
    },
    drawImg(url,begin=0,size=300){
        const context = wx.createCanvasContext('canvas');
        context.drawImage(url, begin, begin, size, size)
        context.drawImage('/assets/test2.jpg', 20, 20, size, size)
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