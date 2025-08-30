<template>
  <section class="bg-gray-50 p-6 rounded-2xl shadow space-y-6 w-full">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-semibold text-gray-700">Attachments</h3>
      <button type="button" @click="$emit('add-attachment')" class="text-green-600 hover:text-green-800 text-2xl"> <i class="fa-solid fa-square-plus"></i>
      </button>
    </div>
    <div v-for="(attachment, index) in attachments":key="index"class="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 w-full">
      <button
        v-if="attachments.length > 1"type="button" @click="$emit('remove-attachment', index)" class="text-red-500 hover:text-red-700 text-xl shrink-0"title="Remove Attachment">
        <i class="fa-solid fa-circle-minus"></i>
      </button>
      <input type="text"v-model="attachments[index].title"placeholder="Attachment Title" :class="['text-sm px-3 py-2 border border-gray-300 rounded flex-1', inputClass]"  />
      <input type="file" @change="event => $emit('file-upload', event, index)":class="['text-sm px-3 py-2 border border-gray-300 rounded flex-1', inputClass]" />
    </div>
  </section>
</template>
<script>
export default {
  name: 'AttachmentList',
  props: {
    attachments: {
      type: Array,
      required: true
    },
    inputClass: {
      type: String,
      default: ''
    }
  }
};
</script>
