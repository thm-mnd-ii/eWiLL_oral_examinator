
<template>
    <!-- Responsive content as grid base 2x2 -->
    <div class="container">
        <!-- Obere V-Cards -->
        <v-card class="card">
            <v-card-title class="card-title">
                <span>Alle Kurse</span>
            </v-card-title>
            <v-card-subtitle class="card-subtitle">
                <span>Auflistung aller verfübaren Kurse</span>
            </v-card-subtitle>
            <v-card-text class="card-text">
                <p>Hier siehst du alle Kurse die dir zur Verfügung stehen. Du kannst dich in jeden Kurs einschreiben und die
                    Kursinhalte nutzen.</p>
            </v-card-text>
            <v-card-actions class="card-action">
                <v-btn to="/">ZU DEN KURSEN</v-btn>
            </v-card-actions>
        </v-card>

        <v-card class="card">
            <v-card-title class="card-title">
                <span>Meine Kurse</span>
            </v-card-title>
            <v-card-subtitle class="card-subtitle">
                <span>Übersicht über deine Kurse</span>
            </v-card-subtitle>
            <v-card-text class="card-text">
                <p>Hier siehst du alle Kurse in denen du dieses Semester eingetragen bist.</p>
                <br />
            </v-card-text>

            <v-card-actions>
                <v-btn to="/">ZU MEINEN KURSEN</v-btn>
            </v-card-actions>
        </v-card>


        <v-card class="card">
            <v-card-title class="card-title">Feedback Abgeben</v-card-title>
            <v-card-subtitle class="card-subtitle"></v-card-subtitle>
            <v-card-text class="card-text"> Hier bieten wir dir die Möglichkeit, Feedback zu hinterlassen, falls du auf
                Probleme stößt oder Unterstützung benötigst.</v-card-text>
            <v-card-text class="text">
                <v-text-field class="custom-textarea" v-model="feedback.text"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-spacer>
                    <v-btn @click="sendFeedback">Abschicken</v-btn>
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

// .custom-textarea {
//   width: 100%;
//   height: 50px;
// }

.card-subtitle {
  color: rgb(var(--v-theme-primary-dark));
}

.newscard_title {
  color: rgb(var(--v-theme-primary-dark));
}
</style>
