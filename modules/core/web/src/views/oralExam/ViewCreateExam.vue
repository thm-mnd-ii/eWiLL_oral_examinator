<template>
  <BasicBackground>
    <div class="course">
      <v-card>
        <v-card-title class="align-items-center">
          <h3 class="headline mb-0">{{ course?.name }}!</h3>

          <v-spacer></v-spacer>

          <v-btn v-if="courseRole == 'OWNER'" variant="text" color="dark-gray" @click="openMembersView">
            <v-icon size="x-large">mdi-account-group</v-icon>
            <v-tooltip activator="parent" location="bottom">Teilnehmer</v-tooltip>
          </v-btn>

          <v-btn variant="text" color="dark-gray" @click="editCourse">
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

      <br />
      <br />
      <br />

      <!-- Karte für Fragenkatalog erstellen -->
      <v-card class="card" @click="navigateToCreateQuestionnaire">
        <v-card-title class="title">Fragenkatalog erstellen</v-card-title>
        <v-card-text class="text">
          Hier können Sie einen neuen Fragenkatalog erstellen, um Prüfungen vorzubereiten.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="navigateToCreateQuestionnaire">Erstellen</v-btn>
        </v-card-actions>
      </v-card>

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
  </BasicBackground>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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

onMounted(() => {
  courseService.getUserRoleInCourse(userId.value!, courseId.value).then((response) => {
    console.log( "test")
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

const leaveCourse = () => {
  if (dialogConfirm.value) {
    dialogConfirm.value.openDialog(`Verlasse Kurs: ${course.value?.name}`, "Willst du den Kurs wirklich verlassen?", "Verlassen").then((result: boolean) => {
      if (result) {
        courseService
          .leaveCourse(courseId.value, userId.value)
          .then(() => {
            router.push("/");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }
};

const editCourse = () => {
  console.log(route.params.createExamId);
  console.log("test");
  if (dialogCreateCourse.value) {
    dialogCreateCourse.value.openDialog(courseId.value).then(() => {
      courseService.getCourse(courseId.value).then((response) => {
        course.value = response.data;
      });
    });
  }
};

const createTask = () => {
  if (dialogCreateTask.value) {
    dialogCreateTask.value.openDialog().then(() => {
      taskList.value!.loadTasks(courseId.value);
    });
  }
};

const openMembersView = () => {
  router.push(route.path + "/members");
};

// Funktionen zur Navigation zu den entsprechenden Seiten
const navigateToCreateQuestionnaire = () => {
  router.push('/create-questionnaire');
};

const navigateToViewResults = () => {
  router.push('/view-results');
};
</script>

<style scoped>
.course {
  width: auto;
  margin: 20px 20px;
  display: flex;
  flex-direction: column;
  margin-top: -250px;

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
