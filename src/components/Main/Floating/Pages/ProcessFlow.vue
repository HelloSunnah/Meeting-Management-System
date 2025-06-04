<template>
        <FloatingButtons />

  <div :class="themeClass" class="min-h-screen w-full flex p-8 justify-center items-center">
<img src="@/assets/img/erp.png" alt="">
  </div>
</template>

<script>import FloatingButtons from "@/components/Main/Floating/FloatingButton.vue";

export default {
  components: {
    FloatingButtons},}

</script>
