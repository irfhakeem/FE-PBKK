<script setup lang="ts">
import { cn } from '@/lib/utils'
import { TagsInputItem, type TagsInputItemProps, useForwardProps } from 'radix-vue'

import { computed, type HTMLAttributes } from 'vue'

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItem v-bind="forwardedProps" :class="cn('flex h-6 items-center rounded bg-slate-100 data-[state=active]:ring-slate-950 data-[state=active]:ring-2 data-[state=active]:ring-offset-2 ring-offset-white dark:bg-slate-800 dark:data-[state=active]:ring-slate-300 dark:ring-offset-slate-950', props.class)">
    <slot />
  </TagsInputItem>
</template>
