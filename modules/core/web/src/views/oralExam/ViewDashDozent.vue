<template>
  <!-- Responsive content as grid base 2x2 -->
  <div class="container">
    <v-card class="card">
      <v-card-title class="card-title">
        <span>Prüfungen</span>
      </v-card-title>
      <v-card-subtitle class="card-subtitle">
        <span>Übersicht aller Schwierigkeitsgraden</span>
      </v-card-subtitle>
      <v-card-text class="card-text">
        <p>Hier geht es zur Prüfungsverwaltung.</p>
        <br />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="redirectToDozentCourses">ZU DEN PRÜFUNGEN</v-btn>
      </v-card-actions>
    </v-card>


    <v-card class="card">
      <v-card-title class="card-title">Feedback Abgeben</v-card-title>
      <v-card-subtitle class="card-subtitle">Feedback</v-card-subtitle>
      <v-card-text class="card-text"> In ihrem persönlich Dashboard behalten Sie immer die Übersicht. Hier können Sie ein
        Feedback abgeben. </v-card-text>
      <v-card-actions>
        <v-btn to="/feedbackReport">FEEDBACK EINREICHEN</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="card">
      <v-card-title class="card-title">Feedback einsehen</v-card-title>
      <v-card-text class="card-text"> Hier Sie alle von Nutzern eingereichtes Feedback. </v-card-text>
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

// Funktion um zu den Kursen des Dozenten weiterzuleiten
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
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);
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