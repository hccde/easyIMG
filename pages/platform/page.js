Page({
    data:{

    },
    onLoad(){
        console.log('onload')
    },
    onReady(){
        const context = wx.createCanvasContext('canvas');
        console.log(context)
    },
    canvasIdErrorCallback(e) {
        //dont support canvas
        console.error(e.detail.errMsg)
    },
})