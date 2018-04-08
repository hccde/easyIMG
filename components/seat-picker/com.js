Component({
  properties: {
    value: Number
  },
  data: {
    selected: -1,
    range: [
      {
        value: 1,
        text: '1人'
      },
      {
        value: 2,
        text: '2人'
      },
      {
        value: 3,
        text: '3人'
      },
      {
        value: 4,
        text: '4人'
      }
    ]
  },
  attached: function () {
    const value = this.properties.value
    const selected = this.data.range.findIndex(item => item.value === value)
    this.setData({
      selected: selected
    })
  },
  methods: {
    onChange: function (e) {
      this.triggerEvent('change', {
        value: this.data.range[e.detail.value].value
      })
    }
  }
})
