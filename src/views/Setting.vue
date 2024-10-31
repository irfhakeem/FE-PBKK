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

  <div class="grid grid-cols-1 mx-auto py-5 px-10 ">
    <h1 class="text-3xl font-semibold mb-6">Settings</h1>
  </div>

  <!-- navigation menu -->

  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Account</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuLink>Link</NavigationMenuLink>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>

  <!-- <div class="grid grid-cols-1 mx-auto py-3 px-10 ">
    <h2 class="text-xl font-semibold mb-2">Account</h2>
  </div> -->
  
  <!-- content -->
  <div class="grid grid-cols-1 mx-auto py-5 px-10">
    Content here
    <!-- Account Section -->
    <div class="border-b pb-4 mb-6">
      <div class="flex justify-between items-center mb-2">
        <span>Email address</span>
        <span class="text-gray-600">mirfanhakim1004@gmail.com</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Username and subdomain</span>
        <span class="text-gray-600">@mirfanhakim100</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Profile information</span>
        <span class="text-gray-600">Muhammad Irfan Hakim</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Profile design</span>
        <span class="text-gray-600">Customize the appearance of your profile.</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Custom domain</span>
        <span class="text-gray-600">None</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Partner Program</span>
        <span class="text-gray-600">You are not enrolled in the Partner Program</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Muted writers and publications</span>
        <span class="text-gray-600">N/A</span>
      </div>
      <div class="flex justify-between items-center mb-2">
        <span>Blocked users</span>
        <span class="text-gray-600">N/A</span>
      </div>
    </div>
  </div>

  <!-- footer -->
  <div class="bg-[#f7f7f7]">
    <div class="flex flex-col mx-auto lg:max-w-3xl p-5">
      <div className="flex flex-col mt-5">
        <img
          :src="author.avatar"
          alt=""
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
        <div className="flex justify-between items-start mb-2 gap-7">
          <div className="flex flex-col">
            <a href="" className="font-semibold text-2xl"
              >Written by {{ author.name }}</a
            >

            <p className="text-sm text-black mb-2">100 followers</p>
            <p className="text-sm text-black ">{{ author.bio }}</p>
          </div>
          <div className="flex gap-2">
            <FollowButton
              custom="font-medium bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-4 py-[8px] text-[14px]"
              authorId="{author.id}"
              currentUserId="{currentUserId}"
              followUser="{follows}"
            />
            <button
              className="font-medium bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-2 py-[8px] text-[14px]"
            >
              <Bell aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7">
        <div
          className="grid-flow-row items-center border-y-[1px] border-gray-200"
        >
          <p className="text-base text-black font-semibold my-10">
            More from {{ author.name }}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-5">
            <div v-for="recommendedPost in recommendedPosts" :key="post.id">
              <div class="flex flex-col gap-5">
                <img
                  :src="recommendedPost.image"
                  alt=""
                  className="w-auto h-48 object-cover"
                />
                <ProfileCard :author="author" :userID="user.id" />
                <div class="flex flex-col gap-2">
                  <a
                    :href="'/' + author.username + '/' + recommendedPost.id"
                    className="text-lg font-bold text-black line-clamp-2"
                  >
                    {{ recommendedPost.title }}
                  </a>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {{ recommendedPost.caption }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <a
            :href="'/profile/' + author.username"
            className="border-[1px] rounded-full border-black text-black text-sm font-medium py-2 px-4 hover:bg-black hover:text-white"
          >
            See more from {{ author.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
