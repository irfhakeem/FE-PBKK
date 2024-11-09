<script setup>
import { ref, onMounted, watch } from "vue";
import { followUser, unfollowUser, isFollowing } from "@/api/user/user.js";

const props = defineProps({
  followingId: String,
  style: String,
});

var following = ref(false);

onMounted(async () => {
  following.value = await isFollowing(props.followingId);
});

watch(
  () => props.followingId,
  async (newFollowingId) => {
    if (newFollowingId) {
      following.value = await isFollowing(newFollowingId);
    }
  }
);

const followHandler = async () => {
  try {
    await followUser(props.followingId);
    following.value = true;
  } catch (error) {
    console.log(error);
  }
};

const unfollowHandler = async () => {
  try {
    await unfollowUser(props.followingId);
    following.value = false;
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <button v-if="following" :class="style" @click="unfollowHandler">
    Unfollow
  </button>
  <button v-if="!following" :class="style" @click="followHandler">
    Follow
  </button>
</template>
