<script setup>
import Navbar from "@/components/Navbar.vue";
import { me, getRandomUsers, getFollowing } from "@/api/user/user.js";
import { Input } from "@/components/ui/input"
import { ref, onMounted, watch } from "vue";
import { Textarea } from '@/components/ui/textarea'

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
const textAreas = ref([""]);
const focusStates = ref([]);

function checkTitleEmpty(event) {
  // Hide label only if textarea is empty
  showLabel.value = event.target.value.trim().length > 0;
}

// Function to adjust the height of the textarea dynamically
function adjustHeight(index) {
  const textarea = document.querySelector(`#textarea-${index}`);
  if (textarea) {
    textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
  }
}

// Function to check if the textarea is empty and handle backspace behavior
function checkTextEmpty(index) {
  const value = textAreas.value[index]?.trim() || ""; // Safely access the value
  return value.length === 0; // Return true if empty
}

// Handle backspace and enter behavior
function handleKeyDown(event, index) {
  const isEmpty = checkTextEmpty(index); // Check if the current textarea is empty

  // Handle backspace case
  if (event.key === 'Backspace' && isEmpty) {
    if (index > 0) {
      // Merge current text to the previous textarea and remove the current one
      textAreas.value[index - 1] += textAreas.value[index]; // Append current value to the previous one
      textAreas.value.splice(index, 1); // Remove the empty textarea

      // Focus on the previous textarea
      setTimeout(() => {
        const previousTextarea = document.querySelector(`#textarea-${index - 1}`);
        if (previousTextarea) {
          previousTextarea.focus(); // Focus on the previous textarea
          adjustHeight(index - 1); // Adjust height of the previous textarea
        }
      }, 0);
    }
  }

  // Handle enter case
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent default enter behavior (like adding a new line)
    
    const currentTextarea = document.querySelector(`#textarea-${index}`);
    const cursorPosition = currentTextarea.selectionStart; // Get the cursor position
    const currentText = textAreas.value[index]; // Get the current textarea's text

    if (currentText.trim() !== "") {
      // Split the current text into two parts
      const newText = currentText.slice(cursorPosition); // Get text after cursor
      textAreas.value[index] = currentText.slice(0, cursorPosition); // Keep text before cursor

      // Insert a new empty textarea after the current one
      textAreas.value.splice(index + 1, 0, newText); // Insert new text after current textarea

      // Use a timeout to ensure the DOM updates before focusing
      setTimeout(() => {
        const newTextarea = document.querySelector(`#textarea-${index + 1}`);
        if (newTextarea) {
          newTextarea.focus(); // Focus on the new textarea
          adjustHeight(index + 1); // Adjust height of the new textarea
        }
      }, 0);
    }
  }
}

onMounted(async () => {
  following.value = await getFollowing();
  user.value = await me();
  peeps.value = await getRandomUsers();
});


</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />

  <!-- Main layout with grid for responsiveness -->
  <div class="container lg:max-w-6xl lg:mx-auto py-10 px-6 md:px-8">
    <!-- Title input with fixed width columns -->
    <div class="grid grid-cols-[150px_auto] gap-4 items-start">
      <!-- Left Label Column with fixed width (shown or hidden) -->
      <div class="flex items-center justify-end pt-2" :class="{'invisible': !showLabel}">
        <label class="text-gray-600 font-semibold">Title</label>
      </div>

      <!-- Right Input Column with fixed width -->
      <div class="flex flex-col w-full">
        <input
          @focus="showLabel = true"
          @blur="checkTitleEmpty"
          type="text"
          placeholder="Tell your story..."
          class="text-3xl font-bold text-gray-800 bg-transparent border-gray-300 focus:outline-none mb-4"
        />

        <!-- Render each textarea in the textAreas array -->
        <div v-for="(textArea, index) in textAreas" :key="index" class="relative mb-4">
          <textarea
            :id="`textarea-${index}`"
            v-model="textAreas[index]"
            @input="adjustHeight(index)" 
            @keydown="handleKeyDown($event, index)"
            @focus="focusStates[index] = true" 
            @blur="focusStates[index] = false" 
            placeholder="..."
            class="text-lg text-gray-600 bg-transparent border-gray-300 focus:outline-none focus:border-gray-500 w-full"
            rows="1"
          ></textarea>
          <!-- Conditionally show placeholder when focused and text area is empty -->
          <!-- <span v-if="(focusStates[index] || textAreas[index]) && !textAreas[index].trim()" class="absolute text-gray-400">
            Tell your story...
          </span> -->
        </div>
      </div>
    </div>
  </div>
</template>


