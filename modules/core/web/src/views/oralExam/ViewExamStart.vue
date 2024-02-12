<template>
  <BasicBackground>
    <!-- Responsiver Inhalt als Gitter im 2x2-Layout -->
    <div class="container">
      <!-- Karte für Oral Examinator starten -->
      <v-card class="card">
        <v-card-title class="card-title">
          <h2 class="display-1 mb-4">Oral Examinator starten</h2>
        </v-card-title>
        <v-card-text class="card-text">
          <h3 class="headline mb-0">{{ course?.name }}</h3> <!-- Hier wird der Name des Kurses angezeigt -->
          <p>{{ course?.description }}</p> <!-- Hier wird die Beschreibung des Kurses angezeigt -->
        </v-card-text>
        <v-card-actions class="card-action">
          <v-btn class="start-btn" color="primary" @click="startOralExaminator">STARTEN</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </BasicBackground>
</template>


<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthUserStore } from "../../stores/authUserStore";
import { useRouter } from "vue-router";
import BasicBackground from "@/components/BasicBackground.vue";
import CoursePL from "../../model/course/CoursePL";
import courseService from "../../services/course.service";


const route = useRoute();
const router = useRouter();
const authUserStore = useAuthUserStore();

const course = ref<CoursePL>();
const courseId = ref(Number(route.params.examId));

//beim klick navigiere zur Prüfung
const startOralExaminator = () => { 
    router.push(route.path + '/' + course.value?.description);
};

 onMounted(() => {
    fetchCourseData(); // Hier wird die Methode beim Komponentenmount aufgerufen
});

const fetchCourseData = () => {
    courseService.getCourse(courseId.value)
        .then((response) => {
          // Kursdaten erfolgreich erhalten
          course.value = response.data; // Speichern der Kursdaten im Ref
          console.log("Kursdaten erhalten:", course.value);
        })
        .catch((error) => {
          // Fehler beim Abrufen der Kursdaten
          console.error("Fehler beim Abrufen der Kursdaten:", error);
        });
}

</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Die Karte wird auf die gesamte Bildschirmhöhe zentriert */
  padding-bottom: 50vh; 
}

.card {
  width: 80%; 
  max-width: 500px; /* Maximale Breite der Karte setzen */
  padding: 2rem; 
}

.card-title {
  text-align: center; /* Titel zentrieren */
  font-size: 1.5rem; 
}

.card-text {
  color: #333;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 15px;
}

.card-action {
  display: flex;
  justify-content: center;
}

.start-btn {
  width: 100%; /* Button auf volle Breite der Karte setzen */
  font-size: 1.2rem; 
}
</style>