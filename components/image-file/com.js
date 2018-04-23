Component({
    properties: {
        src:{
            type:String,
            value: null
        }
    },
    methods: {
        load(e){
            console.log(e)
            // wx.getImageInfo({
            //     src:'/assets/test.jpg',
            //     success:function({path}){
            //         console.log(path);
            //     }
            // });
            wx.downloadFile({
                url:'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png',
                success:function(res){
                    console.log(res)
                    const context = wx.createCanvasContext('img-canvas');
                    context.drawImage(res.tempFilePath,0, 0, 150, 100);
                },
                fail:function(err){
                    console.log(err);
                }
            })
        },
        error(e){
            console.log('err',e)
        }
    }
  })