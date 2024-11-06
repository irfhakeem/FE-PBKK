<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { formatDate } from "@/lib/formatDate";
import {
  getPostById,
  getPosts,
  postComment,
  deleteComment,
  getComments,
} from "@/api/post/post.js";
import { me, userByUsername } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import { Bell, MessageCircle, X, Ellipsis } from "lucide-vue-next";
import ProfileCard from "../components/ProfileCard.vue";
import LikeButton from "../components/LikeButton.vue";
import FollowButton from "../components/FollowButton.vue";
import BookmarkButton from "../components/BookmarkButton.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const route = useRoute();
const post = ref({});
const recommendedPosts = ref([]);
const author = ref({});
const user = ref({});
const isMyProfile = ref(false);
const loading = ref(true);
const isCommentSheetOpen = ref(false);
const commentContent = ref("");
const comments = ref([]);

const toggleCommentSheet = () => {
  isCommentSheetOpen.value = !isCommentSheetOpen.value;
  if (isCommentSheetOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "auto";
  }
};

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

  comments.value = await getComments({ postId: post.value.id });
  loading.value = false;
});

const handleClickOutside = (event) => {
  const sheet = document.querySelector(".comment-sheet");
  const trigger = document.querySelector(".comment-trigger");

  if (
    sheet &&
    !sheet.contains(event.target) &&
    !trigger.contains(event.target)
  ) {
    isCommentSheetOpen.value = false;
    document.body.style.overflow = "auto";
  }
};

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const handleDeleteComment = async (commentId) => {
  await deleteComment(commentId);
  const index = comments.value.findIndex((comment) => comment.id === commentId);
  if (index !== -1) {
    comments.value.splice(index, 1);
    post.value.commentCount--;
  }
};

const handleSubmitComment = async (postId) => {
  const response = await postComment({
    postId: postId,
    content: commentContent.value,
  });
  comments.value.unshift(response);
  post.value.commentCount++;
};
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
            <button
              @click="toggleCommentSheet"
              class="comment-trigger flex items-center"
            >
              <MessageCircle aria-hidden="true" />
              <span class="ml-1">{{ post.commentCount }}</span>
            </button>
          </div>
          <div class="flex gap-5">
            <BookmarkButton :postId="post.id" />
          </div>
        </div>

        <!-- Custom Comment Sheet -->
        <div
          v-if="isCommentSheetOpen"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
        >
          <div
            class="comment-sheet bg-white w-[400px] sm:w-[540px] h-full flex flex-col"
          >
            <!-- Header -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">
                  Responses ({{ post.commentCount }})
                </h2>
                <button
                  @click="toggleCommentSheet"
                  class="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Comment Form -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex flex-col gap-4 bg-white shadow-md p-4">
                <div class="flex items-center gap-4">
                  <img :src="user.avatar" class="h-8 w-8 rounded-full" alt="" />
                  <p class="text-sm">{{ user.name }}</p>
                </div>
                <textarea
                  v-model="commentContent"
                  class="min-h-24 bg-gray-100 border-none w-full px-4 py-2 text-sm resize-none rounded-md"
                  maxlength="500"
                  placeholder="Write a comment..."
                  @input="
                    $event.target.style.height = 'auto';
                    $event.target.style.height =
                      $event.target.scrollHeight + 'px';
                  "
                ></textarea>
                <div class="flex justify-end gap-4">
                  <button
                    @click="toggleCommentSheet"
                    class="text-sm font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    @click="handleSubmitComment(post.id)"
                    class="text-sm font-medium bg-[#37823a] px-4 py-2 rounded-full text-white disabled:bg-[#37823a]/30 hover:bg-[#295d2a]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments List - Scrollable Area -->
            <div class="flex-1 overflow-y-auto">
              <div class="p-6">
                <p class="text-sm font-semibold mb-6">Latest</p>
                <div class="space-y-8">
                  <!-- Sample comments - Replace with actual comments data -->
                  <div
                    v-for="comment in comments"
                    :key="comment.id"
                    class="pb-6 border-b border-gray-100"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex items-center gap-3 mb-3">
                        <img
                          :src="user.avatar"
                          class="w-8 h-8 rounded-full"
                          alt=""
                        />
                        <div>
                          <p class="text-sm font-medium">{{ user.name }}</p>
                          <p class="text-xs text-gray-500">
                            {{ formatDate(comment.createdAt) }}
                          </p>
                        </div>
                      </div>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger as-child>
                            <button>
                              <Ellipsis
                                aria-hidden="true"
                                class="h-4 w-4"
                              ></Ellipsis>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent class="md:w-40 sm:w-36 w-32">
                            <DropdownMenuItem>
                              <button
                                @click="handleDeleteComment(comment.id)"
                                class="text-xs w-full text-red-700 font-medium"
                              >
                                Delete Comment
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <p class="text-sm text-gray-700">
                      {{ comment.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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

<style scoped>
.comment-sheet {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Hide scrollbar for Chrome, Safari and Opera */
.overflow-y-auto::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.overflow-y-auto {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
