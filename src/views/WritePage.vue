<script setup>
import Navbar from "@/components/Navbar.vue";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { me, getRandomUsers, getFollowing } from "@/api/user/user.js";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { createPost } from '@/api/post/post.js'
import { uploadThumbnail} from '@/api/storage/storage.js'

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import Code from "@editorjs/code";
import Embed from "@editorjs/embed";
import Input from "@/components/ui/input/Input.vue";

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
const showLabel = ref(false);

const caption = ref("");    // Add this for caption
const tags = ref(['Apple', 'Banana']) // Add this for tags input
const thumbnail = ref("");  // Add this to hold the thumbnail URL or file
const thumbnailPreview = ref(''); // Store the preview URL


// Editor.js instance
const editor = ref(null);

// Title field for the blog post title
const title = ref("");

function checkTitleEmpty(event) {
  // Hide label only if textarea is empty
  showLabel.value = event.target.value.trim().length > 0;
}

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

function handleThumbnailChange(event) {
  const file = event.target.files[0]; // Get the file the user selected
  if (file) {
    thumbnail.value = file; // Store the file for uploading

    // Create a URL for the preview of the selected image
    const previewUrl = URL.createObjectURL(file);
    thumbnailPreview.value = previewUrl; // Set the preview URL
  }
}


// Save title and Editor.js contentimport { createPost } from './postapi';  // Import your API function for creating a post

async function saveContent() {
  try {
    // Ensure editor is initialized
    if (!editor.value) {
      throw new Error("Editor is not initialized.");
    }

    // Attempt to save content from the editor
    let editorData = "";
    try {
      editorData = await editor.value.save();
    } catch (editorError) {
      console.error("Error saving editor content:", editorError);
      throw new Error("Failed to save content from the editor.");
    }

    // Validate fields
    if (!title.value || !thumbnail.value || !tags.value || !caption.value) {
      throw new Error("All fields (title, thumbnail, tags, caption) are required.");
    }

    // Step 1: Upload the thumbnail (only if there's a file to upload)
    let thumbnailUrl = "";
    if (thumbnail.value) {
      console.log(thumbnail.value);
      // Assuming thumbnail is a file object
      const formData = new FormData();
      formData.append("file", thumbnail.value); // `thumbnail.value` should be the file object
      thumbnailUrl = await uploadThumbnail(formData); // Get the uploaded thumbnail URL
    }

    // Step 2: Prepare the post data
    const postData = {
      title: title.value,
      thumbnail: thumbnailUrl || "",  // Use the thumbnail URL returned from the upload
      tags: tags.value,
      caption: caption.value,
      content: editorData || "", // Default to empty string if editor content is empty
    };

    console.log("Post data to save:", postData);

    // Step 3: Save the post using the API
    const response = await createPost(postData); // Call createPost API function

    if (!response) {
      throw new Error("Failed to create post.");
    }

    console.log("Post created successfully!");
    // Redirect to homepage or show success message here
    window.location.href = "/";  // Redirect to homepage after successful creation
  } catch (error) {
    console.error("Error saving content:", error);
    alert(`There was an error saving your content: ${error.message}`);
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
      <div class="flex flex-col items-end justify-between pt-2 h-full" :class="{'invisible': !showLabel}">
        <!-- Title Label -->
        <label class="text-gray-600 font-semibold my-4 mb-auto">Title</label>
        
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
          @focus="showLabel = true"
          @blur="checkTitleEmpty"
          placeholder="Tell you story..."
          class="text-3xl font-bold text-gray-800 bg-transparent border-gray-300 focus:outline-none my-4"
        />
        <!-- Editor.js Container -->

        <div>
          <div 
          id="editorjs" 
        ></div>
        </div>
        

<!--        
        <Button @click="saveContent" class="mt-4 text-white px-4 py-2 rounded">
          Publish
        </Button>  -->

        <Dialog>
          <DialogTrigger as-child>
            <Button class="mt-4 text-white px-4 py-2 rounded">
              Publish
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Publish to the World!</DialogTitle>
              <DialogDescription>
                Are you sure you want to publish this content?
              </DialogDescription>
            </DialogHeader>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
              <!-- Column 1: Thumbnail Preview (Larger Space) -->
              <div class="sm:col-span-1">
                <label class="text-gray-600 font-semibold mb-2">Thumbnail</label>
                <Input type="file" @change="handleThumbnailChange" accept="image/*" />

                <!-- Thumbnail Preview -->
                <div v-if="thumbnailPreview">
                  <img :src="thumbnailPreview" alt="Thumbnail Preview" class="w-full h-64 object-contain rounded-lg" />
                </div>
              </div>

              <!-- Column 2: Caption and Tags -->
              <div class="sm:col-span-1">
                <!-- Tags Input -->
                <label class="text-gray-600 font-semibold my-2">Tags</label>
                <TagsInput v-model="tags">
                  <TagsInputItem v-for="item in tags" :key="item" :value="item">
                    <TagsInputItemText />
                    <TagsInputItemDelete />
                  </TagsInputItem>
                </TagsInput>

                <!-- Caption Input -->
                <label class="text-gray-600 font-semibold my-2">Caption</label>
                <Textarea 
                  v-model="caption"
                  placeholder="Enter a caption for the post"
                  class="border-gray-300 p-2 mb-4 w-full"
                ></Textarea>
              </div>
            </div>

            <DialogFooter class="sm:justify-end">
              <!-- Close Button -->
              <DialogClose as-child>
                <Button variant="secondary" class="mt-4 px-4 py-2 rounded">
                  Close
                </Button>
              </DialogClose>
              <!-- Confirm Publish Button -->
              <Button type="button" class="mt-4 text-white px-4 py-2 rounded" @click="saveContent">
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  </div>
</template>


