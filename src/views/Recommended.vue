<script setup>
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { ref, onMounted } from "vue";
import { me } from "@/api/user/user.js";
import { recommendedDetail } from "@/api/tag/tag.js";
import PostCard from "@/components/PostCard.vue";
import ListCard from "../components/ListCard.vue";
import FollowButton from "../components/FollowButton.vue";

const router = useRoute();
const tag = router.params.tagName;
const Me = ref({});
const contents = ref([]);
const type = router.params.type;

onMounted(async () => {
  Me.value = await me();
  contents.value = await recommendedDetail({ query: tag, type: type });

  console.log(contents.value);
});
</script>

<template>
  <Navbar :user-username="Me.username" :user-photo="Me.avatar" />
  <div
    class="grid grid-cols-1 lg:grid-cols-3 lg:max-w-6xl lg:mx-auto pt-10 px-6 md:px-8 gap-10 lg:gap-5"
  >
    <!-- Page Title -->
    <div class="lg:col-span-1 lg:sticky lg:top-0 lg:border-r-2 border-gray-100">
      <p class="sm:text-3xl text-xl font-semibold max-w-16">
        {{ tag }}
        <span
          >Recommended
          {{ type[0].toUpperCase() + type.slice(1, type.length) }}</span
        >
      </p>
    </div>

    <!-- Posts -->
    <div v-if="type == 'post'" className="lg:col-span-2 lg:max-w-[717px] ">
      <div v-for="post in contents" :key="post.id">
        <PostCard :authorUsername="post.authorUsername" :post="post" />
      </div>
    </div>

    <!-- List -->
    <div v-if="type == 'list'" className="lg:col-span-2 lg:max-w-[717px]">
      <div v-for="list in contents" :key="list.id">
        <div class="mb-5">
          <ListCard :authorUsername="list.username" :list="list" />
        </div>
      </div>
    </div>

    <!-- User -->
    <div v-if="type == 'user'" className="lg:col-span-2 lg:max-w-[717px]">
      <div v-for="user in contents" :key="user.id">
        <div class="mb-5">
          <!-- Card -->
          <div class="flex flex-col p-8 bg-white shadow-md rounded-md gap-5">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-4">
                <img
                  :src="user.avatar"
                  alt="avatar"
                  class="w-10 h-10 rounded-full"
                />
                <div class="flex flex-col">
                  <a
                    :href="'/profile/' + user.username"
                    class="text-lg font-semibold"
                    >{{ user.name }}</a
                  >
                  <a
                    :href="'/profile/' + user.username"
                    class="text-xs text-gray-500"
                    >{{ user.followerCount }} Followers</a
                  >
                </div>
              </div>
              <FollowButton
                v-if="user.id != Me.id"
                :followingId="user.id"
                :style="'text-sm font-medium bg-[#37823a] px-4 py-2 rounded-full text-white disabled:bg-[#37823a]/30 hover:bg-[#295d2a]'"
              />
            </div>

            <p class="text-sm text-gray-500">{{ user.bio }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
