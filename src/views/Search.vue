<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { me } from "@/api/user/user.js";
import Navbar from "../components/Navbar.vue";
import { Search } from "@/api/search.js";
import Slider from "../components/Slider.vue";
import PostCard from "../components/PostCard.vue";
import ListCard from "../components/ListCard.vue";
import FollowButton from "../components/FollowButton.vue";

const isLoading = ref(true);
const route = useRoute();
const user = ref({});
var activeCategory = ref("Post");
const userQuery = ref(route.query.q);
const contents = ref([]);

onMounted(async () => {
  user.value = await me();

  if (userQuery.value) {
    const response = await Search({
      query: userQuery.value,
      type: activeCategory.value.toLowerCase(),
    });

    contents.value = response;
  }
  isLoading.value = false;
});

const fetchContents = async () => {
  const response = await Search({
    query: userQuery.value,
    type: activeCategory.value.toLowerCase(),
  });

  contents.value = response;
};

const setActiveCategory = async (category) => {
  isLoading.value = true;
  activeCategory.value = category;

  await fetchContents(); // Tunggu hingga `fetchContents` selesai

  console.log(activeCategory.value, contents.value); // Logging setelah `contents` diperbarui
  isLoading.value = false; // Set isLoading ke false setelah fetch selesai
};
</script>

<template>
  <Navbar :user-username="user.username" :user-photo="user.avatar" />

  <div class="flex flex-col lg:max-w-6xl lg:mx-auto pt-10 px-6 md:px-8">
    <p class="text-2xl md:text-4xl text-gray-500 font-semibold mb-6">
      Result for <span class="text-black">{{ userQuery }}</span>
    </p>

    <p v-if="userQuery == undefined">no query submitted</p>

    <!-- Slider -->
    <Slider
      :categories="['Post', 'User', 'List', 'Tag']"
      :activeCategory="activeCategory"
      @update:activeCategory="setActiveCategory"
    />

    <!-- User -->
    <div v-if="activeCategory == 'User' && !isLoading" className=" pt-6">
      <div v-if="contents.length !== 0" v-for="user in contents" :key="user.id">
        <div class="mb-5">
          <!-- Card -->
          <div class="flex p-8 bg-white gap-5 border-b-2 border-gray-100">
            <div
              class="flex md:flex-row flex-col md:justify-between justify-center items-end md:items-center w-full gap-5 md:gap-0"
            >
              <div class="flex items-center gap-4">
                <img
                  :src="user.avatar"
                  alt="avatar"
                  class="w-12 h-12 md:w-14 md:h-14 rounded-full"
                />
                <div class="flex flex-col gap-2">
                  <a
                    :href="'/profile/' + user.username"
                    class="text-lg font-semibold"
                    >{{ user.name }}</a
                  >
                  <a
                    :href="'/profile/' + user.username"
                    class="text-xs md:text-sm text-gray-500 text-medium max-w-xl"
                    >{{ user.bio }}</a
                  >
                </div>
              </div>
              <FollowButton
                :followingId="user.id"
                :style="'text-sm font-medium bg-[#37823a] px-4 py-2 rounded-full text-white disabled:bg-[#37823a]/30 hover:bg-[#295d2a]'"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <p>No user found</p>
      </div>
    </div>

    <!-- Post -->
    <div v-if="activeCategory == 'Post' && !isLoading" className=" pt-6">
      <div v-if="contents.length !== 0" v-for="post in contents" :key="post.id">
        <PostCard :authorUsername="post.authorUsername" :post="post" />
      </div>

      <div v-else>
        <p>No post found</p>
      </div>
    </div>

    <!-- List -->
    <div v-if="activeCategory == 'List' && !isLoading" class="pt-6">
      <div class="flex flex-col gap-5">
        <div
          v-if="contents.length !== 0"
          v-for="list in contents"
          :key="list.id"
        >
          <ListCard :authorUsername="list.username" :list="list" />
        </div>
      </div>
    </div>

    <!-- Tag -->
    <div v-if="activeCategory == 'Tag' && !isLoading" class="pt-6">
      <div class="flex flex-wrap gap-x-2 gap-y-4">
        <div v-if="contents.length !== 0" v-for="tag in contents" :key="tag.id">
          <a
            :href="'/tag/' + tag.name"
            class="bg-[#f2f2f2] rounded-full px-6 py-3 text-base font-medium"
            >{{ tag.name }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
