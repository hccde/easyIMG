Component({
  properties: {
   phone:{
     type:String,
     value:''
   },
   size:{
     type: String,
     value:'small'
   },
   disabled: {
     type: Boolean,
     value: false
   }
  },
  data: {},
  methods: {
    call(){
      if(this.properties.disabled){
        return;
      }
      wx.makePhoneCall({
        phoneNumber: this.properties.phone,
        success: ()=>{
          //todo
        },
        fail: ()=>{
          
        }
      });
    }
  }
})