<template>
  <div class="container">
    <h2>Prüfungsfragen</h2>
    <v-row>
      <v-col cols="12" v-for="(frage, index) in fragenText" :key="frage.id">
        <v-card class="mb-3">
          <v-card-title>
            {{ index + 1 }}. Frage: {{ frage.frage }}
          </v-card-title>
          <v-card-text>
            <a :href="fragenUrl[index].videoUrl" target="_blank">Video ansehen</a>
            <div class="stichpunkte-container">
              <v-chip v-for="(stichpunkt, idx) in stichpunkte[index].loesungen" :key="idx" class="ma-2" outlined
                color="primary">
                {{ stichpunkt }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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

const fragenText = ref(Fragenkatalog.dataStufe1().fragenText);
const fragenUrl = ref(Fragenkatalog.dataStufe1().pruefungsFragen);
const stichpunkte = ref(Fragenkatalog.dataStufe1().stichpunkte);

onMounted(() => {
    fetchCourseData();
});

const fetchCourseData = () => {
  courseService.getCourse(courseId.value)
    .then((response) => {
      course.value = response.data;
      const description = course.value?.description;

      if (description === "Leicht") {
        fragenText.value = Fragenkatalog.dataStufe1().fragenText;
        fragenUrl.value = Fragenkatalog.dataStufe1().pruefungsFragen;
        stichpunkte.value = Fragenkatalog.dataStufe1().stichpunkte;
      } else if (description === "Mittel") {
        fragenText.value = Fragenkatalog.dataStufe2().fragenText;
        fragenUrl.value = Fragenkatalog.dataStufe2().pruefungsFragen;
        stichpunkte.value = Fragenkatalog.dataStufe2().stichpunkte;
      } else if (description === "Schwer") {
        fragenText.value = Fragenkatalog.dataStufe3().fragenText;
        fragenUrl.value = Fragenkatalog.dataStufe3().pruefungsFragen;
        stichpunkte.value = Fragenkatalog.dataStufe3().stichpunkte;
      } else {
        console.error("Ungültige Beschreibung:", description);
      }
    })
    .catch((error) => {
      console.error("Fehler beim Abrufen der Kursdaten:", error);
    });
};
</script>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.mb-3 {
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);
  margin-bottom: 20px;
}

.stichpunkte-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* Vuetify classes */
.ma-2 {
  margin: 8px;
}
</style>