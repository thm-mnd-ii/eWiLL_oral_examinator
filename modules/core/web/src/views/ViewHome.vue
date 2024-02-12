<template>
  <div class="home-container">
    <header class="hero-section">
      <v-card class="welcome-card">
        <h1>Willkommen bei Oral Examinator</h1>
        <p>Bereite dich effektiv auf deine mündlichen Prüfungen im Fach Datenmanagement vor – mit Simulationen, die auf
          die Lehrpläne der THM abgestimmt sind.</p>
      </v-card>
    </header>

    <section class="features-section">
      <v-card class="features-card">
        <h2>Was bietet der Oral Examinator?</h2>
        <div class="features">
          <v-card class="feature">
            <h3>Realitätsnahe Simulationen</h3>
            <p>Trainiere unter Bedingungen, die echten Prüfungssituationen nachempfunden sind.</p>
          </v-card>
          <v-card class="feature">
            <h3>Interaktive Lernkontrollen</h3>
            <p>Überprüfe dein Verständnis mit interaktiven Aufgaben und erhalte sofortiges Feedback zu deinen Lösungen.
            </p>
          </v-card>
          <v-card class="feature">
            <h3>Flexible Zeitgestaltung</h3>
            <p>Übe wann immer es in deinen Zeitplan passt – 24/7, ganz nach deinem eigenen Rhythmus.</p>
          </v-card>
        </div>
      </v-card>
    </section>

    <section class="cta-section">
      <v-card class="cta-card">
        <h2>Bist du bereit, deine Prüfungsvorbereitung auf das nächste Level zu bringen?</h2>
        <v-btn large color="success" @click="redirectToViewDashStudent">Jetzt loslegen</v-btn>
      </v-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectToViewDashStudent = () => {
  router.push('/dashStudent');
};
</script>

<style scoped>
/* Rest des Styles bleibt unverändert */

/* Zusätzlicher Style für VCards */
.welcome-card,
.features-card,
.cta-card {
  text-align: center;
  background-color: #ffffff;

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 80%;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 35px;
  box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);

}

.feature {
  border: none;
  /* Entfernt die vorherige Karten-Style-Definition */
  margin: 1rem;
  padding: 1rem;
  text-align: center;
  background-color: #f8f8f8;
  /* Leichtes Grau als Hintergrund für Feature-Karten */
  transition: background-color 0.3s ease;
  /* Fügt eine sanfte Übergangsanmation hinzu */
}

/* Anpassungen für responsive Design */
@media (max-width: 768px) {
  .features {
    flex-direction: column;
  }
}

.feature:hover {
  background-color: #dfede0;
  /* Das leichte Grau für den Hover-Zustand */
}
</style>