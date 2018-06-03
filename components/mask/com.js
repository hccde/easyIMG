/**
 * img:object
 */
//overflow:hidden
import regeneratorRuntime from "../../libs/regenerator-runtime";
import { system } from "../../utils/index";
let imagedata = {}
Component({
  properties: {
    img: {
      type: Object,
      observer: "containerChange"
    }
  },
  data: {
  },
  ctx: null,
  methods: {
    move(event) {
      let x = event.detail.x;
      let y = event.detail.y;
      console.log(event, 33)
    },
    move(e) {
      console.log(22);
      this.triggerEvent('change', e, { bubbles: true, composed: true })
    },
    containerChange() {
      console.log(1)
      this.drawImage();
    }
  },
  ready() {

  }
})