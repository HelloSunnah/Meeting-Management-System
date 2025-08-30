<template>
    <div :class="theme7" class="min-h-screen p-4 sm:p-6 bg-gray-100 transition-all duration-300 ease-in-out">
        <div :class="theme81" class="w-full max-w-3xl mx-auto rounded-lg shadow-2xl p-6 sm:p-8">
            <div class="flex items-center mb-8 space-x-6">
                <img :src="getImageUrl(profile.image_url)" alt="Profile Image"
                    class="w-36 h-36 object-cover rounded-full shadow-md border border-gray-300" />
                <div>
                    <h2 class="text-4xl font-semibold text-gray-800" :class="themeText">{{ profile.name }}</h2>
                    <p class="text-xl text-gray-600" :class="themeText">{{ profile.email }}</p>
                    <p class="text-gray-700 mt-2" :class="themeText"><strong>Company:</strong> {{ profile.company_name
                    }}</p>
                    <p class="text-gray-700" :class="themeText"><strong>Department:</strong> {{ profile.department_name
                    }}</p>
                </div>
            </div>


            <form @submit.prevent="updateProfile" class="space-y-6">
                <div>
                    <label :class="themeText" class="block font-medium text-gray-700 mb-1">Name</label>
                    <input :class="themeInputText" type="text" v-model="form.name" required
                        class="w-full px-4 py-3 border rounded-md focus:ring-2 ring-blue-400" />
                </div>
                <div>
                    <label class="block font-medium text-gray-700 mb-1" :class="themeText">Current Password
                        <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <input :class="themeInputText" :type="showCurrentPassword ? 'text' : 'password'"
                            v-model="form.currentPassword" required
                            class="w-full px-4 py-3 border rounded-md pr-12 focus:ring-2 ring-blue-400" />
                        <button type="button" @click="showCurrentPassword = !showCurrentPassword"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <span v-if="showCurrentPassword">👁️</span>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block font-medium text-gray-700 mb-1" :class="themeText">New Password</label>
                    <div class="relative">
                        <input :class="themeInputText" :type="showNewPassword ? 'text' : 'password'"
                            v-model="form.newPassword"
                            class="w-full px-4 py-3 border rounded-md pr-12 focus:ring-2 ring-blue-400" />
                        <button type="button" @click="showNewPassword = !showNewPassword"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <span v-if="showNewPassword">👁️</span>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block font-medium text-gray-700 mb-1" :class="themeText">Confirm Password</label>
                    <div class="relative">
                        <input :class="themeInputText" :type="showConfirmPassword ? 'text' : 'password'"
                            v-model="form.confirmPassword"
                            class="w-full px-4 py-3 border rounded-md pr-12 focus:ring-2 ring-blue-400" />
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <span v-if="showConfirmPassword">👁️</span>
                        </button>
                    </div>
                </div>
                <div>
                    <label class="block font-medium text-gray-700 mb-1" :class="themeText">Profile Image</label>
                    <input :class="themeInputText" type="file" @change="handleFileUpload('image', $event)"
                        class="w-full px-4 py-3 border rounded-md" />
                    <p v-if="imageError" class="text-red-500 text-sm mt-1">{{ imageError }}</p>
                </div>
                <div>
                    <label class="block font-medium text-gray-700 mb-1" :class="themeText">Signature</label>
                    <input :class="themeInputText" type="file" @change="handleFileUpload('signature', $event)"
                        class="w-full px-4 py-3 border rounded-md" />
                    <p v-if="signatureError" class="text-red-500 text-sm mt-1">{{ signatureError }}</p>
                    <div v-if="profile.signature_url" class="mt-2">
                        <img :src="getImageUrl(profile.signature_url)" alt="Signature Preview"
                            class="w-36 h-36 object-cover shadow-md border" />
                    </div>
                </div>
                <button type="submit" :disabled="isSubmitDisabled"
                    class="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-md hover:shadow-md">
                    Update Profile
                </button>

                <p v-if="errorMessage" class="text-center text-red-500 mt-4">{{ errorMessage }}</p>
                <p v-if="successMessage" class="text-center text-green-600 mt-4">{{ successMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import apiEndpoints from '@/config/apiConfig';
import axios from 'axios';
import useTheme from '@/components/js/ThemeSetting';
import { useToast } from "vue-toastification";

export default {
    setup() {
        const {
            theme6,
            theme8, theme61,
            theme9, theme81,
            themeText, theme7,
            themeInputText,
        } = useTheme();

        const toast = useToast();

        return {
            theme61,
            theme6,
            theme8, theme7,
            theme9, theme81,
            themeText,
            toast, themeInputText
        };
    },
    data() {
        return {
            profile: {
                id: '',
                name: '',
                email: '',
                company_name: '',
                department_name: '',
                designation_name: '',
                image_url: '',
                signature_url: '',
                created_at: '',
                updated_at: '',
                isSubmitDisabled: false,

            },
            form: {
                name: '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                image: null,
                signature: null
            },
            loading: false,
            errorMessage: '',
            successMessage: '',
            imageError: '', showCurrentPassword: false,
            showNewPassword: false,
            showConfirmPassword: false,
            signatureError: '',
            defaultImage: 'path/to/default/image.png'
        };
    },

    async mounted() {
        await this.fetchProfile();
    },

    methods: {
        async fetchProfile() {
            try {
                const userId = sessionStorage.getItem('user_id');
                const { data } = await axios.get(`${apiEndpoints.fetchUser(userId)}`);
                this.profile = data;
                this.form.name = data.name;
            } catch (error) {
                this.errorMessage = 'Failed to load profile.';
            }
        },

        async updateProfile() {
            this.clearMessages();

            if (!this.form.currentPassword) {
                this.toast.success("Current password is required!")
                return;
            }

            if (this.form.newPassword && this.form.newPassword !== this.form.confirmPassword) {
                this.errorMessage = 'New password and confirm password do not match.';
                return;
            }

            if (this.loading) return;

            try {
                this.loading = true;
                const userId = sessionStorage.getItem('user_id');
                const formData = new FormData();

                formData.append('name', this.form.name);
                formData.append('current_password', this.form.currentPassword);
                formData.append('password_confirmation', this.form.confirmPassword);
                if (this.form.newPassword) formData.append('password', this.form.newPassword);
                if (this.form.image) formData.append('image', this.form.image);
                if (this.form.signature) formData.append('signature', this.form.signature);
                formData.append('_method', 'PUT');

                const { data } = await axios.post(
                    `${apiEndpoints.updateProfile(userId)}`,

                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                this.profile = data;
                this.toast.success("Profile updated successfully!")
                this.resetForm();
                await this.fetchProfile(); // refresh profile
            }
            catch (error) {
                if (error.response?.data) {
                    let errors = error.response.data;

                    // Parse if errors is a string (JSON string)
                    if (typeof errors === 'string') {
                        try {
                            errors = JSON.parse(errors);
                        } catch (e) {
                            this.toast.error(errors);
                            this.errors.general = errors;
                            return;
                        }
                    }

                    this.errors = errors;

                    // Show each error message in toast
                    Object.values(errors).forEach(messages => {
                        if (Array.isArray(messages)) {
                            messages.forEach(msg => this.toast.error(msg));
                        } else {
                            this.toast.error(messages);
                        }
                    });
                }
            }
        },
        handleFileUpload(field, event) {
            const file = event.target.files[0];
            if (!file) return;

            const maxSize = 2 * 1024 * 1024; // 2MB

            if (file.size > maxSize) {
                const errorMsg = 'Image must be under 2MB.';
                if (field === 'image') {
                    this.imageError = errorMsg;
                }
                if (field === 'signature') {
                    this.signatureError = errorMsg;
                }

                this.isSubmitDisabled = true;
                this.toast.error("Image must be under 2MB.");
                return;
            }

            // Valid file
            if (field === 'image') {
                this.imageError = '';
                this.form.image = file;
            } else if (field === 'signature') {
                this.signatureError = '';
                this.form.signature = file;
            }

            // Enable the submit button if there are no file size errors
            this.isSubmitDisabled = !!this.imageError || !!this.signatureError;
        },

        resetForm() {
            this.form.currentPassword = '';
            this.form.newPassword = '';
            this.form.confirmPassword = '';
            this.form.image = null;
            this.form.signature = null;
        },

        clearMessages() {
            this.errorMessage = '';
            this.successMessage = '';
            this.imageError = '';
            this.signatureError = '';
        },

        getImageUrl(url) {
            return url ? `${apiEndpoints.storageUrl2}/${url}` : this.defaultImage;
        },

        formatDate(date) {
            if (!date) return '';
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(date).toLocaleDateString(undefined, options);
        }
    }
};
</script>
