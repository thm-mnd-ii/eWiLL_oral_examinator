<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container">
    <v-data-table :headers="headers" :items="displayedCourses" item-value="name" class="elevation-1" :search="search"
      density="default" height="480px" @click:row="openCourseOrSignUp">
      <template #item.item.course="{ item }">
        <v-icon v-if="item.course.active == false" icon="mdi-close-circle" color="error"></v-icon>
        <v-icon v-if="item.course.active == true" icon="mdi-check-circle" color="success"></v-icon>
      </template>
      <template #item.item.member="{ item }">
        <v-icon v-if="item.member == true" icon="mdi-check-bold" color="success"></v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthUserStore } from "../../stores/authUserStore";
import CourseAndParticipationPL from "@/model/course/CourseAndParticipationPL";
import courseService from "../../services/course.service";



const route = useRoute();
const router = useRouter();
const authUserStore = useAuthUserStore();

const search = ref("");
const headers = [
  { title: "Semester", align: "start", key: "course.semester.name" },
  { title: "Aktiv", align: "start", key: "course.active" },
  { title: "Prüfungen", align: "start", key: "course.name" },
  { title: "Standort", align: "start", key: "course.location" },
  { title: "Teilnahme", align: "start", key: "member" },
];

// Courses lists
const displayedCourses = ref<CourseAndParticipationPL[]>([]);
const allCourses = ref<CourseAndParticipationPL[]>([]);


const loadCourses = () => {
  let userId = authUserStore.auth.user?.id;
  console.log(authUserStore);
  if (userId != undefined) {
    courseService
      .getAllCourses(userId)
      .then((data) => {
        // Filtern der Kurse nach dem Kursnamen "Datenbank"
        const databaseCourses = data.filter(course => course.course.name.startsWith("Datenmanagement (Stufe"));
        allCourses.value = databaseCourses;
        displayedCourses.value = allCourses.value;
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("userId is undefined");
  }
};



// id abfangen
const openCourseOrSignUp = (row: any, item: any) => {
  let roleId = authUserStore.auth.user?.roles[0]; // Greife auf den ersten Eintrag im Array zu
  
  if (item.item.member == false) router.push(route.path +'/' + item.item.course.id+ "/signupDozent");

  else router.push(route.path + '/' + item.item.course.id);
}; 






defineExpose({
  loadCourses,
});
</script>

<style scoped lang="scss">
.container {
  width: auto;
  margin: 20px 20px;
}

.search-bar {
  margin-bottom: 20px;
}
</style>