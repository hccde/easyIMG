import moment from '../../libs/moment'

Component({
  properties: {
    value: String
  },
  data: {
    text: ''
  },
  attached: function () {
    const mo = moment(this.properties.value)
    const text = mo.format('MM月DD日 HH:mm')

    this.setData({
      text: text
    })
  }
})
