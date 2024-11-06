<script setup>
import Navbar from "@/components/Navbar.vue";
import { me, getRandomUsers, getFollowing } from "@/api/user/user.js";
import { getPosts } from "@/api/post/post.js";
import { ref, onMounted, watch } from "vue";
import Slider from "../components/Slider.vue";
import FollowButton from "../components/FollowButton.vue";
import PostCard from "../components/PostCard.vue";
import { recommendedTags } from "@/api/tag/tag.js";

const user = ref({
  id: "",
  username: "",
  avatar: "",
  email: "",
  bio: "",
  banner: "",
  name: "",
});

const following = ref([]);
const posts = ref([]);
const peeps = ref([]);
const activeCategory = ref("For You");
const tags = ref([]);

const setActiveCategory = (category) => {
  activeCategory.value = category;
};

const fetchPosts = async () => {
  if (activeCategory.value === "For You") {
    posts.value = await getPosts({
      round: 1,
      limit: 10,
    });
  } else {
    posts.value = [];
    for (const author of following.value) {
      const userPosts = await getPosts({
        round: 1,
        userId: author,
        limit: 10,
      });
      posts.value.push(...userPosts);
    }
  }
};

onMounted(async () => {
  following.value = await getFollowing();
  user.value = await me();
  peeps.value = await getRandomUsers();
  tags.value = await recommendedTags();
  await fetchPosts();
});

watch(activeCategory, async () => {
  await fetchPosts();
});
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />
  <div
    class="grid grid-cols-1 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto py-10 px-6 md:px-8"
  >
    <div className="lg:col-span-2 lg:max-w-[717px] ">
      <Slider
        :categories="['For You', 'Following']"
        :activeCategory="activeCategory"
        @update:activeCategory="setActiveCategory"
      />
      <div class="flex flex-col">
        <div v-for="post in posts" :key="post.id">
          <PostCard :post="post" :authorUsername="post.authorUsername" />
        </div>
      </div>
    </div>
    <div class="hidden lg:flex lg:flex-col md:col-span-1 sticky top-0 h-screen">
      <div class="flex flex-col py-10 pr-auto pl-10 gap-10">
        <div class="flex flex-col gap-4">
          <p class="font-medium sm:text-sm text-xs text-black">
            Recommended topics
          </p>
          <div class="flex flex-wrap gap-x-2 gap-y-4">
            <div v-for="tag in tags" :key="tag.id">
              <a
                :href="'/tag/' + tag.name"
                class="bg-[#f2f2f2] rounded-full px-4 py-2 text-xs font-medium"
                >{{ tag.name }}</a
              >
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <p class="font-medium sm:text-sm text-xs text-black">Who to follow</p>
          <div class="flex flex-wrap gap-x-2 gap-y-4">
            <div
              v-for="peep in peeps"
              class="flex flex-row justify-between items-center w-full"
            >
              <div class="flex flex-row items-center gap-2">
                <img
                  :src="peep.avatar"
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div class="flex flex-col justify-start items-start">
                  <a
                    :href="'/profile/' + peep.username"
                    class="sm:text-sm text-xs line-clamp-1 font-bold"
                    >{{ peep.name }}</a
                  >
                  <p class="text-xs text-gray-500">{{ peep.bio }}</p>
                </div>
              </div>
              <FollowButton
                :followingId="peep.id"
                :style="'text-[12px] font-medium rounded-full px-3 py-2 bg-white border-[1px] border-black text-black'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
