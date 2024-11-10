<script setup>
import { ref, onMounted } from "vue";
import { userLists, createList } from "@/api/user/list.js";
import { me } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import ListCard from "../components/ListCard.vue";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const lists = ref([]);
const user = ref({});
var newListTitle = ref("");
var isLoading = ref(true);

onMounted(async () => {
  user.value = await me();
  lists.value = await userLists({ userId: user.value.id });

  isLoading.value = false;
});

const createListHandler = async () => {
  if (!newListTitle.value.trim()) return;

  const newList = await createList({ title: newListTitle.value });
  lists.value.push(newList);
  newListTitle.value = "";
};
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />
  <div
    v-if="!isLoading"
    class="flex flex-col lg:max-w-6xl lg:mx-auto pt-10 px-6 md:px-8 gap-6"
  >
    <div
      class="flex items-center justify-between border-b-2 border-gray-100 pb-6"
    >
      <p class="text-2xl md:text-4xl font-semibold">Lists</p>

      <Dialog class="cursor-pointer">
        <DialogTrigger as-child>
          <button
            class="cursor-pointer text-xs sm:text-sm bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-3 sm:px-4 lg:py-[8px] py-[7px]"
          >
            New List
          </button>
        </DialogTrigger>
        <DialogContent class="rounded-md max-w-[375px] sm:max-w-[425px] pt-8">
          <DialogHeader class="flex items-center">
            <DialogTitle>Create New List</DialogTitle>
          </DialogHeader>
          <input
            id="newListTitle"
            v-model="newListTitle"
            class="bg-gray-100 border-none w-full px-4 py-2 text-sm"
          />

          <DialogFooter>
            <button
              type="submit"
              class="cursor-pointer bg-black text-white px-4 py-2 rounded-md text-sm"
              @click="createListHandler"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <div v-for="list in lists" :key="list.id">
      <ListCard :authorUsername="user.username" :list="list" />
    </div>
  </div>
</template>
