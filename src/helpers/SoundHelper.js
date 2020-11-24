

var throttle = function throttle(fn, delay) {
    var lastCall = 0;
    return function () {
      var now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn.apply(undefined, arguments);
    };
};

var validateUrl = function(asset) {
    if (!asset) throw new Error("Invalid resource")
    return asset;
}

function SoundHelper({ asset, throttle=1000, volume=.5 }) {
    this.asset = validateUrl(asset);
    this.volume = volume;
    this.play = () => {
        const audioElement = new Audio(this.asset);
        audioElement.play().then().catch(console.log)
    }
}

export default SoundHelper;