<template>
  <div
    :class="[
      align === 'right'
        ? 'flex justify-end text-right'
        : 'flex justify-start text-left',
      'mb-4 items-center'
    ]"
  >
    <nav
      :class="['text-md font-semibold mb-2', themeText]"
    >
      <template v-for="(item, index) in items" :key="index">
        <span
          :class="[themeText, 'cursor-pointer hover:text-blue-500']"
          v-if="item.clickable"
          @click="item.onClick"
        >
          {{ $t(item.label) }}
        </span>
        <span :class="themeText" v-else>
          {{ $t(item.label) }}
        </span>
        <span v-if="index < items.length - 1" class="mx-2">/</span>
      </template>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    align: {
      type: String,
      default: "left",
    },
    themeText: {
      type: String,
      default: "",
    },
  },
};
</script>
