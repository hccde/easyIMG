Component({
  properties: {
    available: Number,
    used: Number
  },
  data: {
    list: []
  },
  attached: function () {
    const {available, used} = this.data
    const list = []
    for (let index = 0; index < available; index++) {
      list.push('available')
    }
    for (let index = 0; index < used; index++) {
      list.push('used')
    }

    this.setData({
      list: list
    })
  }
})
