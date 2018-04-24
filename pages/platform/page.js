Page({
    data:{

    },
    onLoad(){
        console.log('onload')
    },
    onReady(){
        const context = wx.createCanvasContext('canvas');
        context.drawImage('https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png', 0, 0, 300, 300)
        context.draw(false,function(){
            wx.canvasGetImageData({
                canvasId: 'canvas',
                x: 0,
                y: 0,
                width: 300,
                height: 300,
                success(res) {
                 console.log(res,22)
                }
              })
        })
        console.log(context)
    },
    canvasIdErrorCallback(e) {
        //dont support canvas
        console.error(e.detail.errMsg)
    },
})