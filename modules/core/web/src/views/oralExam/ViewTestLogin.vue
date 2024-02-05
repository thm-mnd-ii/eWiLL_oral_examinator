<template>
  <div>
    <BasicBackground>
      <v-card class="card">
        <v-card-title class="title">
          <span>
            <!-- Hier könnte dein Quiz-Icon stehen -->
          </span>
          <br />
          <span>Oral Examinator</span>
        </v-card-title>
        <v-card-text class="text">Wähle deine Rolle</v-card-text>
        <!-- Buttons for selecting role -->
        <v-card-actions>
          <v-btn color="primary-dark" variant="flat" @click="redirectToStudent">Student</v-btn>
          <v-btn color="primary-dark" variant="flat" @click="redirectToDozent">Dozent</v-btn>
        </v-card-actions>
      </v-card>
    </BasicBackground>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import BasicBackground from "@/components/BasicBackground.vue";

const router = useRouter();

// Function to redirect to student page
const redirectToStudent = () => {
  router.push({ path: '/testLogin/dashStudent' });
};

// Function to redirect to dozent page
const redirectToDozent = () => {
  router.push({ path: '/testLogin/dashDozent' });
};
</script>

<style scoped lang="scss">
.card {
  width: 700px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 4em;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(1, 1fr);
  align-items: center;
  justify-items: stretch;
  margin-bottom: 15px;
}

.text {
  font-size: large;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(1, 1fr);
  align-items: center;
  justify-items: stretch;
}
</style>
