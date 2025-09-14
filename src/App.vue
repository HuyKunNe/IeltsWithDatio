<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <n-config-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <Header v-if="showHeader" />
            <router-view />
            <FooterSection v-if="showFooter" />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
} from "naive-ui";
import Header from "./components/Header.vue";
import FooterSection from "./components/FooterSection.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const showHeader = computed(
  () => !["Login", "Register"].includes(route.name as string)
);
const showFooter = computed(
  () => !["Login", "Register"].includes(route.name as string)
);
</script>

<style>
#app {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
</style>
