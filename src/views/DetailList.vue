<script setup>
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar.vue";
import PostCard from "@/components/PostCard.vue";

import { me, userByUsername } from "@/api/user/user.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Bell } from "lucide-vue-next";
import FollowButton from "../components/FollowButton.vue";
import { specificList } from "@/api/user/list.js";

const route = useRoute();
const profileUsername = route.params.username;
const listId = route.params.listId;
const posts = ref([]);

const user = ref({
  id: "",
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});

const author = ref({
  id: "",
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});

const list = ref({});

const isMyProfile = ref(false);

onMounted(async () => {
  try {
    // Mendapatkan informasi author
    author.value = await me();
    if (author.value.username === profileUsername) {
      isMyProfile.value = true;
    } else {
      author.value = await userByUsername(profileUsername);
      user.value = await me();
      isMyProfile.value = false;
    }

    // Mendapatkan data list
    list.value = await specificList(listId);
    posts.value = list.value.posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
});
</script>

<template>
  <!-- Navbar -->
  <div v-if="!isMyProfile">
    <Navbar :user-username="user.username" :user-photo="user.avatar" />
  </div>
  <div v-if="isMyProfile">
    <Navbar :user-username="author.username" :user-photo="author.avatar" />
  </div>

  <div
    class="grid grid-cols-1 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto py-10 px-6 md:px-8"
  >
    <div className="lg:col-span-2 lg:max-w-[717px] ">
      <div class="flex items-center space-x-3 p-3">
        <!-- Avatar -->
        <!-- Jangan lupa untuk ganti src imagenya sesuai dengan keperluan -->
        <img
          :src="author.avatar"
          :alt="author.username"
          class="w-14 h-14 rounded-full"
        />

        <!-- User Info -->
        <div class="flex flex-col">
          <a
            :href="'/profile/' + author.username"
            class="text-gray-900 font-medium"
            >{{ author.name }}</a
          >
          <div class="text-gray-500 text-sm flex items-center space-x-1">
            <span>Nov 3, 2024</span>
            <span>•</span>
            <!-- Ini nanti bakal dynamic sesuai dengan berapa banyak stories di dalam listnya -->
            <span>{{ posts.length }}</span>
          </div>
        </div>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mt-5 mb-10">
        {{ list.title }}
      </h1>
      <!--
        Ini nanti pake v-for untuk menampilkan semua posts, untuk testing pake div biasa dulu
       -->
      <div class="mb-6">
        <div v-for="post in posts" :key="post.id">
          <PostCard :authorUsername="post.authorUsername" :post="post" />
        </div>
      </div>
    </div>

    <div class="hidden lg:flex md:col-span-1 sticky top-0 h-screen">
      <div class="mt-10 mr-auto ml-10">
        <div class="flex flex-col justify-between gap-10">
          <div
            class="flex flex-row gap-3 lg:flex-col lg:items-start items-center"
          >
            <img
              :src="author.avatar"
              :alt="author.username"
              class="w-14 h-14 lg:w-20 lg:h-20 rounded-full"
            />
            <div class="flex flex-col items-start gap-2">
              <p class="text-base font-semibold">{{ author.name }}</p>
              <p class="text-sm text-gray-500 font-medium">100 followers</p>
            </div>
            <p class="lg:block hidden text-xs text-gray-500 font-medium">
              {{ author.bio }}
            </p>
            <div v-if="isMyProfile">
              <a
                href="/settings"
                class="cursor-pointer lg:flex text-emerald-600 hover:text-emerald-800 text-sm"
              >
                Edit profile
              </a>
            </div>
            <div
              v-if="!isMyProfile && author.id"
              class="mt-6 flex gap-2 items-center"
            >
              <FollowButton
                :followingId="author.id"
                :style="'cursor-pointer font-medium bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-5 lg:py-[8px] py-[6px]'"
              />
              <Button
                class="cursor-pointer font-medium bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-2.5 lg:py-[8px] py-[6px]"
              >
                <Bell aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
