<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container">
    <CoursesListStudent ref="coursesListStudent"></CoursesListStudent>
  </div>
  <DialogCreateCourse ref="dialogCreateCourse"></DialogCreateCourse>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import DialogCreateCourse from "../../dialog/DialogCreateCourse.vue";
import CoursesListStudent from "../../components/oralExaminator/CoursesListStudent.vue";
import { useAuthUserStore } from "../../stores/authUserStore";
import GlobalRoles from "../../enums/GlobalRoles";

const authUserStore = useAuthUserStore();
const router = useRouter();

const dialogCreateCourse = ref<typeof DialogCreateCourse>();
const coursesListStudent = ref<typeof CoursesListStudent>();

const isAdmin = ref(false);
const isUser = ref();

onMounted(() => {
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