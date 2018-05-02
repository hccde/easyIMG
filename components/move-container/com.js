import { system } from '../../utils/index';
import { span } from '../../conf/index';
//container width > screenwidht/2 todo
Component({
    properties: {
        container: {
           type:Object,
           value:{
            path: '/assets/test3.jpg',
            width: 533,
            height: 300
           },
           observer:"conImageChange"
        },
        items:{
            type:Array,
            value:[{
                path: '',
                width: 60,
                height: 60,
                x: 0,
                y: 0
            }, {
                path: '',
                width: 60,
                height: 60,
                x: 60,
                y: 60
            }]
        }
    },
    data:{
        scaleNum:1,
        containerWidth:0,
        containerHeight:0,
        system:system
    },
    methods: {
        scale(e){
            let index = e.target.dataset.index;
            let el = this.properties.items[index];
            let scaleNum = e.detail.scale;
            this.triggerEvent('scale',{
                el,
                index,
                scaleNum
            })
            console.log('scale',e);           
        },
        move(e){
            let index = e.target.dataset.index;
            let el = this.properties.items[index];
            el.x =e.detail.x;
            el.y = e.detail.y;
            this.triggerEvent('move',{
                el,
                index,
                x:e.detail.x,
                y:e.detail.y
            })
            console.log('move',e)
        },
        conImageChange(newval,oldval){
            const imageWidth = newval.width / this.data.system.pixelRatio;
            const imageHeight = newval.height / this.data.system.pixelRatio;
            const scaleNum = imageWidth / (this.data.system.screenWidth - span);
            console.log(scaleNum,44,imageWidth / scaleNum)
            this.setData({
                scaleNum:scaleNum,
                containerWidth:imageWidth / scaleNum,
                containerHeight:imageHeight / scaleNum
            })
        }
    }
})