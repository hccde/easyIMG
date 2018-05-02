import { system } from '../../utils/index';
import { span } from '../../conf/index';
//container width > screenwidht/2 todo
Component({
    properties: {
        container: {
           type:Object,
           value:{
            path: '/assets/test3.jpg',
            width: 33,
            height: 30
           },
           observer:"containerChange"
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
            }],
            observer:"itemsChange"
        }
    },
    data:{
        context:null,
        _container:{},
        _items:[]
    },
    methods: {
        draw(){
            this.data.context.drawImage(this.data.container.path, 0, 0, this.data.container.width, this.data.container.height,this);
            this.data.items.forEach((e)=>{
                this.data.context.drawImage(e.path, e.x, e.y, e.width, e.height,this);
            });
            this.data.context.draw(false,function(){
                console.log('merge ok ')
                // wx.canvasGetImageData({
                //     canvasId: 'canvas-merge',
                //     x: 0,
                //     y: 0,
                //     width: 300,
                //     height: 300,
                //     success(res) {
                //      console.log(res,22)
                //     }
                //   })
            },this)
        },
        containerChange(newval,oldval){
            const context = this.getContext();
            this.setData({
                _container:newval
            },()=>{
                context.clearRect(0,0,newval.width,newval.height);
                this.draw();
            })
        },
        itemsChange(newval,oldval){
            const context = this.getContext();
            context.clearRect(0,0,this.data.container.width,this.data.container.height);
            this.setData({
                _items:newval
            },()=>{
                this.draw()                
            })
        },
        getContext(){
            if(this.data.context){
                return this.data.context
            }else{
                const context = wx.createCanvasContext('canvas-merge',this);                
                this.setData({
                    context
                })
                return context;
            }
        }
    }
})