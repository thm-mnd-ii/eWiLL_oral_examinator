<template>
  <v-dialog width="500">
    <v-card>
      <v-card-title>Fragen verwalten</v-card-title>

      <v-card-text>
        Bitte generiere Fragen mit den Links aus <a href="www.link.de">www.link.de</a>.
      </v-card-text>

      <v-card-text>
        <v-text-field v-model="link" label="Link" outlined></v-text-field>
      </v-card-text>

      <v-card-text>
        <v-textarea v-model="lösungen" label="Lösungen (Stichpunkte)" outlined></v-textarea>
      </v-card-text>

      <v-card-actions class="card-actions">
        <v-btn @click="save">Speichern</v-btn>
        <v-btn @click="cancel">Abbrechen</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const link = ref('');
const lösungen = ref('');

const save = () => {
  // Implementiere deine Speicherlogik hier
};

const cancel = () => {
  // Implementiere deine Abbrechen-Logik hier
};
</script>

<style scoped>
.card-actions {
  padding: 1rem;
}
</style>
