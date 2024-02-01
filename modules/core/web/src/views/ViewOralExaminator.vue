<template>
    <div>
      <BasicBackground>
        <v-card class="card">
          <v-card-title class="title">
            <span>
              <!-- Hier könnte dein Quiz-Icon stehen -->
            </span>
            <br />
            <span>Quiz Title</span>
          </v-card-title>
          <v-card-text class="text">Welcome to the Quiz! Test your knowledge.</v-card-text>
          <!-- Hier könnten die Quizfragen und Antwortmöglichkeiten eingefügt werden -->
          <v-card-actions>
            <v-btn color="primary-dark" variant="flat" @click="startQuiz">Start Quiz</v-btn>
          </v-card-actions>
        </v-card>
      </BasicBackground>
    </div>
  </template>
  
  <script setup lang="ts">
  import BasicBackground from "@/components/BasicBackground.vue";
  
  const startQuiz = () => {
    // Logik zum Starten des Quiz
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
  