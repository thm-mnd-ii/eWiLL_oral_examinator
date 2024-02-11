<template>
  <BasicBackground>
    <div class="course">
      <v-card>
        <v-card-title class="align-items-center">
          <h3 class="headline mb-0">{{ course?.name }}</h3>

          <v-spacer></v-spacer>

          <v-btn v-if="courseRole == 'OWNER'" variant="text" color="dark-gray" @click="editCourse">
            <v-icon size="x-large">mdi-cog</v-icon>
            <v-tooltip activator="parent" location="bottom">Kurs bearbeiten</v-tooltip>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <p>{{ course?.description }}</p>
          <br />
          <div class="align-items-center">
            <v-chip prepend-icon="mdi-account-circle" color="secondary" text-color="white" label> {{ courseRole }}
            </v-chip>
            <v-spacer></v-spacer>
          </div>
        </v-card-text>
      </v-card>

      <DialogConfirmVue ref="dialogConfirm"></DialogConfirmVue>
      <DialogEditTask ref="dialogCreateTask"></DialogEditTask>

      <!-- Karte für Fragenkatalog erstellen -->
      <v-card class="card" @click="openCreateQuestionDialog">
        <v-card-title class="title">Fragenkatalog erstellen</v-card-title>
        <v-card-text class="text">
          Hier können Sie einen neuen Fragenkatalog erstellen, um Prüfungen vorzubereiten.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="openCreateQuestionDialog">Erstellen</v-btn>
        </v-card-actions>
      </v-card>
      <ViewCreateQuestion ref="dialogCreateQuestion"></ViewCreateQuestion>

      <!-- Karte für Prüfungsergebnisse einsehen -->
      <v-card class="card" @click="navigateToViewResults">
        <v-card-title class="title">Prüfungsergebnisse einsehen</v-card-title>
        <v-card-text class="text">
          Hier können Sie Ihre Prüfungsergebnisse einsehen und analysieren.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="navigateToViewResults">Ansehen</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <DialogCreateCourse ref="dialogCreateCourse"></DialogCreateCourse>
  </BasicBackground>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthUserStore } from "../../stores/authUserStore";
import { useRouter } from "vue-router";

import TaskList from "../../components/TaskList.vue";
import CoursePL from "../../model/course/CoursePL";
import courseService from "../../services/course.service";

import DialogConfirmVue from "../../dialog/DialogConfirm.vue";
import DialogCreateCourse from "@/dialog/DialogCreateCourse.vue";
import DialogEditTask from "@/dialog/DialogEditTask.vue";
import BasicBackground from "@/components/BasicBackground.vue";
import ViewCreateQuestion from "../oralExam/ViewCreateQuestion.vue";


const route = useRoute();
const router = useRouter();
const authUserStore = useAuthUserStore();

const taskList = ref<typeof TaskList>();
const course = ref<CoursePL>();
// neuer Path
const courseId = ref(Number(route.params.createExamId));
const userId = ref(authUserStore.auth.user?.id);
const courseRole = ref("");

const dialogConfirm = ref<typeof DialogConfirmVue>();
const dialogCreateCourse = ref<typeof DialogCreateCourse>();
const dialogCreateTask = ref<typeof DialogEditTask>();
const dialogCreateQuestion = ref<typeof ViewCreateQuestion>();




onMounted(() => {
  courseService.getUserRoleInCourse(userId.value!, courseId.value).then((response) => {
    console.log( "test");
    if (response == "NONE") {
      router.push(route.path + "/signup");
    } else {
      courseRole.value = response;
      courseService.getCourse(courseId.value).then((response) => {
        course.value = response.data;
        if (taskList.value) {
          taskList.value.loadTasks(courseId.value);
        }
      });
    }
  });
});



const editCourse = () => {
  if (dialogCreateCourse.value) {
    dialogCreateCourse.value.openDialog(courseId.value).then(() => {
      courseService.getCourse(courseId.value).then((response) => {
        course.value = response.data;
      });
    });
  }
};



// Funktionen zur Navigation zu den entsprechenden Seiten
const navigateToCreateQuestionnaire = () => {
  console.log(route.path)
  router.push(route.path + '/createQuestion');
};

const navigateToViewResults = () => {
  router.push(route.path + '/view-results');
};


const openCreateQuestionDialog = () => {
   
  };





</script>

<style scoped>
.course {
  width: auto;
  margin: 20px 20px;
  display: flex;
  flex-direction: column;
  margin-top: -200px;

}

.task_list {
  margin-top: 30px;
}

.align-items-center {
  display: flex;
  align-items: center;
}

.card {
  width: 700px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  /* Ändern Sie den Mauszeiger in einen Zeiger, um anzuzeigen, dass die Karte klickbar ist */
}

.title {
  font-size: 2em;
  margin-bottom: 15px;
}

.text {
  font-size: large;
  margin-bottom: 20px;
}
</style>
