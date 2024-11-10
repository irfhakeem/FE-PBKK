<script setup>
import { ref, onMounted } from "vue";
import { me } from "@/api/user/user.js";
import { getUserPosts, deletePost } from "@/api/post/post.js";
import Navbar from "../components/Navbar.vue";
import { formatDate } from "@/lib/formatDate";
import { Ellipsis } from "lucide-vue-next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const posts = ref([]);
const user = ref({});
var isLoading = ref(true);

onMounted(async () => {
  user.value = await me();
  posts.value = await getUserPosts();

  isLoading.value = false;
});

const handleCopyLink = (postId) => {
  navigator.clipboard.writeText(
    `http://localhost:5173/${user.value.username}/${postId}`
  );
};

const deletePostHandler = async (postId) => {
  await deletePost(postId);
  posts.value = posts.value.filter((post) => post.id !== postId);
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
      <p class="text-2xl md:text-4xl font-semibold">Posts</p>
      <a
        href="/write"
        class="cursor-pointer text-xs sm:text-sm bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-3 sm:px-4 lg:py-[8px] py-[7px]"
      >
        Write a post
      </a>
    </div>
    <div v-for="post in posts" :key="post.id">
      <div class="flex flex-col pb-8 border-b-[1px] border-gray-100">
        <a
          :href="'/' + user.username + '/' + post.id"
          class="font-bold text-black sm:text-base text-sm"
        >
          {{ post.title }}
        </a>
        <a
          :href="'/' + user.username + '/' + post.id"
          class="sm:text-sm text-xs text-gray-500 font-medium"
        >
          {{ post.caption }}
        </a>

        <div class="flex items-center gap-4 mt-2">
          <a
            :href="'/' + user.username + '/' + post.id"
            class="sm:text-sm text-xs text-gray-500"
          >
            {{ formatDate(post.createdAt) }}
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button><Ellipsis aria-hidden="true"></Ellipsis></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="md:w-40 sm:w-48 w-40">
              <DropdownMenuItem class="sm:text-sm text-xs"
                ><button class="w-full" @click="handleCopyLink(post.id)">
                  Copy link
                </button></DropdownMenuItem
              >
              <div>
                <DropdownMenuItem class="sm:text-sm text-xs">
                  <button class="w-full">Edit post</button>
                </DropdownMenuItem>
                <DropdownMenuItem class="sm:text-sm text-xs"
                  ><button
                    class="w-full text-red-500"
                    @click="deletePostHandler(post.id)"
                  >
                    Delete post
                  </button></DropdownMenuItem
                >
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>
