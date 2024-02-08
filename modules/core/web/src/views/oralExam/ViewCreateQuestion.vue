<template>
    <v-dialog v-model="questionDialog" width="70%">
      <v-card>
        <v-card-title>
          <span v-if="newQuestion">Neue Frage erstellen</span>
          <span v-if="!newQuestion">Frage bearbeiten: {{ question.text }}</span>
        </v-card-title>
        <v-form ref="form" v-model="valid" @submit.prevent>
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field 
                v-model="question.text" color="primary" variant="underlined" label="Text"
                  :rules="[(v: any) => !!v || 'Item is required']" required></v-text-field>
                <v-text-field 
                v-model="question.link" color="primary" variant="underlined" label="Link"></v-text-field>
                <v-select 
                v-model="question.course_id" color="primary" variant="underlined" label="Kurs"
                  :items="courses" item-text="name" item-value="id" ></v-select>
                <v-text-field v-model="solutionInput" color="primary" variant="underlined" label="Lösung" hint="Mehrere Lösungen durch Kommas trennen"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="card-actions">
            <v-btn v-if="!newQuestion" color="error" variant="flat" @click="deleteQuestion">Frage löschen</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="flat" @click="_cancel">Abbrechen</v-btn>
            <v-btn v-show="!loading" color="primary" variant="flat" type="submit" @click="_confirm">Speichern</v-btn>
            <v-progress-circular v-if="loading" color="primary" indeterminate size="40"></v-progress-circular>
          </v-card-actions>
        </v-form>
      </v-card>
      <v-snackbar v-model="snackbarFail" :timeout="2500">Fehler beim Speichern der Frage, bitte versuchen Sie es erneut</v-snackbar>
    </v-dialog>
    <DialogConfirmVue ref="dialogConfirm"></DialogConfirmVue>
  </template>
  
  <script setup lang="ts">
  import { watch, ref } from "vue";
  import questionService from "../../services/question.service";
  import Question from "../../model/oral_examinator/Question";
  import DialogConfirmVue from "../../dialog/DialogConfirm.vue";
  import { useRouter } from "vue-router";
  
  const questionDialog = ref<boolean>(false);
  const dialogTitle = ref<string>("");
  
  const dialogConfirm = ref<typeof DialogConfirmVue>();
  const router = useRouter();
  
  const newQuestion = ref(true);
  const question = ref<Question>({} as Question);
  const courses = ref<any[]>([]); // Placeholder for courses, replace with actual course data
  
  const snackbarFail = ref(false);
  const loading = ref(false);
  const valid = ref();
  
  const resolvePromise: any = ref(undefined);
  const rejectPromise: any = ref(undefined);
  
   const openDialog = (questionId: number | undefined) => {
  loading.value = false;
  if (questionId === undefined) {
    newQuestion.value = true;
    initializeDialogForNewQuestion();
  } else {
    newQuestion.value = false;
    initializeDialogForEditingQuestion(questionId);
  }
  questionDialog.value = true;

  return new Promise((resolve, reject) => { // Korrigiert: Parameter der Promise-Funktion korrekt getrennt
    resolvePromise.value = resolve;
    rejectPromise.value = reject;
  });
};
  
  watch(questionDialog, (newVal) => {
    if (newVal) {
      if (!newQuestion.value && question.value.id) {
        initializeDialogForEditingQuestion(question.value.id);
      }
    } else {
      resetDialog();
    }
  });
  
  const resetDialog = () => {
    question.value = {} as Question;
    valid.value = false;
  };
  
  const initializeDialogForNewQuestion = () => {
    dialogTitle.value = "Neue Frage erstellen";
  };
  
  const initializeDialogForEditingQuestion = (questionId: number) => {
    // Fetch question data using questionId and populate the question object
    // For example:
    // questionService.getQuestion(questionId).then((response) => {
    //   question.value = response.data;
    // });
    dialogTitle.value = "Frage bearbeiten: ";
  };
  
  const _confirm = async () => {
    loading.value = true;
  
    if (valid.value) {
      // Process solution input
      if (solutionInput.value) {
        question.value.solution = solutionInput.value.split(",");
      }
  
      if (newQuestion.value) {
        questionService
          .createQuestion(question.value)
          .then((response) => {
            questionDialog.value = false;
            resolvePromise.value(response.data.id);
          })
          .catch((error) => {
            snackbarFail.value = true;
            console.log(error);
          });
      } else {
        questionService
          .updateQuestion(question.value)
          .then((response) => {
            questionDialog.value = false;
            resolvePromise.value(response.data.id);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  
    setTimeout(() => {
      loading.value = false;
    }, 1000);
  };
  
  const _cancel = () => {
    questionDialog.value = false;
    resolvePromise.value(undefined);
  };
  
  const deleteQuestion = () => {
    if (dialogConfirm.value) {
      dialogConfirm.value
        .openDialog(`Frage löschen: ${question.value.text}`, "Möchten Sie diese Frage wirklich löschen?")
        .then((result: boolean) => {
          if (result) {
            questionService
              .deleteQuestion(question.value.id)
              .then(() => {
                questionDialog.value = false;
                resolvePromise.value(question.value.id);
                router.push("/questions");
              })
              .catch((error) => {
                console.log(error);
              });
          }
        });
    }
  };
  
  const solutionInput = ref(""); // Input for solution
  defineExpose({
  openDialog
});
  
  </script>
  
  <style scoped>
  .card-actions {
    padding: 1rem;
  }
  </style>