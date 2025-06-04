export default {
    computed: {
        buttonPositionClass() {
          return this.$store.state.sidebarPosition;
        },
    
        inputClass() {
          return this.theme7 === 'bg-gray-900 text-white'
            ? 'bg-gray-700 text-white border-gray-600'
            : 'bg-white text-gray-800 border-gray-300';
        },
        theme1() {
          return this.$store.state.theme === 'dark' ? 'bg-gray-100 text-gray-900 custom-scrollbar' : 'bg-gray-900 text-gray-100 custom-scrollbar';
        },
        theme2() {
          return this.$store.state.theme === 'dark' ? "bg-gray-200 text-gray-800 custom-scrollbar" : "bg-gray-800 text-gray-200 custom-scrollbar";
        },
        theme3() {
          return this.$store.state.theme === 'dark' ? "bg-gray-300 text-gray-700 custom-scrollbar" : "bg-gray-700 text-gray-300 custom-scrollbar";
        },
        theme4() {
          return this.$store.state.theme === 'dark' ? "bg-gray-400 text-gray-600 custom-scrollbar" : "bg-gray-600 text-gray-400 custom-scrollbar";
        },
        theme5() {
          return this.$store.state.theme === 'dark' ? "bg-gray-500 text-gray-100" : "bg-gray-500 text-gray-100";
        },
        theme6() {
          return this.$store.state.theme === 'dark' ? "bg-gray-600 text-gray-50" : "bg-gray-400 text-gray-900";
        },
        theme7() {
          return this.$store.state.theme === 'dark' ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-gray-700";
        },
        theme8() {
            return this.$store.state.theme === 'dark' ? "bg-gray-800 text-gray-200" : "bg-gray-200 text-gray-700";
          }, 
        theme9() {
            return this.$store.state.theme === 'dark' ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900";
          },
        themeText(){
          return this.$store.state.theme === 'dark' ? 'text-white' : 'text-gray-800';
    
        },
          filteredMeetings() {
            return this.meetings.filter(meeting =>
              String(meeting.title || "").toLowerCase().includes(this.searchTitle.toLowerCase())
            );
          },
          paginatedMeetings() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            return this.filteredMeetings.slice(start, start + this.itemsPerPage);
          },
          totalPages() {
            return Math.ceil(this.filteredMeetings.length / this.itemsPerPage);
          },
          inputClass() {
            return "input-field w-full border border-gray-300 rounded-md px-3 py-2 text-sm";
          },
          labelClass() {
            return "text-sm font-medium text-gray-700";
          },
        filteredAgendas() {
          return this.agendas.filter(agenda =>
            agenda.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
            agenda.description.toLowerCase().includes(this.searchDescription.toLowerCase()) &&
            agenda.remarks.toLowerCase().includes(this.searchRemarks.toLowerCase()) &&
            agenda.agendaType.toLowerCase().includes(this.searchAgendaType.toLowerCase())
          );
        },
        totalPages() {
          return Math.ceil(this.filteredAgendas.length / this.itemsPerPage);
        },
        paginatedAgendas() {
          const start = (this.currentPage - 1) * this.itemsPerPage;
          return this.filteredAgendas.slice(start, start + this.itemsPerPage);
        }
      },
  };
  