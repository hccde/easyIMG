Component({
    properties: {
    },
    
    methods: {
        upload(){
            wx.chooseImage({
                count: 1,
                // sizeType: ['original', 'compressed'],
                sizeType: ['original'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                  let tempFilePaths = res.tempFilePaths;
                  this.triggerEvent('change',{
                      url:tempFilePaths[0]
                  });
                },
                fail:function(){
                    wx.toast({
                        title:"上传失败"
                    })
                }
              })
        }
    }
  })