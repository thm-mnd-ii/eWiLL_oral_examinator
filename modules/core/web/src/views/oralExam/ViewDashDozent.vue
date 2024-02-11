
<template>
  <!-- Responsive content as grid base 2x2 -->
  <div class="container">
    <v-card class="card">
      <v-card-title class="card-title">
        <span>Prüfungen</span>
      </v-card-title>
      <v-card-subtitle class="card-subtitle">
        <span>Übersicht aller Schwierigkeitsgeraden</span>
      </v-card-subtitle>
      <v-card-text class="card-text">
        <p>Hier sehen Sie alle Prüfungen, um die Prüfungen zu verwalten.</p>
        <br />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="redirectToDozentCourses">ZU DEN PRÜFUNGEN</v-btn>
      </v-card-actions>
    </v-card>


    <v-card class="card">
      <v-card-title class="card-title">Feedback Abgeben</v-card-title>
      <v-card-subtitle class="card-subtitle">Bewertung | Feedback | Lernstand | Aktivität</v-card-subtitle>
      <v-card-text class="card-text"> In ihrem persönlich Dashboardbehalten Sie immer die Übersicht. Hier werden Ihnen
        alle Informationen zu Bewertungen, Feedback, Lernstand oder Aktivität angezeigt. </v-card-text>
      <v-card-actions>
        <v-btn to="/feedbackReport">FEEDBACK EINREICHEN</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="card">
      <v-card-title class="card-title">Feedback einsehen</v-card-title>
      <v-card-text class="card-text"> Hier Sie alle von Nutzern eingereichtes Feedback </v-card-text>
      <v-card-actions>
        <v-btn to="/feedbackOverview">FEEDBACK EINSEHEN</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">

import { useRoute} from "vue-router";
import {useRouter} from 'vue-router';


const route = useRoute();
const router = useRouter();

// Function to redirect to student page
const redirectToDozentCourses = () => {
  router.push( route.path + '/coursesDozent');
};
</script>

<style scoped lang="scss">
.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 2rem;
  column-gap: 1.5rem;
  grid-template-areas:
    "card card"
    "card card";
  padding: 2.5rem 2rem;
  background-color: rgb(var(--v-theme-primary));
}

.card {
  // fit to parent
  width: 100%;
  height: 100%;
  // center content
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  padding-bottom: 0;
}

.card-subtitle {
  color: rgb(var(--v-theme-primary-dark));
}

.newscard_title {
  color: rgb(var(--v-theme-primary-dark));
}
</style>
