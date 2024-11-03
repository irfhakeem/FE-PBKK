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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { me, userByUsername } from "@/api/user/user.js";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Bell, Ellipsis, Link } from "lucide-vue-next";
import { getPosts } from "@/api/post/post.js";
import FollowButton from "../components/FollowButton.vue";

const route = useRoute();
const profileUsername = route.params.username;
const posts = ref([]);
const round = ref(1);

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
        :categories="['Home', 'Lists']"
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

      <div v-if="activeCategory == 'Lists'">
        <Card class="w-full">
          <div class="flex">
            <!-- sections -->
            <div class="flex-[0.55] bg-gray-100">
              <CardHeader>
                <CardDescription class="flex items-center gap-2">
                  <!-- User Avatar -->
                  <img
                    :src="author.avatar"
                    alt="User avatar"
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <!-- Username -->
                  <span class="text-sm font-semibold text-gray-800"
                    >user name</span
                  >
                </CardDescription>

                <!-- Card Title -->
                <CardTitle class="font-bold">Reading List</CardTitle>
              </CardHeader>
              <CardFooter class="flex justify-between px-6 pb-6">
                <p class="text-sm text-gray-600">1 story</p>

                <!-- Options Dropdown -->
                <div class="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button><Ellipsis aria-hidden="true"></Ellipsis></button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="md:w-40 sm:w-48 w-40">
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                      <DropdownMenuItem>Edit list info</DropdownMenuItem>
                      <DropdownMenuItem>Remove items</DropdownMenuItem>
                      <!-- if list is private -->
                      <DropdownMenuItem>Make list public</DropdownMenuItem>

                      <DropdownMenuItem>Reorder items</DropdownMenuItem>
                      <DropdownMenuItem>Hide responses</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardFooter>
            </div>
            <div class="flex-[0.25] bg-red-100">
              <!-- fill with story banner klo ada-->
            </div>
            <div class="flex-[0.15] bg-green-100 ml-1">
              <!-- fill with story banner klo ada-->
            </div>
            <div class="flex-[0.06] bg-blue-100 ml-1">
              <!-- fill with story banner klo ada-->
            </div>
          </div>
        </Card>
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
