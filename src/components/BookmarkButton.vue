<script setup>
import { ref, onMounted, watch } from "vue";
import { Bookmark, BookmarkCheck } from "lucide-vue-next";
import {
  addPostToList,
  removePostFromList,
  isPostListed,
  getMyLists,
  createList,
} from "@/api/user/list.js";

const props = defineProps({
  postId: String,
});

// State management
const listed = ref(false);
const listedId = ref(null);
const lists = ref([]);
const isDropdownOpen = ref(false);
const isModalOpen = ref(false);
const newListTitle = ref("");
const checkboxStates = ref({});

// Lifecycle hooks
onMounted(async () => {
  const postListing = await isPostListed({ postId: props.postId });
  listed.value = postListing.isListed;
  listedId.value = postListing.listId;
  lists.value = await getMyLists();

  // Initialize checkbox states based on the lists
  lists.value.forEach((list) => {
    checkboxStates.value[list.id] = false;
    if (listed.value && list.id === listedId.value) {
      checkboxStates.value[list.id] = true;
    }
  });
});

const isInitialMount = ref(true);

// Watch for changes in checkbox states
watch(
  checkboxStates,
  async (newStates) => {
    if (isInitialMount.value) {
      isInitialMount.value = false;
      return;
    }
    for (const listId in newStates) {
      const newListed = newStates[listId];

      if (newListed) {
        await addPostToList({ postId: props.postId, listId });
        console.log(`Added post to list ${listId}`);
      } else {
        await removePostFromList({ postId: props.postId, listId });
        console.log(`Removed post from list ${listId}`);
      }
    }
  },
  { deep: true }
);

// Event handlers
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const openModal = (event) => {
  event.stopPropagation();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const createListHandler = async () => {
  if (!newListTitle.value.trim()) return;

  const newList = await createList({ title: newListTitle.value });
  lists.value.push(newList);
  checkboxStates.value[newList.id] = false;
  newListTitle.value = "";
  closeModal();
};

// Click outside handlers
const dropdownRef = ref(null);
const modalRef = ref(null);

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
  if (
    modalRef.value &&
    !modalRef.value.contains(event.target) &&
    !event.target.closest(".modal-trigger")
  ) {
    isModalOpen.value = false;
  }
};
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <button @click="toggleDropdown">
      <Bookmark v-if="!listed" class="h-5 w-5 hover:text-black text-gray-500" />
      <BookmarkCheck v-else class="h-5 w-5 hover:text-black text-gray-500" />
    </button>

    <div
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
    >
      <div class="py-1">
        <div class="px-4 py-2" v-for="list in lists" :key="list.id">
          <div class="flex items-center">
            <input
              type="checkbox"
              :id="list.id"
              :value="list.id"
              v-model="checkboxStates[list.id]"
              class="h-4 w-4 border border-gray-300 rounded-sm focus:outline-none cursor-pointer relative"
            />
            <label :for="list.id" class="ml-2 text-sm cursor-pointer">
              {{ list.title }}
            </label>
          </div>
        </div>

        <div class="border-t border-gray-100">
          <button
            @click="openModal"
            class="modal-trigger block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Create New List
          </button>
        </div>
      </div>
    </div>

    <!-- Modal for creating new lists -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
      @click="closeModal"
    >
      <div
        ref="modalRef"
        class="bg-white rounded-lg p-6 w-[425px] max-w-[90vw]"
        @click.stop
      >
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-black">Create New List</h2>
        </div>

        <div class="mb-4">
          <input
            v-model="newListTitle"
            class="w-full px-4 py-2 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="List name"
            @keyup.enter="createListHandler"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            @click="closeModal"
            class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            @click="createListHandler"
            class="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
