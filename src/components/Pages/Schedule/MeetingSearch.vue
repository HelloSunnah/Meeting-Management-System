<template>
    <div class="flex flex-wrap justify-between gap-2 mb-4">
      <input v-model="searchTitle" placeholder="Search by Title" class="input-field w-full sm:w-auto mb-2 sm:mb-0" />
      <input v-model="searchClient" placeholder="Search by Client" class="input-field w-full sm:w-auto mb-2 sm:mb-0" />
      <input v-model="searchProject" placeholder="Search by Project" class="input-field w-full sm:w-auto mb-2 sm:mb-0" />
      <input v-model="searchDate" placeholder="Search by Date" class="input-field w-full sm:w-auto mb-2 sm:mb-0" />
      <input v-model="searchTime" placeholder="Search by Time" class="input-field w-full sm:w-auto mb-2 sm:mb-0" />
    </div>
  </template>
  
  <script>
  export default {
    props: ['searchTitle', 'searchClient', 'searchProject', 'searchDate', 'searchTime'],
    methods: {
      updateSearch() {
        this.$emit('updateSearch', {
          title: this.searchTitle,
          client: this.searchClient,
          project: this.searchProject,
          date: this.searchDate,
          time: this.searchTime
        });
      }
    },
    watch: {
      searchTitle() {
        this.updateSearch();
      },
      searchClient() {
        this.updateSearch();
      },
      searchProject() {
        this.updateSearch();
      },
      searchDate() {
        this.updateSearch();
      },
      searchTime() {
        this.updateSearch();
      }
    }
  };
  </script>
  