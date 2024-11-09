<script setup>
import Navbar from "@/components/Navbar.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { me, getRandomUsers, getFollowing } from "@/api/user/user.js";
import { Button } from '@/components/ui/button';

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import Code from "@editorjs/code";
import Embed from "@editorjs/embed";

// User, following, and peeps data
const user = ref({
  id: "",
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});
const following = ref([]);
const peeps = ref([]);

// Editor.js instance
const editor = ref(null);

// Title field for the blog post title
const title = ref("");

// Initialize Editor.js
onMounted(() => {
  editor.value = new EditorJS({
    holder: 'editorjs',
    placeholder: "Tell your story...",
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: 'Add a heading here',
          levels: [1, 2],
          defaultLevel: 1
        },
      },
      image: {
        class: Image,
        config: {
          endpoints: {
            byFile: "your_image_upload_url", // replace with your upload URL
          },
        },
      },
      code: Code,
      embed: {
        class: Embed,
        config: {
          services: {
            youtube: true,
            vimeo: true,
          },
        },
      },
    },
    data: {},
  });

  // Fetch user, following, and peeps data
  getUserData();
});

// Fetch user, following, and peeps data
async function getUserData() {
  try {
    following.value = await getFollowing();
    user.value = await me();
    peeps.value = await getRandomUsers();
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Save title and Editor.js content
async function saveContent() {
  try {
    const editorData = await editor.value.save();
    const postData = {
      title: title.value,
      content: editorData,
    };
    console.log("Post data to save:", postData);
    // Perform API call to save `postData` to the backend if needed
  } catch (error) {
    console.error("Error saving content:", error);
    alert("There was an error saving your content.");
  }
}

// Clean up Editor.js on component unmount
onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>


<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />

  <!-- Main layout with Editor.js -->
  <div class="container lg:max-w-6xl lg:mx-auto py-10 px-6 md:px-8">
    <div class="grid grid-cols-[75px_auto] gap-4 items-start">
      <!-- Title Label Column -->
      <!-- Left Column: Title Label and Publish Button -->
      <div class="flex flex-col items-end justify-between pt-2 h-full">
        <!-- Title Label -->
        <label class="text-gray-600 font-semibold mb-auto">Title</label>
        
        <!-- Publish Button aligned to last text block
        <Button @click="saveContent" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Publish
        </Button> -->
      </div>

      <!-- Editor.js Column -->
      <div class="flex flex-col w-full">

        <input
          v-model="title"
          type="text"
          placeholder="Tell you story..."
          class="rounded px-4 py-2 text-lg font-semibold w-full"
        />
        <!-- Editor.js Container -->

        <div>
          <div 
          id="editorjs" 
        ></div>
        </div>
        

        <!-- Save Button
        <Button @click="saveContent" class="mt-4 text-white px-4 py-2 rounded">
          Publish
        </Button> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Adjust the padding and max-width of Editor.js blocks */
.ce-block__content,
.ce-toolbar__content {
  max-width: unset;
}


</style>
