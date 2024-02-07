
<template>
  <!-- Responsiver Inhalt als Gitter im 2x2-Layout -->
  <div class="container">
    <!-- Obere V-Karten -->
    <v-card class="card">
      <v-card-title class="card-title">
        <span>Alle Prüfungen</span>
      </v-card-title>
      <v-card-subtitle class="card-subtitle">
        <span>Übersicht aller verfügbaren Prüfungen</span>
      </v-card-subtitle>
      <v-card-text class="card-text">
        <p>Hier findest du eine Auflistung aller verfügbaren Prüfungen.</p>
      </v-card-text>
      <v-card-actions class="card-action">
        <v-btn @click="redirectToDozentCourses">ZU DEN PRÜFUNGEN</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="card">
      <v-card-title class="card-title">
        <span>Meine Prüfungsergebnisse</span>
      </v-card-title>
      <v-card-subtitle class="card-subtitle">
        <span>Übersicht deiner abgeschlossenen Prüfungen</span>
      </v-card-subtitle>
      <v-card-text class="card-text">
        <p>Hier findest du einen Überblick über alle deine Prüfungsergebnisse des aktuellen Semesters.</p>
      </v-card-text>

      <v-card-actions>
        <v-btn to="/">ZU MEINEN ERGEBNISSEN</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="card">
      <v-card-title class="card-title">Feedback hinterlassen</v-card-title>
      <v-card-subtitle class="card-subtitle"></v-card-subtitle>
      <v-card-text class="card-text">Hier hast du die Möglichkeit, Feedback zu geben, falls du auf Probleme stößt oder
        Unterstützung benötigst.</v-card-text>
      <v-card-text class="text">
        <v-text-field class="custom-textarea" v-model="feedback.text"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer>
          <v-btn @click="sendFeedback">Absenden</v-btn>
        </v-spacer>
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="snackbarSuccess" :timeout="2500"> Vielen Dank für dein Feedback!</v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Feedback from "@/model/Feedback";
import User from "../../model/User";
import feedbackService from "../../services/feedback.service";
import BasicBackground from "@/components/BasicBackground.vue";
import { useAuthUserStore } from "@/stores/authUserStore";
import {useRouter} from 'vue-router';


const router = useRouter();

const authUserStore = useAuthUserStore();

const feedback = ref<Feedback>({} as Feedback);
const snackbarSuccess = ref(false);

const sendFeedback = () => {
  const user: User = authUserStore.user as User;
  feedback.value.firstName = user.username;
  feedback.value.lastName = user.email;

  feedbackService.createFeedback(feedback.value).then(() => {
    snackbarSuccess.value = true;
    feedback.value = {} as Feedback;
  });

};
const redirectToDozentCourses = () => {
router.push({ path: '/testLogin/dashStudent/examListStudent'});
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
  width: 100%;
  height: 100%;
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

.custom-textarea {
  width: 100%;
}

.newscard_title {
  color: rgb(var(--v-theme-primary-dark));
}
</style>

