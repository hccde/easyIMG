Component({
  options: {
    multipleSlots: true
  },
  properties: {
    list: {
      type: Array,
      default: []
    },
    active: {
      type: Number,
      default: 0
    }
  },
  data: {},
  methods: {
    toggle(event) {
      const key = event.currentTarget.dataset.key
      this.triggerEvent('change', {
        key
      })
    }
  }
})