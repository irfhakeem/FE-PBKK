<script setup>
import Navbar from "@/components/Navbar.vue";
import { computed, ref, onMounted, onBeforeUnmount } from "vue";
import { me, getRandomUsers, getFollowing } from "@/api/user/user.js";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  TagsInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/components/ui/tags-input";

import { getAllTags } from "@/api/tag/tag.js"; // Importing the fetchTags API function
import { createPost } from "@/api/post/post.js";
import { uploadThumbnail } from "@/api/storage/storage.js";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Code from "@editorjs/code";
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

const caption = ref(""); // Add this for caption

const tags = ref([]); // Will hold the fetched tags
const selectedTags = ref([]); // This will hold the tags selected by the user

const thumbnail = ref(""); // Add this to hold the thumbnail URL or file
const thumbnailPreview = ref(""); // Store the preview URL

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
  getData();

  editor.value = new EditorJS({
    holder: "editorjs",
    placeholder: "Tell your story...",
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: "Add a heading here",
          levels: [1],
          defaultLevel: 1,
          inlineToolbar: ["bold"],
        },
      },
      code: Code,
    },
    data: {},
  });
});

// Fetch user, following, and peeps data
async function getData() {
  try {
    following.value = await getFollowing();
    user.value = await me();
    peeps.value = await getRandomUsers();
    tags.value = await getAllTags();
    console.log("Tags data:", tags.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

// Fetch tags data from the API

function handleThumbnailChange(event) {
  const file = event.target.files[0]; // Get the file the user selected
  if (file) {
    thumbnail.value = file; // Store the file for uploading

    // Create a URL for the preview of the selected image
    const previewUrl = URL.createObjectURL(file);
    thumbnailPreview.value = previewUrl; // Set the preview URL
  }
}

// Save title and Editor.js content
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
    if (
      !title.value ||
      !thumbnail.value ||
      !tags.value.length ||
      !caption.value
    ) {
      throw new Error(
        "All fields (title, thumbnail, tags, caption) are required."
      );
    }

    // Step 1: Upload the thumbnail (only if there's a file to upload)
    let thumbnailUrl = "";
    if (thumbnail.value) {
      console.log(thumbnail.value);
      thumbnailUrl = await uploadThumbnail(thumbnail.value); // Get the uploaded thumbnail URL
    }
    // console.log(title.value);
    // console.log(editorData);
    // console.log(imageUrl);
    console.log(tags.value.map((tag) => tag.id));
    // console.log(caption.value);
    // Step 2: Prepare the post data
    const postData = {
      title: title.value,
      content: editorData || "", // Default to empty string if editor content is empty
      caption: caption.value,
      thumbnail: thumbnailUrl || "", // Use the thumbnail URL returned from the upload
      tags: tags.value.map((tag) => tag.id), // Get the selected tag ids
    };

    console.log("Post data to save:", postData);

    // Step 3: Save the post using the API
    const response = await createPost(postData); // Call createPost API function

    if (!response) {
      throw new Error("Failed to create post.");
    }

    console.log("Post created successfully!");
    // Redirect to homepage or show success message here
    window.location.href = "/home"; // Redirect to homepage after successful creation
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

function removeTag(tagToRemove) {
  // Use the `filter` method to remove the selected tag by id
  tags.value = tags.value.filter((tag) => tag.id !== tagToRemove.id);
}

function autoResize(event) {
  event.target.style.height = "auto"; // Reset height to auto
  event.target.style.height = `${event.target.scrollHeight}px`; // Set height based on scroll height
}
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />

  <!-- Main layout with Editor.js -->
  <div class="sm:max-w-6xl sm:mx-auto py-6 px-6 md:px-8">
    <div class="flex flex-col gap-4 items-start w-full">
      <!-- Title Input -->
      <div
        :class="{ invisible: !showLabel }"
        class="flex items-center justify-start"
      >
        <label class="text-gray-600 font-semibold mb-auto">Title</label>
      </div>

      <div class="flex flex-col lg:flex-row items-center w-full">
        <textarea
          v-model="title"
          @focus="showLabel = true"
          @blur="checkTitleEmpty"
          placeholder="Tell your story..."
          maxlength="75"
          class="text-xl sm:text-3xl font-bold text-gray-800 bg-transparent focus:outline-none w-full resize-none overflow-hidden"
          rows="1"
          @input="autoResize"
        ></textarea>
      </div>

      <!-- Editor.js container -->
      <div id="editorjs" class="w-full"></div>

      <div class="flex justify-end items-center w-full">
        <Dialog class="">
          <DialogTrigger as-child>
            <Button class="text-white px-4 py-2 rounded cursor-pointer">
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

            <div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 gap-2 my-4">
              <!-- Column 1: Thumbnail Preview (Larger Space) -->
              <div class="sm:col-span-1">
                <div class="flex flex-col gap-2">
                  <label class="text-gray-600 font-semibold">Thumbnail</label>
                  <Input
                    type="file"
                    @change="handleThumbnailChange"
                    accept="image/*"
                  />

                  <!-- Thumbnail Preview -->
                  <div v-if="thumbnailPreview">
                    <img
                      :src="thumbnailPreview"
                      alt="Thumbnail Preview"
                      class="w-full h-64 object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <!-- Column 2: Caption and Tags -->
              <div class="sm:col-span-1">
                <div class="flex flex-col gap-2">
                  <!-- Tags Input -->
                  <label class="text-gray-600 font-semibold">Tags</label>
                  <!-- Tags Input -->
                  <TagsInput v-model="tags">
                    <TagsInputItem
                      v-for="tag in tags"
                      :key="tag.id"
                      :value="tag.name"
                    >
                      <TagsInputItemText>{{ tag }}</TagsInputItemText>
                      <TagsInputItemDelete @click="removeTag(tag)" />
                    </TagsInputItem>
                  </TagsInput>

                  <!-- Caption Input -->
                  <label class="text-gray-600 font-semibold">Caption</label>
                  <Textarea
                    v-model="caption"
                    placeholder="Enter a caption for the post"
                    class="border-gray-300 p-2 mb-4 w-full resize-none"
                    maxlength="150"
                  ></Textarea>
                </div>
              </div>
            </div>

            <DialogFooter class="flex flex-row gap-2 justify-end">
              <!-- Close Button -->
              <DialogClose as-child>
                <Button
                  variant="secondary"
                  class="cursor-pointer px-4 py-2 rounded"
                >
                  Close
                </Button>
              </DialogClose>
              <!-- Confirm Publish Button -->
              <Button
                type="button"
                class="cursor-pointer text-white px-4 py-2 rounded"
                @click="saveContent"
              >
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<style>
/* Atur ukuran dan ketebalan header */
#editorjs h1 {
  font-size: 1.125rem; /* Ukuran lebih besar untuk header */
  font-weight: bold; /* Membuat teks tebal */
}

/* Paragraf lebih kecil untuk membedakan */
#editorjs p {
  font-size: 1rem;
  line-height: 1.6;
}

#editorjs .codex-editor__redactor {
  padding: 0 !important;
}

#editorjs .ce-block__content {
  width: 100% !important;
}
</style>
