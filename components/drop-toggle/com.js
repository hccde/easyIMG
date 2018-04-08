Component({
    options: {
        multipleSlots: true
    },
    properties: {
        open: Boolean
    },
    methods: {
        onDropClick() {
            this.triggerEvent('change');
        }
    }
});

