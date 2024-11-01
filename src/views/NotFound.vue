<script setup>
import Navbar from "../components/Navbar.vue";
import { me } from "../api/user/user.js";
import { ref, onMounted } from "vue";

const user = ref({
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});

onMounted(async () => {
  user.value = await me();
});
</script>

<template>
  <Navbar :user-photo="user.avatar" :user-username="user.username" />
  <div class="flex flex-col justify-center items-center h-full">
    <img
      src="/public/notFound.svg"
      class="w-[400px] sm:w-[500px] md:w-[600px] h-auto"
      alt=""
    />
    <a href="/home" class="underline md:text-lg text-gray-500 hover:text-black">
      Home
    </a>
  </div>
</template>
