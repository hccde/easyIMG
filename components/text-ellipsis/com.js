const ellipsis = '...'

Component({
  properties: {
    value: String,
    max: Number
  },
  data: {
    text: ''
  },
  attached: function () {
    let text = ''
    const {value, max} = this.properties
    if (value.length <= max) {
      text = value
    } else {
      text = value.substr(0, max - ellipsis.length) + '...'
    }
    this.setData({
      text: text
    })
  }
})
