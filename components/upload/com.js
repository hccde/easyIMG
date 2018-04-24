Component({
    properties: {
        src:{
            type:String,
            value: null
        }
    },
    methods: {
        load(e){
        },
        error(e){
            console.log('err',e)
        }
    }
  })