Component({
  properties: {
    listHour:Array,
    listMin:Array
  },
  methods: {
    onTap:function (event) {
      const key = event.currentTarget.dataset.key
      console.log(key)
    }
  }
})
