<template>
    <div class="col-span-full">
      <label class="text-sm font-semibold mb-2 block">Attachments:</label>
      <div class="flex gap-4 flex-wrap mb-4">
        <template v-for="(attachment, index) in attachments" :key="attachment.id">
          <div class="flex flex-col items-center space-y-2">
            <img v-if="isImage(attachment.attachment_path)" 
             :src="generateApiUrl(attachment.attachment_path)"
                 :alt="attachment.attachment_title"
                 class="w-24 h-24 object-cover rounded shadow-md border border-gray-200" />
            <span class="text-xs text-blue-700 text-center">{{ attachment.attachment_title || 'Untitled' }}</span>
          </div>
        </template>
      </div>
      <div class="space-y-4">
        <button type="button" @click="addAttachmentField" class="text-green-600 hover:text-green-700 text-sm font-semibold transition">
          + Add More
        </button>
        <div v-for="(attachment, index) in newAttachments" :key="index" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-end gap-4">
            <div class="w-full sm:w-5/12">
              <label class="text-sm font-medium text-gray-600 mb-1 block">Attachment Title</label>
              <input type="text" v-model="attachment.title" class="input-field" placeholder="Attachment title" />
            </div>
            <div class="w-full sm:w-5/12">
              <label class="text-sm font-medium text-gray-600 mb-1 block">Upload File</label>
              <input type="file" @change="handleFileUpload($event, index)" class="input-field" />
            </div>
            <div class="w-full sm:w-2/12 flex justify-end items-center">
              <button v-if="newAttachments.length > 1" type="button" @click="removeAttachment(index)"
                      class="text-red-500 hover:text-red-700 text-xl transition duration-300" title="Remove Attachment">
                <i class="fa-solid fa-circle-minus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      attachments: Array,
      newAttachments: Array,
    },
    methods: {
      isImage(path) {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(path);
      },  
   // Helper function to generate the full URL based on the attachment filename
    generateApiUrl(attachment) {
      return `${apiEndpoints.storageUrl}${attachment}`;
    },
    
      addAttachmentField() {
        this.newAttachments.push({ file: null, title: "" });
        this.$emit('add');
      },
      removeAttachment(index) {
        this.newAttachments.splice(index, 1);
        this.$emit('remove', index);
      },
      handleFileUpload(event, index) {
        const file = event.target.files[0];
        if (file) this.newAttachments[index].file = file;
        this.$emit('upload', event, index);
      },
    },
  };
  </script>
  