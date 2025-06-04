<template>
    <div :class="[align === 'right' ? 'flex justify-end text-right' : 'flex justify-start text-left']"
         class="mb-4 items-center">
      <nav class="text-md font-semibold text-gray-700 mb-2">
        <template v-for="(item, index) in items" :key="index">
          <span
            :class="themeText"
            class="cursor-pointer hover:text-blue-500"
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
        required: true, // Expecting array like [{ label: "Home", clickable: true }, ...]
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
  