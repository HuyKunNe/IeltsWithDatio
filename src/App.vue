<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <n-config-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <Header />
            <HeroSection />
            <BenefitsSection />
            <DemoTestSection />
            <TestimonialsSection />
            <BigCTASection />
            <FooterSection />
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
import HeroSection from "./components/HeroSection.vue";
import BenefitsSection from "./components/BenefitsSection.vue";
import DemoTestSection from "./components/DemoTestSection.vue";
import TestimonialsSection from "./components/TestimonialsSection.vue";
import BigCTASection from "./components/BigCTASection.vue";
import FooterSection from "./components/FooterSection.vue";
</script>

<style>
#app {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}
</style>
