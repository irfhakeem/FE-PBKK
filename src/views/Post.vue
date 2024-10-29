<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "@/lib/formatDate";
import { getPostById, getPosts } from "@/api/post/post.js";
import { me, userByUsername } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import { Bell } from "lucide-vue-next";
import ProfileCard from "../components/ProfileCard.vue";

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
  <div class="grid grid-cols-1 mx-auto lg:max-w-3xl py-10 px-10 mb-10">
    <div class="flex flex-col gap-10">
      <div class="flex flex-col gap-10">
        <p class="text-3xl md:text-5xl font-bold">{{ post.title }}</p>
        <div class="flex gap-5 items-center">
          <img :src="author.avatar" alt="" class="w-9 h-9 rounded-full" />
          <div class="flex flex-col">
            <div class="flex gap-2">
              <a :href="'/profile/' + author.username" class="hover:underline">
                {{ author.name }}
              </a>
              <div v-if="!isMyProfile">
                <p class="text-gray-500 font-thin">•</p>
                <!-- <FollowButton
                    :custom="'font-semibold text-[#37823a] hover:text-[#295d2a]'"
                    :authorId="author.id"
                    :currentUserId="currentUserId"
                    :followUser="follows"
                  /> -->
              </div>
            </div>
            <p class="text-sm text-gray-500 font-medium">
              {{ formatDate(post.createdAt) }}
            </p>
          </div>
        </div>
        <div
          class="border-y-[1px] py-3 px-2 border-gray-100 flex justify-between"
        >
          <div class="flex gap-5">
            <!-- <Like
              :postId="post.id"
              :userId="currentUserId"
              :totalLikes="post._count.like"
              :isLiked="isLiked"
            />
            <Comment :postId="post.id" :userId="currentUserId" :users="users" /> -->
          </div>
          <div class="flex gap-5">
            <!-- <BookmarkButton
              :isBookmarked="isBookmarked"
              :postId="post.id"
              :userId="currentUserId"
              custom="h-auto w-6 text-gray-500 hover:text-black"
            />
            <button @click="handleShare">
              <ShareIcon class="h-auto w-6 text-gray-500 hover:text-black" />
            </button> -->
          </div>
        </div>
      </div>
      <p>{{ post.content }}</p>
      <div class="flex flex-wrap gap-3">
        <!-- <button
          v-for="tag in blogTags"
          :key="tag.id"
          class="bg-[#f2f2f2] rounded-full px-4 py-2 text-sm font-medium"
        >
          {{ post.title }}
        </button> -->
      </div>
      <div class="py-3 px-2 flex justify-between">
        <div class="flex gap-5">
          <!-- <Like
            :postId="post.id"
            :userId="currentUserId"
            :totalLikes="post._count.like"
            :isLiked="isLiked"
          />
          <Comment :postId="post.id" :userId="currentUserId" :users="users" /> -->
        </div>
        <div class="flex gap-5">
          <!-- <BookmarkButton
            :isBookmarked="isBookmarked"
            :postId="post.id"
            :userId="currentUserId"
            custom="h-auto w-6 text-gray-500 hover:text-black"
          />
          <ShareButton /> -->
        </div>
      </div>
    </div>
  </div>

  <div class="bg-[#f7f7f7] mt-20">
    <div class="flex flex-col mx-auto lg:max-w-3xl p-10 gap-20">
      <div className="flex flex-col mt-10">
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
