Component({
  properties: {
    value: String,
    placeholder: String,
    type: String,
    focus: Boolean
  },
  methods: {
    onInput: function (e) {
      this.triggerEvent('change', {
        value: e.detail.value
      })
    },
    onTapClear: function (e) {
      this.triggerEvent('change', {
        value: ''
      })
    }
  }
})
