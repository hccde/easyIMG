const regeneratorRuntime = require('../../libs/regenerator-runtime')
import wxapi from '../../libs/wx-api-promise/index';

Component({
    properties: {
    },

    methods: {
        async upload() {
            let res = await wxapi.chooseImage({
                count: 1,
                // sizeType: ['original', 'compressed'],
                sizeType: ['original'],
                sourceType: ['album', 'camera'],
            });
            if (res.success) {
                let tempFilePaths = res.res.tempFilePaths;
                const r = await wxapi.getImageInfo({
                    src:tempFilePaths[0]
                });
                if(!r.success){
                    wx.toast({
                        title:"获取图片信息失败"
                    });
                    return;
                }
                this.triggerEvent('change', {
                    ...r.res
                });
            }
        }
    }
})