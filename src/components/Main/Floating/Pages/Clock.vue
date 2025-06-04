<template>
    <div class="clock">
      <ul class="clock__marks"></ul>
      <div class="clock__hands">
        <div class="clock__hand clock__hand--hour"></div>
        <div class="clock__hand clock__hand--minute"></div>
        <div class="clock__hand clock__hand--second"></div>
      </div>
    </div>
  </template>
  
  <script>import apiEndpoints from '@/config/apiConfig';

  export default {
    data() {
      return {
        radius: 6, // Radius for the clock ticks
        second: 0,
        minute: 0,
        hour: 0,
        interval: 1000, // Interval for clock update (1 second)
      };
    },
    mounted() {
      this.initializeClock();
      this.startClock();
    },
    methods: {
      initializeClock() {
        // Append the clock marks
        for (let i = 0; i < 60; i++) {
          this.$el.querySelector('.clock__marks').insertAdjacentHTML('beforeend', '<li></li>');
        }
  
        // Get current time
        const currentTime = new Date();
        this.second = currentTime.getSeconds() * this.radius;
        this.minute = currentTime.getMinutes() * this.radius + Math.floor(this.second / (this.radius * 10) * 10) / 10;
        this.hour = currentTime.getHours() * this.radius * 5 + Math.floor(this.minute / (this.radius * 2) * 10) / 10;
  
        this.setClockHands();
      },
      startClock() {
        let before = new Date();
        setInterval(() => {
          const now = new Date();
          const elapsedTime = now.getTime() - before.getTime();
          const delay = Math.round(elapsedTime / this.interval);
  
          this.second += this.radius * delay;
  
          for (let i = 0; i < delay; i++) {
            if (((this.second - i) * this.radius) % (this.radius * 5) === 0) {
              this.minute += 0.5;
              if (this.minute % this.radius === 0) {
                this.hour += 0.5;
              }
            }
          }
  
          this.setClockHands();
          before = new Date();
        }, this.interval);
      },
      setClockHands() {
        const secondElm = this.$el.querySelector('.clock__hand--second');
        const minuteElm = this.$el.querySelector('.clock__hand--minute');
        const hourElm = this.$el.querySelector('.clock__hand--hour');
  
        secondElm.style.transform = `rotate(${this.second}deg)`;
        minuteElm.style.transform = `rotate(${this.minute}deg)`;
        hourElm.style.transform = `rotate(${this.hour}deg)`;
      }
    }
  };
  </script>
  <style scoped>
* {
  backface-visibility: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.clock {
  font-family: "Droid Serif", serif;
  display: inline-block;
  width: 30px; /* Even smaller */
  height: 
  30px;
  border: 2px solid #000;
  border-radius: 100%;
  position: relative;
  background: linear-gradient(to bottom right, #e3e3e3, #fff);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4) inset;
}

.clock__marks {
  list-style: none;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

.clock__marks li {
  display: block;
  position: absolute;
}

.clock__marks li:before {
  content: "";
  display: block;
  width: 1px;
  height: 2px;
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
}

.clock__hands {
  width: 5px;
  height: 5px;
  border-radius: 100%;
  background: #6c5116;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -2.5px;
  margin-top: -2.5px;
  transform: rotate(180deg);
}

.clock__hand {
  transform-origin: top center;
  background: #000;
  position: absolute;
  top: 2.5px;
  transition: transform 0.2s;
}

.clock__hand--hour {
  width: 3px;
  height: 8px;
  left: 1.5px;
}

.clock__hand--minute {
  width: 1.5px;
  height: 10px;
  left: 1.75px;
}

.clock__hand--second {
  width: 1px;
  height: 15px;
  left: 2px;
  background-color: red;
}
</style>
