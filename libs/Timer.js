export default class Timer {
  constructor (props) {
    this.timer = null;
    this.onElapsed = props.onElapsed;
    this.interval = props.interval;
  }

  start () {
    if (this.timer) {
      return;
    }

    const self = this;

    const once = function () {
      return new Promise(function (resolve, reject) {
        const res = self.onElapsed(self);
        if (res instanceof Promise) {
          res.then(resolve, reject);
        }
        else {
          resolve();
        }
      });
    };

    const next = function () {
      self.timer = setTimeout(function () {
        once().then(function () {
          // 已被stop
          if (!self.timer)
            return;
          next();
        });
      }, self.interval);
    };

    // 避免第一次执行时报错，导致使用者页面流程中断
    setTimeout(function () {
      once().then(next);
    }, 0);
  }

  stop () {
    if (!this.timer) {
      return;
    }

    clearTimeout(this.timer);
    this.timer = null;
  }
}
