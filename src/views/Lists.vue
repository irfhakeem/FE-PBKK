<script setup>
import { ref, onMounted } from "vue";
import { userLists } from "@/api/user/list.js";
import { me } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import ListCard from "../components/ListCard.vue";

const lists = ref([]);
const user = ref({});
var isLoading = ref(true);

onMounted(async () => {
  user.value = await me();
  lists.value = await userLists({ userId: user.value.id });

  isLoading.value = false;
});
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />
  <div
    v-if="!isLoading"
    class="flex flex-col lg:max-w-6xl lg:mx-auto py-10 px-6 md:px-8 gap-6"
  >
    <p
      class="text-2xl md:text-4xl font-semibold border-b-2 border-gray-100 pb-6"
    >
      Lists
    </p>
    <div v-for="list in lists" :key="list.id">
      <ListCard :authorUsername="user.username" :list="list" />
    </div>
  </div>
</template>
