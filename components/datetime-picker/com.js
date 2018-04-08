import moment from '../../libs/moment'

const days = []
const hours = []
const minutes = []

Component({
  properties: {
    value: Number
  },
  data: {
    selected: [],
    range: []
  },
  attached: function () {
    for (let index = 0; index < 5; index++) {
      const day = moment().add(index, 'days')
      days.push({
        value: day,
        text: day.format('M月D日')
      })
    }

    for (let index = 0; index < 24; index++) {
      hours.push({
        value: index,
        text: index + '点'
      })
    }

    for (let index = 0; index < 12; index++) {
      const minute = index * 5
      minutes.push({
        value: minute,
        text: minute + '分'
      })
    }

    const value = this.properties.value
    // const selected = this.data.range.findIndex(item => item.amount === value)
    this.setData({
      range: [
        days,
        hours,
        minutes
      ],
      // selected
    })
  },
  methods: {
    onChange: function (e) {
      const value = e.detail.value
      const day = days[value[0]].value
      const hour = hours[value[1]].value
      const minute = minutes[value[2]].value
      const datetime = day.add({
        hours: hour,
        minutes: minute
      })
      console.log('datetime:', datetime)
      this.triggerEvent('change', {
        value: datetime.valueOf()
      })
    }
  }
})
