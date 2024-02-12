<!-- eslint-disable vue/valid-v-slot -->
<template>
  <!-- Container für die Liste der Kurse eines Studenten -->
  <div class="container">
    <CoursesListStudent ref="coursesListStudent"></CoursesListStudent>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import CoursesListStudent from "../../components/oralExaminator/CoursesListStudent.vue";
import { useAuthUserStore } from "../../stores/authUserStore";
import GlobalRoles from "../../enums/GlobalRoles";

// Authentifizierung Benutzer Store
const authUserStore = useAuthUserStore();
// Referenz auf die Liste der Kurse eines Studenten
const coursesListStudent = ref<typeof CoursesListStudent>();

const isAdmin = ref(false);
const isUser = ref();

onMounted(() => {
  // Lädt die Prüfungen des Studenten
  coursesListStudent.value?.loadCourses();

  isAdmin.value = authUserStore.user?.roles.includes(GlobalRoles.ROLE_ADMIN)!;
  isUser.value = authUserStore.user?.roles.includes(GlobalRoles.ROLE_USER);
});


</script>

<style scoped lang="scss">
#createCourseBtn {
  margin: 0 auto;
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

.container {
  width: auto;
  margin: 20px 20px;
}
</style>