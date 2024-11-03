<script setup>
import Home from "@/components/Home.vue";
import Navbar from "@/components/Navbar.vue";
import { me } from "@/api/user/user.js";
import { ref, onMounted } from "vue";

const user = ref({ username: "", avatar: "" });

onMounted(async () => {
  user.value = await me();
});
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />
  <main>
    <Home />
  </main>
</template>
