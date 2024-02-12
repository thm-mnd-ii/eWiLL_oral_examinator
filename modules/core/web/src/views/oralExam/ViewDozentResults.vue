<template>
    <div>
        <h2>Prüfungsergebnisse</h2>
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Punkte</th>
                    <th>Status</th>
                    <th>Datum</th>
                    <th>Stufe</th>
                    <th>Feedback</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ergebnis, index) in ergebnisse" :key="index">
                    <td>{{ ergebnis.username }}</td>
                    <td>{{ ergebnis.punkte }}</td>
                    <td>{{ ergebnis.status }}</td>
                    <td>{{ ergebnis.datum }}</td>
                    <td>{{ ergebnis.stufe }}</td>
                    <td class="feedback">{{ ergebnis.feedback }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Fragenkatalog } from "./Fragenkatalog";
import { useRoute } from "vue-router";
import courseService from "../../services/course.service";
import CoursePL from "../../model/course/CoursePL";

const route = useRoute();
const course = ref<CoursePL>();
const courseId = ref(Number(route.params.createExamId));


onMounted(() => {
    fetchCourseData(); // Hier wird die Methode beim Komponentenmount aufgerufen
});

// übergeben der aktuellen Prüfungsdaten
const fetchCourseData = () => {
  courseService.getCourse(courseId.value)
    .then((response) => {
      // Successfully received course data
      course.value = response.data; // Save the course data in the ref
      console.log("Kursdaten erhalten:", course.value);
      const description = course.value?.description;

      // Filter ergebnisse based on description
      if (description === "Leicht") {
        ergebnisse.value = Fragenkatalog.dataStufe1().ergebnisse;
      } else if (description === "Mittel") {
        ergebnisse.value = Fragenkatalog.dataStufe2().ergebnisse;
      } else if (description === "Schwer") {
        ergebnisse.value = Fragenkatalog.dataStufe3().ergebnisse;
      } else {
        console.error("Ungültige Beschreibung:", description);
      }
    })
    .catch((error) => {
      // Error fetching course data
      console.error("Fehler beim Abrufen der Kursdaten:", error);
    });
};

const ergebnisse = ref(Fragenkatalog.dataStufe1().ergebnisse);
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.feedback {
    max-width: 100px;
    /* Hier kannst du die Breite nach Bedarf anpassen */
    word-wrap: break-word;
}
</style>
