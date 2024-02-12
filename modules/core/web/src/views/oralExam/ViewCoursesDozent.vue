<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div class="container">
    <CoursesListDozent ref="coursesListDozent"></CoursesListDozent>
    <v-btn v-if="isAdmin" id="createCourseBtn" color="primary-dark" @click="createCourse">Kurs erstellen</v-btn>
  </div>
  <DialogCreateCourse ref="dialogCreateCourse"></DialogCreateCourse>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import DialogCreateCourse from "../../dialog/DialogCreateCourse.vue";
import CoursesListDozent from "../../components/oralExaminator/CoursesListDozent.vue";
import { useAuthUserStore } from "../../stores/authUserStore";
import GlobalRoles from "../../enums/GlobalRoles";

const authUserStore = useAuthUserStore();
const router = useRouter();
const route = useRoute();

const dialogCreateCourse = ref<typeof DialogCreateCourse>();
const coursesListDozent = ref<typeof CoursesListDozent>();

const isAdmin = ref(false);
const isUser = ref();

onMounted(() => {
  coursesListDozent.value?.loadCourses();

  isAdmin.value = authUserStore.user?.roles.includes(GlobalRoles.ROLE_ADMIN)!;
  isUser.value = authUserStore.user?.roles.includes(GlobalRoles.ROLE_USER);
});

const createCourse = () => {
  console.log(route.path)
  if (dialogCreateCourse.value) {
    dialogCreateCourse.value.openDialog().then((id: number) => {
      if (id != undefined) router.push(route.path + "/"  + id);
    });
  }
};
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