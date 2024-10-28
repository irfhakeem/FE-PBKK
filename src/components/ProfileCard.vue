<script setup>
import { defineProps } from "vue";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

const props = defineProps({
  author: Object,
  userID: String,
});
</script>

<template>
  <HoverCard>
    <div className="flex gap-3 items-center mb-3">
      <HoverCardTrigger>
        <img src="" alt="" className="w-5 h-5 rounded-full" />
      </HoverCardTrigger>
      <HoverCardTrigger>
        <a href="" className="text-xs hover:underline flex items-center gap-2">
          <!-- {author.name}
              {author.verifiedAuthor && (
                <>
                  <CheckBadgeIcon className="w-4 h-auto fill-blue-600" />
                </>
              )} -->
        </a>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <img src="" alt="" className="w-14 h-14 rounded-full" />
            <!-- <FollowButton
              currentUserId="{currentUserId}"
              authorId="{author.id}"
              followUser="{follows}"
              custom="text-[12px] font-medium rounded-full px-3 py-2 bg-[#191919] text-white"
            /> -->
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <p className="font-semibold text-sm text-[#191919]">
                  {{ author.name }}
                </p>
                <!-- {author.verifiedAuthor && (
                      <>
                        <CheckBadgeIcon className="w-5 h-auto fill-blue-600" />
                      </>
                    )} -->
              </div>
              <p className="text-xs">{{ author.followers }} Followers</p>
            </div>
            <p className="text-xs text-gray-500">{{ author.bio }}</p>
          </div>
        </div>
      </HoverCardContent>
    </div>
  </HoverCard>
</template>
