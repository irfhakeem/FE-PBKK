<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "@/lib/formatDate";
import { getPostById, getPosts } from "@/api/post/post.js";
import { me, userByUsername } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import { Bell } from "lucide-vue-next";
import ProfileCard from "../components/ProfileCard.vue";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu';

const route = useRoute();
const post = ref({});
const recommendedPosts = ref([]);
const author = ref({});
const user = ref({});
const isMyProfile = ref(false);

onMounted(async () => {
  post.value = await getPostById(route.params.postId);
  user.value = await me();
  if (route.params.username !== user.value.username) {
    author.value = await userByUsername(route.params.username);
  } else {
    author.value = user.value;
    isMyProfile.value = true;
  }
  recommendedPosts.value = await getPosts({
    round: 1,
    userId: author.value.id,
    limit: 4,
  });
});

console.log(recommendedPosts.value);
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />
  <div class="flex flex-col min-h-screen">
  <!-- Header -->
    <header class ="grid grid-cols-1 py-5 px-10">
      <div class="container px-4">
        <!-- Header content -->
        <div class="grid grid-cols-1 py-5 px-10 ">
          <h1 class="text-3xl font-semibold">Settings</h1>
        </div>

        <!-- navigation menu -->
        <div class="grid grid-cols-1 py-5 px-10 ">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger class="font-semibold">Account</NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="container grid grid-cols-1 lg:max-w-10xl py-5 px-10 flex-grow">
      <!-- content -->
      <div class="grid grid-cols-1 lg:max-w-10xl py-5 px-10">
      <!-- Account Section -->
        <div class="border-b pb-4 mb-6">
          <div class="flex justify-between items-center mt-4 mb-4 gap-3">
            <span>Email address</span>
            <span class="text-gray-600">mirfanhakim1004@gmail.com</span>
          </div>
          <div class="flex justify-between items-center mt-4 mb-4 gap-3">
            <span>Username and subdomain</span>
            <span class="text-gray-600">@mirfanhakim100</span>
          </div>
          <div class="flex justify-between items-center mt-4 mb-4 gap-3">
            <span>Profile information</span>
            <span class="text-gray-600">Muhammad Irfan Hakim</span>
          </div>
          <div class="flex justify-between items-center mt-4 mb-4 gap-3">
            <span>Change password</span>
            <span class="text-gray-600">Change your password.</span>
          </div>
        </div>

        <div class="border-b pb-4 mb-6">
          <div class="flex justify-between items-center mt-4 mb-4 gap-3">
            <span>Delete account</span>
            <span class="text-gray-600">Delete this account.</span>
          </div>
        </div>
      </div>
   </div>
  </div>

  

  <!-- <div class="grid grid-cols-1 mx-auto py-3 px-10 ">
    <h2 class="text-xl font-semibold mb-2">Account</h2>
  </div> -->
  
 


  <!-- footer -->
  
 
</template>
