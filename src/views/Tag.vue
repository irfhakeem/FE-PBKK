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
  console.log(lists.value);
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
        <p class="sm:text-2xl text-lg font-semibold">Recommended stories</p>
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
        :href="'/'"
        className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
      >
        See more from stories
      </a>
    </div>

    <!-- Lists -->
    <div
      class="flex flex-col lg:max-w-6xl lg:mx-auto px-6 md:px-8 mt-8 items-start"
    >
      <div class="flex flex-col border-t-2 border-gray-100 py-6 w-full gap-10">
        <p class="sm:text-2xl text-lg font-semibold">Recommended List</p>
        <div class="grid sm:grid-cols-2 grid-flow-row md:gap-x-10 gap-5">
          <div v-for="(list, index) in lists.slice(0, 4)" :key="list.id">
            <ListCard :authorUsername="list.username" :list="list" />
          </div>
        </div>
      </div>
      <a
        :href="'/'"
        className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
      >
        See more from stories
      </a>
    </div>

    <!-- Users -->
    <div
      class="flex flex-col lg:max-w-6xl lg:mx-auto px-6 md:px-8 my-8 items-start"
    >
      <div class="flex flex-col border-t-2 border-gray-100 py-6 w-full gap-10">
        <p class="sm:text-2xl text-lg font-semibold">Recommended Users</p>
        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row md:gap-x-10 gap-5"
        >
          <div v-for="user in users" :key="user.id">
            <Card
              class="w-50 sm:w-56 flex flex-col items-center justify-center"
            >
              <CardHeader>
                <img
                  :src="user.avatar"
                  :alt="user.username"
                  class="w-14 h-14 rounded-full"
                />
              </CardHeader>
              <CardDescription
                class="flex flex-col gap-4 items-center justify-center mb-4 px-6"
              >
                <div class="flex flex-col items-center">
                  <a
                    :href="'/profile/' + user.username"
                    class="md:text-base sm:text-sm text-xs font-semibold line-clamp-1"
                  >
                    {{ user.name }}
                  </a>
                  <a
                    :href="'/profile/' + user.username"
                    class="sm:text-sm text-xs text-gray-500"
                  >
                    {{ user.followerCount }} followers
                  </a>
                </div>

                <a
                  :href="'/profile/' + user.username"
                  class="text-xs text-gray-500 font-medium line-clamp-4"
                >
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Voluptatem dolor aut, et quos deserunt laboriosam aspernatur
                  libero veritatis! Excepturi ducimus sint iste officia saepe
                  neque qui obcaecati quibusdam nesciunt? Dignissimos.
                </a>
              </CardDescription>
              <CardFooter class="flex w-full">
                <FollowButton
                  :followingId="user.id"
                  :style="'text-xs sm:text-[12px] font-medium rounded-full w-full py-1.5 bg-black text-white'"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <a
        :href="'/'"
        className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
      >
        See more from stories
      </a>
    </div>
  </div>
</template>
