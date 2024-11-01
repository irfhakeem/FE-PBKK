<script setup>
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar.vue";
import Slider from "@/components/Slider.vue";
import Postcard from "@/components/PostCard.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { me, userByUsername } from "@/api/user/user.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Bell, Ellipsis, Link } from "lucide-vue-next";
import { getPosts } from "@/api/post/post.js";

const route = useRoute();
const profileUsername = route.params.username;
const posts = ref([]);
const round = ref(1);

const user = ref({
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});

const author = ref({
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});

const isMyProfile = ref(false);
const activeCategory = ref("Home");

const setActiveCategory = (category) => {
  activeCategory.value = category;
};

onMounted(async () => {
  author.value = await me();
  if (author.value.username === profileUsername) {
    isMyProfile.value = true;
  } else {
    author.value = await userByUsername(profileUsername);
    user.value = await me();
    isMyProfile.value = false;
  }
  posts.value = await getPosts({
    round: round.value,
    userId: author.value.id,
    limit: 10,
  });
});

const handleCopyLink = () => {
  navigator.clipboard.writeText(window.location.href);
};
</script>

<template>
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
      <img
        :src="author.banner"
        alt=""
        class="w-full min-h-[150px] max-h-[150px] bg-center object-cover"
      />
      <div className="lg:mt-10 md:mt-6 lg:px-6 sm:px-8 px-4">
        <div
          className="flex lg:flex-row flex-col py-5 lg:items-center justify-between items-start"
        >
          <p className="block text-2xl sm:text-4xl font-bold ">
            {{ author.name }}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button><Ellipsis aria-hidden="true"></Ellipsis></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="md:w-56 sm:w-48 w-40">
              <DropdownMenuItem>
                <Link class="mr-2 sm:h-4 sm:w-4 h-2 w-2" />
                <button
                  @click="handleCopyLink"
                  class="text-xs sm:text-sm w-full"
                >
                  Copy link to profile
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <!-- List -->
      <Slider
        :categories="['Home', 'Bookmarks']"
        :activeCategory="activeCategory"
        @update:activeCategory="setActiveCategory"
      />
      <!-- showcase -->
      <div v-if="activeCategory === 'Home'">
        <div v-if="isMyProfile">
          <div v-for="post in posts" :key="post.id">
            <Postcard :author="author" :post="post" />
          </div>
        </div>
        <div v-else>
          <div v-for="post in posts" :key="post.id">
            <Postcard :author="author" :userID="user.id" :post="post" />
          </div>
        </div>
      </div>
      <div v-if="activeCategory == 'Bookmarks'">
        <p>ini Bookmarks</p>
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
            <div v-if="!isMyProfile" className="mt-6 flex gap-2">
              <Button
                class="cursor-pointer font-medium bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full lg:px-4 lg:py-[8px] py-[6px] px-3 lg:text-[14px] text-xs"
                >Follow</Button
              >
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
