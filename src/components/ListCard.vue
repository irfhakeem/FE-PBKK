<script setup>
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userByUsername, me } from "@/api/user/user.js";
import { ref, onMounted, watch } from "vue";
import { Ellipsis } from "lucide-vue-next";
import { useRouter } from "vue-router";
import { deleteList, updateList } from "@/api/user/list.js";

const router = useRouter();
const props = defineProps({
  authorUsername: String,
  list: Object,
});

const author = ref({});
const Me = ref({});
const list = ref(props.list);
const modalRef = ref(null);
const isModalOpen = ref(false);
const newListTitle = ref("");

const fetchAuthor = async () => {
  if (props.authorUsername) {
    author.value = await userByUsername(props.authorUsername);
    Me.value = await me();
  }
};

onMounted(fetchAuthor);
watch(() => props.authorUsername, fetchAuthor);

const navigateToLink = () => {
  router.push({
    path: `/profile/${author.value.username}/lists/${props.list.id}`,
  });
};

const deleteListHandler = async () => {
  await deleteList(list.value.id);
  router.go(0);
};

const handleCopyLink = () => {
  navigator.clipboard.writeText(
    `http://localhost:5173/profile/${author.value.username}/lists/${props.list.id}`
  );
};

const openModal = (event) => {
  event.stopPropagation();
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const updateListHandler = async () => {
  if (!newListTitle.value.trim()) return;

  const updatedList = await updateList({
    listId: list.value.id,
    title: newListTitle.value,
  });
  list.value = updatedList;
  newListTitle.value = "";
  closeModal();
  router.go(0);
};
</script>

<!-- Delete List -->
<template>
  <Card class="w-full cursor-pointer">
    <div class="flex flex-row justify-between">
      <!-- sections -->
      <div class="flex-[0.55] bg-[#f9f9f9]">
        <CardHeader @click="navigateToLink">
          <CardDescription class="flex items-center gap-2">
            <!-- User Avatar -->
            <img
              :src="author.avatar"
              alt="User avatar"
              class="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
            />
            <!-- Username -->
            <span class="text-[11px] sm:text-sm font-semibold text-gray-800">{{
              author.name
            }}</span>
          </CardDescription>

          <!-- Card Title -->
          <CardTitle class="font-bold text-base sm:text-xl">{{
            props.list.title
          }}</CardTitle>
        </CardHeader>
        <CardFooter class="flex justify-between px-6 pb-6">
          <p class="text-sm text-gray-600">
            {{ props.list.posts.length }} Posts
          </p>

          <!-- Options Dropdown -->
          <div class="relative">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button><Ellipsis aria-hidden="true"></Ellipsis></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="md:w-40 sm:w-48 w-40">
                <DropdownMenuItem class="sm:text-sm text-xs"
                  ><button class="w-full" @click="handleCopyLink">
                    Copy link
                  </button></DropdownMenuItem
                >
                <div v-if="Me.id == author.id">
                  <DropdownMenuItem class="sm:text-sm text-xs">
                    <button class="w-full" @click="openModal">
                      Edit list info
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem class="sm:text-sm text-xs"
                    ><button
                      class="w-full text-red-500"
                      @click="deleteListHandler"
                    >
                      Remove items
                    </button></DropdownMenuItem
                  >
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </div>

      <div class="flex-[0.45] flex gap-1">
        <div
          v-if="list.posts.length === 0"
          v-for="i in 3"
          :key="i"
          :class="{
            'flex-[0.5]': i === 1,
            'flex-[0.3]': i === 2,
            'flex-[0.2]': i === 3,
          }"
        >
          <div class="flex-1 bg-gray-200 h-full"></div>
        </div>
        <div
          v-else
          v-for="(post, index) in 3"
          :key="index"
          :class="{
            'flex-[0.5]': index === 0,
            'flex-[0.3]': index === 1,
            'flex-[0.2]': index === 2,
          }"
        >
          <div v-if="list.posts[index]" class="h-full">
            <img
              :src="list.posts[index].image"
              alt="Post image"
              class="h-full w-full object-cover"
            />
          </div>
          <div v-else class="flex-1 bg-gray-200 h-full"></div>
        </div>
      </div>
    </div>
  </Card>

  <!-- Modal for edit list -->
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
        <h2 class="text-lg font-semibold text-black">Update List</h2>
      </div>

      <div class="mb-4">
        <input
          v-model="newListTitle"
          class="w-full px-4 py-2 text-sm bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="List title"
          @keyup.enter="updateListHandler"
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
          @click="updateListHandler"
          class="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
        >
          Save
        </button>
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
