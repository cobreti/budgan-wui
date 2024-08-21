<template>
    <v-toolbar>
      <div class="dflex w-100 flex-row flex-content justify-space-between">
<!--        <div class="ml-4 mr-4">-->
<!--        </div>-->
<!--        <div class="ml-4 mr-4">-->
<!--          <a @click="$router.go(-1)">-->
<!--            <v-icon-->
<!--              size="Large"-->
<!--              icon="mdi-chevron-left"></v-icon>-->
<!--          </a>-->
<!--        </div>-->
<!--        <div>-->
<!--          <v-btn-->
<!--            flat-->
<!--            :to="{path: 'add-statement', replace: true}"-->
<!--            @click="addStatement">-->
<!--            <v-icon-->
<!--              size="24"-->
<!--              icon="mdi-file-upload-outline"></v-icon>-->
<!--            add statement-->
<!--          </v-btn>-->
<!--        </div>-->
        <div class="mr-4 ml-4">
          <span class="font-weight-bold">account : </span>
          <span class="pl-2">{{accountId}}</span>
        </div>
        <div class="mr-4 ml-4">
          <slot />
        </div>
      </div>
    </v-toolbar>
</template>


<style scoped>
  .flex-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { computed } from 'vue'

  const route = useRoute();

  const accountId = computed(() => {
    return route.params.id as string;
  });
</script>