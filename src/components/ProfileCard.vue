<script setup>
import { defineProps } from "vue";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import FollowButton from "./FollowButton.vue";

const props = defineProps({
  author: Object,
});
</script>

<template>
  <HoverCard>
    <div className="flex gap-3 items-center">
      <HoverCardTrigger>
        <img
          :src="props.author.avatar"
          alt=""
          className="w-5 h-5 rounded-full"
        />
      </HoverCardTrigger>
      <HoverCardTrigger>
        <a href="" className="text-xs hover:underline flex items-center gap-2">
          {{ author.name }}
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <img
              :src="props.author.avatar"
              alt=""
              className="w-14 h-14 rounded-full"
            />
            <FollowButton
              :followingId="author.id"
              :style="'text-[12px] font-medium rounded-full px-3 py-2 bg-[#191919] text-white'"
            />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-sm text-[#191919]">
                {{ author.name }}
              </p>
              <p className="text-xs">{{ author.followers }} Followers</p>
            </div>
            <p className="text-xs text-gray-500">{{ author.bio }}</p>
          </div>
        </div>
      </HoverCardContent>
    </div>
  </HoverCard>
</template>
