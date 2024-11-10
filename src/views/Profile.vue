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

import { me, userByUsername, updateUser } from "@/api/user/user.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Bell, Ellipsis, Link, Image, Check, X } from "lucide-vue-next";
import { getPosts } from "@/api/post/post.js";
import FollowButton from "../components/FollowButton.vue";
import ListCard from "@/components/ListCard.vue";
import { userLists } from "@/api/user/list.js";
import { useRouter } from "vue-router";
import { uploadBanner } from "@/api/storage/storage.js";

const route = useRoute();
const router = useRouter();
const profileUsername = route.params.username;
const posts = ref([]);
var round = ref(1);
const lists = ref([]);

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

const isMyProfile = ref(false);
const activeCategory = ref("Home");
var bannerData = ref(null);

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
  lists.value = await userLists({ userId: author.value.id });
});

const handleCopyLink = () => {
  navigator.clipboard.writeText(window.location.href);
};

const UpdateBanner = async () => {
  await updateUser({ banner: bannerData });
  bannerData = null;
  router.go(0);
};

const UploadBanner = async () => {
  const bannerFile = document.getElementById("bannerFile").files[0];
  if (!bannerFile) {
    console.error("No file selected");
    return;
  }
  try {
    bannerData = await uploadBanner(bannerFile);
    author.value.banner = bannerData;
  } catch (error) {
    console.error("Failed to upload banner:", error.message);
  }
};

const CancelUpdate = () => {
  router.go(0);
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
    class="grid grid-cols-1 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto pt-10 px-6 md:px-8"
  >
    <div class="lg:col-span-2 lg:max-w-[717px] relative">
      <!-- Banner image -->
      <img
        :src="author.banner"
        alt=""
        class="w-full min-h-[150px] max-h-[150px] bg-center object-cover"
      />

      <div class="absolute top-2 right-2">
        <label
          v-if="isMyProfile && bannerData === null"
          class="flex items-center gap-2 cursor-pointer text-xs sm:text-sm font-medium text-black/50 bg-white/20 p-2 hover:bg-white/50 hover:text-black/80 rounded-full"
        >
          <Image class="sm:h-5 sm:w-5 h-3 w-3" />
          <input
            id="bannerFile"
            type="file"
            class="hidden"
            @change="UploadBanner"
          />
        </label>

        <div class="flex gap-3" v-if="isMyProfile && bannerData">
          <label
            class="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-white bg-red-700 p-2 rounded-full"
          >
            <button @click="CancelUpdate">
              <X class="sm:h-5 sm:w-5 h-3 w-3" />
            </button>
          </label>

          <label
            class="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-white bg-emerald-700 p-2 rounded-full"
          >
            <button @click="UpdateBanner">
              <Check class="sm:h-5 sm:w-5 h-3 w-3" />
            </button>
          </label>
        </div>
      </div>

      <div class="lg:mt-10 md:mt-6 lg:px-6 sm:px-8 px-4">
        <div
          class="flex lg:flex-row flex-col py-5 lg:items-center justify-between items-start"
        >
          <p class="block text-2xl sm:text-4xl font-bold">
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

      <!-- List and showcase sections -->
      <Slider
        :categories="['Home', 'Lists']"
        :activeCategory="activeCategory"
        @update:activeCategory="setActiveCategory"
      />
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
      <div class="flex flex-col gap-5 mt-3" v-if="activeCategory == 'Lists'">
        <div v-for="list in lists" :key="list.id">
          <ListCard :authorUsername="author.username" :list="list" />
        </div>
      </div>
    </div>

    <!-- Profile info section -->
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
              <p class="text-sm text-gray-500 font-medium">
                {{ author.followers }} Followers
              </p>
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
