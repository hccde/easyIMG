Component({
    properties: {
        container: {
           type:Object,
           value:{
            path: '/assets/test3.jpg',
            width: 533*2,
            height: 300*2
           }
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
    methods: {
        scale(e){
            let index = e.target.dataset.index;
            let el = this.properties.items[index];
            let scaleNUm = e.detail.scale;
            console.log('scale',e);            
        },
        move(e){
            let index = e.target.dataset.index;
            let el = this.properties.items[index];
            el.x =e.detail.x;
            el.y = e.detail.y;
            console.log('move',e)
        }
    }
})