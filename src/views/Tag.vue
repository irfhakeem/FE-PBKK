<script setup>
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { me } from "@/api/user/user.js";
import { ref, onMounted } from "vue";
import { tagContents } from "@/api/tag/tag.js";
import PostCard2 from "../components/PostCard2.vue";
import PostCard from "../components/PostCard.vue";
import ListCard from "../components/ListCard.vue";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FollowButton from "../components/FollowButton.vue";

const route = useRoute();
const Me = ref({});
const posts = ref([]);
const users = ref([]);
const lists = ref([]);
const response = ref({});
const isLoading = ref(true);

const tag = route.params.tagName;

onMounted(async () => {
  Me.value = await me();
  response.value = await tagContents({ name: tag });
  posts.value = response.value.posts;
  users.value = response.value.users;
  lists.value = response.value.lists;
  isLoading.value = false;
});
</script>

<template>
  <Navbar :user-username="Me.username" :user-photo="Me.avatar" />

  <div v-if="!isLoading">
    <div class="flex items-center justify-center py-10">
      <p class="text-4xl md:text-4xl font-bold">
        {{ tag }}
      </p>
    </div>

    <div
      class="flex flex-col lg:max-w-6xl lg:mx-auto px-6 md:px-8 items-start justify-between"
    >
      <!-- Stories -->
      <div
        class="flex flex-col border-t-2 border-gray-100 py-6 w-full gap-6 sm:gap-10"
      >
        <p class="sm:text-2xl text-lg font-semibold">Recommended Posts</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:gap-10 gap-5">
          <div v-for="(post, index) in posts.slice(0, 2)" :key="post.id">
            <PostCard2 :post="post" :authorUsername="post.authorUsername" />
          </div>
        </div>

        <!-- if > sm -->
        <div class="hidden sm:visible sm:grid sm:grid-cols-3 sm:gap-10">
          <div v-for="(post, index) in posts.slice(3, 10)" :key="post.id">
            <PostCard2 :post="post" :authorUsername="post.authorUsername" />
          </div>
        </div>

        <!-- If < sm -->
        <div class="sm:hidden grid grid-cols-1 gap-3">
          <div v-for="(post, index) in posts.slice(3, 10)" :key="post.id">
            <PostCard :post="post" :authorUsername="post.authorUsername" />
          </div>
        </div>
      </div>

      <!-- button more -->
      <a
        :href="'/tag/' + tag + '/recommended/post'"
        className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
      >
        See more from posts
      </a>
    </div>

    <!-- Lists -->
    <div
      class="flex flex-col lg:max-w-6xl lg:mx-auto px-6 md:px-8 mt-8 items-start"
    >
      <div class="flex flex-col border-t-2 border-gray-100 py-6 w-full gap-10">
        <p class="sm:text-2xl text-lg font-semibold">Recommended Lists</p>
        <div class="grid sm:grid-cols-2 grid-flow-row md:gap-x-10 gap-5">
          <div v-for="(list, index) in lists.slice(0, 4)" :key="list.id">
            <ListCard :authorUsername="list.username" :list="list" />
          </div>
        </div>
      </div>
      <a
        :href="'/tag/' + tag + '/recommended/list'"
        className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
      >
        See more from lists
      </a>
    </div>

    <!-- Users -->
    <div
      class="flex flex-col lg:max-w-6xl lg:mx-auto px-6 md:px-8 my-8 items-start"
    >
      <div class="flex flex-col border-t-2 border-gray-100 py-6 w-full gap-10">
        <p class="sm:text-2xl text-lg font-semibold">Recommended Users</p>
        <div class="flex flex-col md:gap-x-8 gap-5 w-full">
          <div v-for="(user, index) in users.slice(0, 3)" :key="user.id">
            <div class="mb-5">
              <!-- Card -->
              <div class="flex p-8 bg-white gap-5 border-b-2 border-gray-100">
                <div
                  class="flex md:flex-row flex-col md:justify-between justify-center md:items-center w-full gap-5 md:gap-0"
                >
                  <div class="flex items-center gap-4">
                    <img
                      :src="user.avatar"
                      alt="avatar"
                      class="w-12 h-12 md:w-14 md:h-14 rounded-full"
                    />
                    <div class="flex flex-col gap-2">
                      <a
                        :href="'/profile/' + user.username"
                        class="text-lg font-semibold"
                        >{{ user.name }}</a
                      >
                      <a
                        :href="'/profile/' + user.username"
                        class="text-xs md:text-sm text-gray-500 text-medium"
                        >{{ user.bio }}</a
                      >
                    </div>
                  </div>
                  <div class="flex items-center justify-end">
                    <FollowButton
                      :followingId="user.id"
                      :style="'text-sm font-medium bg-[#37823a] px-4 py-2 rounded-full text-white disabled:bg-[#37823a]/30 hover:bg-[#295d2a]'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        :href="'/tag/' + tag + '/recommended/user'"
        className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
      >
        See more from users
      </a>
    </div>
  </div>
</template>
