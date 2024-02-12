<template>
  <BasicBackground> 
    <v-card class="card">
      <v-card-title class="title">
        <span>Oral Examinator</span>

        <!-- <span> <IconEWiLL /> </span> -->
      </v-card-title>
      <v-card-text class="text"> Herzlich willkommen auf Oral Examinator, deiner Plattform für simulierte mündliche Prüfungen im Fach Datenmanagement. Wir bieten dir eine einzigartige Möglichkeit, dein Wissen zu testen und deine mündlichen Präsentationsfähigkeiten zu schärfen. </v-card-text>
      <v-card-actions>
        <v-spacer>
          <v-btn v-if="isAdmin" variant="flat" color="primary-dark" to="/dashDozent"> Hier geht's zu deinem Dashboard </v-btn>
          <v-btn v-if="isUser" variant="flat" color="primary-dark" to="/dashStudent"> Hier geht's zu deinem Dashboard </v-btn>
        </v-spacer>
      </v-card-actions>
    </v-card>
  </BasicBackground>
</template>

<script setup lang="ts">
import { useAuthUserStore } from "../stores/authUserStore";
import BasicBackground from '@/components/BasicBackground.vue';
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import GlobalRoles from "@/enums/GlobalRoles";

const authUserStore = useAuthUserStore();
const isAdmin = ref(false);
const isUser = ref(false);

onMounted(() => {
isUser.value = authUserStore.user?.roles.includes(GlobalRoles.ROLE_USER)!;
isAdmin.value = authUserStore.user?.roles.includes(GlobalRoles.ROLE_ADMIN)!;

});
</script>

<style scoped lang="scss">

.card {
  width: 700px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: xx-large;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(1, 1fr);
  align-items: center;
  justify-items: stretch;
  margin-bottom: 15px;
}

.text {
  font-size: large;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(1, 1fr);
  align-items: center;
  justify-items: stretch;
}
</style>