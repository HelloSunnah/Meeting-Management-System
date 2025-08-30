<template>
  <div class="w-full shadow-md rounded-xl bg-white border border-gray-200 p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold text-gray-800">Attachments</h2>
      <button type="button" @click="addAttachmentField"
        class="text-green-600 hover:text-green-700 text-2xl p-1 rounded-full hover:bg-gray-200">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <div v-for="(attachment, index) in newAttachments" :key="'new-' + index" class="flex gap-4 items-end">
      <div class="flex-1">
        <input type="text" v-model="attachment.title"
          class="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Attachment Title" />
      </div>
      <div class="flex-1">
        <input type="file" @change="handleNewFileUpload($event, index)"
          class="w-full px-4 py-3 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
      </div>
      <button v-if="newAttachments.length > 1" @click="removeNewAttachment(index)"
        class="text-red-500 hover:text-red-700 text-xl">
        <i class="fa-solid fa-minus-circle"></i>
      </button>
    </div>
    <hr class="my-6" />
    <h2 class="text-xl font-bold text-gray-800 mb-4">Existing Attachments</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="(attachment, index) in attachments" :key="attachment.id"
        class="border p-4 rounded-lg shadow-sm bg-white hover:shadow-xl transition-all">
        <div class="h-32 flex items-center justify-center bg-gray-100 rounded">
          <template v-if="isImage(attachment.attachment_path)">
            <a :href="generateApiUrl(attachment.attachment_path)" target="_blank">
              <img :src="generateApiUrl(attachment.attachment_path)" alt="Attachment" class="object-contain max-h-32" />
            </a>
          </template>
          <template v-else-if="isPDF(attachment.attachment_path)">
            <a :href="generateApiUrl(attachment.attachment_path)" target="_blank">
              <i class="fa fa-file-pdf text-4xl text-red-600"></i>
            </a>
          </template>
          <template v-else>
            <i class="fa fa-file text-4xl text-gray-500"></i>
          </template>
        </div>
        <div class="mt-2 text-sm font-semibold text-gray-700">
          <input type="text" v-model="attachment.attachment_title" class="w-full border rounded-md px-2 py-1"
            placeholder="Attachment Title" />
        </div>
        <div class="flex items-center gap-2 mt-3">
          <button @click="removeExistingAttachment(index)" class="text-red-600 hover:text-red-800 text-sm">
            <i class="fa-solid fa-trash mr-1"></i> Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiEndpoints from "@/config/apiConfig";

export default {
  props: {
    attachments: Array,
    newAttachments: Array,
    removedAttachments: Array,
  },
  methods: {
    addAttachmentField() {
      this.newAttachments.push({ file: null, title: "" });
    },
    removeNewAttachment(index) {
      this.newAttachments.splice(index, 1);
    },
    removeExistingAttachment(index) {
      const removed = this.attachments.splice(index, 1)[0];
      if (removed?.id) {
        this.removedAttachments.push(removed.id);
      }
    },
    handleNewFileUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;
      if (this.validateFile(file)) {
        this.newAttachments[index].file = file;
      }
    },
    validateFile(file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        this.toast.success("Only JPG, PNG, or PDF files are allowed.");
        return false;
      }
      if (file.size > maxSize) {
        this.toast.error("File size should not exceed 5MB.");
        return false;
      }
      return true;
    },
    isImage(path) {
      return /\.(jpe?g|png|gif|bmp|webp)$/i.test(path);
    },
    isPDF(path) {
      return /\.pdf$/i.test(path);
    },
    generateApiUrl(path) {
      return `${apiEndpoints.storageUrl2}${path}`;
    },
  },
};
</script>
