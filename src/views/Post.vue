<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "@/lib/formatDate";
import { getPostById, getPosts } from "@/api/post/post.js";
import { me, userByUsername } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import { Bell } from "lucide-vue-next";
import ProfileCard from "../components/ProfileCard.vue";
import LikeButton from "../components/LikeButton.vue";
import FollowButton from "../components/FollowButton.vue";
import BookmarkButton from "../components/BookmarkButton.vue";
import { MessageCircle } from "lucide-vue-next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const route = useRoute();
const post = ref({});
const recommendedPosts = ref([]);
const author = ref({});
const user = ref({});
const isMyProfile = ref(false);
const loading = ref(true);

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
  console.log(post.value);
  loading.value = false;
});
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />

  <div
    v-if="!loading"
    class="grid grid-cols-1 mx-auto lg:max-w-3xl py-10 px-10 mb-10"
  >
    <div class="flex flex-col gap-10">
      <!-- Post content -->
      <div class="flex flex-col gap-10">
        <p class="text-3xl md:text-5xl font-bold">{{ post.title }}</p>
        <div class="flex gap-5 items-center">
          <img :src="author.avatar" alt="" class="w-9 h-9 rounded-full" />
          <div class="flex flex-col">
            <div class="flex gap-2">
              <a :href="'/profile/' + author.username" class="hover:underline">
                {{ author.name }}
              </a>
            </div>
            <p class="text-sm text-gray-500 font-medium">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>
        <div
          class="border-y-[1px] py-3 px-2 border-gray-100 flex justify-between"
        >
          <div class="flex gap-5 items-center justify-center">
            <LikeButton :like="post.likeCount" :postId="post.id" />
            <Sheet>
              <SheetTrigger as-child>
                <button>
                  <MessageCircle aria-hidden="true" />
                </button>
                <span class="ml-[-10px]">{{ post.commentCount }}</span>
              </SheetTrigger>
              <SheetContent class="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle class="text-bold text-lg sm:text-xl"
                    >Responses ({{ post.commentCount }})</SheetTitle
                  >
                </SheetHeader>
                <div class="mt-6 mb-5 border-b-[1px] pb-10 border-gray-200">
                  <div
                    class="flex flex-col justify-center bg-white shadow-md p-4 gap-4"
                  >
                    <div class="flex items-center gap-4">
                      <img :src="user.avatar" class="h-8 w-8" alt="" />
                      <p class="text-xs sm:text-sm">{{ user.name }}</p>
                    </div>
                    <textarea
                      id="content"
                      value=""
                      class="min-h-24 bg-gray-100 border-none w-full px-4 py-2 text-[13px] resize-none"
                      :maxlength="500"
                      placeholder="Write a comment..."
                      @input="
                        bioLength = length($event.target.value);
                        $event.target.style.height = 'auto';
                        $event.target.style.height =
                          $event.target.scrollHeight + 'px';
                      "
                    ></textarea>
                    <div class="flex justify-end gap-4">
                      <button class="text-xs font-medium">Cancel</button>
                      <button
                        class="text-xs font-medium bg-[#37823a] px-3 py-2 rounded-3xl text-white disabled:bg-[#37823a]/30"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
                <p class="text-sm font-semibold mb-8">Latest</p>
                <div>
                  <div
                    class="flex flex-col gap-4 border-b-2 border-gray-100 pb-10"
                  >
                    <div class="flex items-center gap-3">
                      <img :src="user.avatar" class="w-8 h-8" alt="" />
                      <div class="flex flex-col justify-start items-start">
                        <p class="text-sm">Testing</p>
                        <p class="text-gray-500 text-xs">4 months ago</p>
                      </div>
                    </div>
                    <p class="text-xs">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Ut dolore, esse enim ipsum temporibus repellat fugit
                      dignissimos odio nulla, totam ducimus quo natus ullam vero
                      vitae ratione. Laborum, culpa debitis!
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div class="flex gap-5">
            <BookmarkButton :postId="post.id" />
          </div>
        </div>
      </div>
      <p>{{ post.content }}</p>
      <div class="flex flex-wrap gap-3">
        <!-- Tags of post -->
      </div>
    </div>
  </div>

  <!-- Recommended Posts -->
  <div v-if="!loading" class="bg-[#f7f7f7] mt-20">
    <div class="flex flex-col mx-auto lg:max-w-3xl p-10 gap-20">
      <div className="flex flex-col mt-10">
        <img
          :src="author.avatar"
          alt=""
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
        <div className="flex justify-between items-start mb-2 gap-7">
          <div className="flex flex-col">
            <a href="" className="font-semibold text-2xl">
              Written by {{ author.name }}
            </a>
            <p className="text-sm text-black mb-5">100 followers</p>
            <p className="text-sm text-black ">{{ author.bio }}</p>
          </div>
          <div v-if="!isMyProfile" className="flex gap-2">
            <FollowButton
              :style="'cursor-pointer font-medium bg-[#37823a] hover:bg-[#295d2a] text-[#f7f7f7] rounded-full px-3 lg:py-[8px] py-[6px]'"
              :followingId="author.id"
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
