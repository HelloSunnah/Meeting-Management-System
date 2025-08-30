<template>
  <div class="fixed top-0 left-0 w-full z-30 bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg h-16 flex items-center px-4">
    <div v-if="marqueeStarted" class="marquee-track animate-marquee">
      <span v-if="runningMeeting" class="marquee-item running-meeting flex items-center gap-2">
        <i class="fas fa-video text-green-400"></i>
        <span class="truncate">
          The meeting titled <strong>{{ runningMeeting.title }}</strong> is currently in progress...
        </span>
      </span>
      <span v-for="(meeting, index) in upcomingMeetings" :key="index"
            class="marquee-item upcoming-meeting flex items-center gap-2">
        <i class="fas fa-clock text-yellow-400"></i>
        The next meeting is at {{ formatTime(meeting.start_time) }} in <strong>{{ meeting.location_name }}</strong> — <strong>{{ meeting.title }}</strong>
      </span>
      
      <span v-if="!runningMeeting && !upcomingMeetings.length"
            class="marquee-item no-meeting flex items-center gap-2">
        <i class="fas fa-calendar-times text-red-400"></i>
        No meetings scheduled at the moment.
      </span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  props: {
    loading: { type: Boolean, required: true },
    runningMeeting: { type: Object, required: false },
    upcomingMeetings: { type: Array, required: true },
    formatTime: { type: Function, required: true }
  },
  setup() {
    const marqueeStarted = ref(false);

    onMounted(() => {
      setTimeout(() => {
        marqueeStarted.value = true; // start showing the marquee after 10 seconds
      }, 100);
    });

    return { marqueeStarted };
  }
};
</script>

<style>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.marquee-track {
  display: inline-flex;
  white-space: nowrap;
  gap: 4rem;
  will-change: transform;
}

.animate-marquee {
  animation: marquee 80s linear infinite; /* make scrolling very slow */
}

.marquee-item {
  padding: 0.5rem 1rem;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.running-meeting {
  color: white;
  border-bottom: 2px solid #34d399;
}

.upcoming-meeting {
  color: #fef08a;
}

.no-meeting {
  color: #f87171;
  font-weight: bold;
}
</style>
