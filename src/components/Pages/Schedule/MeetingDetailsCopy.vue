    async submitMeeting() {
      if (this.roomConflict) {
        alert("⚠️ Cannot submit: Room is already booked during this time.");
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("_method", "PUT");
        const fields = {
          ...this.meeting,
          start_time:
            this.meeting.start_time.length === 5
              ? this.meeting.start_time + ":00"
              : this.meeting.start_time,
          end_time:
            this.meeting.end_time.length === 5
              ? this.meeting.end_time + ":00"
              : this.meeting.end_time,
          company_id: "1",
          status: "1",
          meeting_status: this.meeting.meeting_status || "1",
        };
        Object.entries(fields).forEach(([key, value]) => {
          formData.append(key, value);
        });
        this.meeting.attachments.forEach((att, index) => {
          if (!this.removedAttachments.includes(att.id)) {
            formData.append("existing_attachments[]", att.id);
            formData.append(
              "existing_attachment_titles[]",
              att.attachment_title || ""
            );
            if (att.new_file) {
              formData.append(
                `existing_attachment_files[${index}]`,
                att.new_file
              );
            }
          }
        });
        if (this.removedAttachments.length > 0) {
          this.removedAttachments.forEach((id) => {
            formData.append("removed_attachments[]", id);
          });
        }
        let hasNewAttachments = false;
        this.newAttachments.forEach((attachment, index) => {
          if (attachment.file) {
            hasNewAttachments = true;
            formData.append(`attachments[${index}]`, attachment.file);
            formData.append(`attachment_title[${index}]`, attachment.title);
          }
        });
        if (!hasNewAttachments) {
          formData.append("attachments[]", "");
        }
        const existing = this.existingParticipantIds.filter(
          (id) => !this.removedParticipantIds.includes(id)
        );
        const newParticipants = this.selectedParticpants.map((p) => p.id);
        [...existing, ...newParticipants].forEach((id) => {
          formData.append("participants[]", id);
        });
       
           this.OtherParticipants.forEach((op, index) => {
          if (op.id) {
            formData.append(`other_participants[${index}][id]`, op.id);
            formData.append(`other_participants[${index}][other_participant_name]`, op.other_participant_name);
          } else {
            formData.append(`other_participants[${index}][other_participant_name]`, op.other_participant_name);
          }
        });
        await axios.post(
          apiEndpoints.updateMeeting(this.meeting.id),
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        alert("Meeting updated successfully.");
        this.$router.push("/meeting/schedule");
      }


      catch (err) {
        console.error("Submit failed:", err);
        alert("Failed to update the meeting.");
      }
    },