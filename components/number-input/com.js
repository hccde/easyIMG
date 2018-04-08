Component({
  properties: {
    value: String,
    length: Number
  },
  data: {
    list: [],
    focus: true
  },
  attached: function () {
    const list = []
    const length = this.properties.length
    for (let index = 0; index < length; index++) {
      list.push(index)
    }
    this.setData({
      list: list
    })
  },
  methods: {
    onTap: function (e) {
      const length = this.properties.length
      const {value} = this.data;
      this.setData({
        focus: value.length < length
      })
    },
    onInput: function (e) {
      const length = this.properties.length
      const {value} = e.detail
      const focus =  value.length < length
      const newvalue = value.substr(0, length)
      this.setData({
        value: newvalue,
        focus: focus
      })
      this.triggerEvent('change', {
        value: newvalue
      })
    }
  }
})
