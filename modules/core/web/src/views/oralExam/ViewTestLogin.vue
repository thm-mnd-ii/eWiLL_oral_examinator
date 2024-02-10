<template>
  <div>
    <BasicBackground>
      <v-card class="card">
        <v-card-title class="title">
          <span>

          </span>
          <br />
          <span>Oral Examinator</span>
        </v-card-title>
        <v-card-text class="text">Wähle deine Rolle</v-card-text>

        <v-card-actions>
          <v-btn color="primary-dark" variant="flat" @click="redirectToStudent">Student</v-btn>
          <v-btn color="primary-dark" variant="flat" @click="redirectToDozent">Dozent</v-btn>
        </v-card-actions>
      </v-card>
    </BasicBackground>
  </div>
</template>

<script setup lang="ts">
import {useRouter} from 'vue-router';
import BasicBackground from "@/components/BasicBackground.vue";

const router = useRouter();

// Function to redirect to student page
const redirectToStudent = () => {
  router.push({ path: '/testLogin/dashStudent' });
};

// Function to redirect to dozent page
const redirectToDozent = () => {
  router.push({ path: '/testLogin/dashDozent' });
};
</script>

<style scoped lang="scss">
.card {
  width: 700px;
  margin: auto;
  padding: 20px;
  text-align: center;
}

.title {
  font-size: 4em;
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



<!-- 
<template>
  <div>
    <BasicBackground>
     
      <v-card class="card" @click="navigateToCreateQuestionnaire">
        <v-card-title class="title">Fragenkatalog erstellen</v-card-title>
        <v-card-text class="text">
          Hier können Sie einen neuen Fragenkatalog erstellen, um Prüfungen vorzubereiten.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="navigateToCreateQuestionnaire">Erstellen</v-btn>
        </v-card-actions>
      </v-card>

     
      <v-card class="card" @click="navigateToViewResults">
        <v-card-title class="title">Prüfungsergebnisse einsehen</v-card-title>
        <v-card-text class="text">
          Hier können Sie Ihre Prüfungsergebnisse einsehen und analysieren.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="navigateToViewResults">Ansehen</v-btn>
        </v-card-actions>
      </v-card>
    </BasicBackground>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import BasicBackground from "@/components/BasicBackground.vue";

  const router = useRouter();

  // Funktionen zur Navigation zu den entsprechenden Seiten
  const navigateToCreateQuestionnaire = () => {
    router.push('/create-questionnaire');
  };

  const navigateToViewResults = () => {
    router.push('/view-results');
  };
</script>

<style scoped lang="scss">
  .card {
    width: 700px;
    margin: 20px auto;
    padding: 20px;
    text-align: center;
    cursor: pointer; /* Ändern Sie den Mauszeiger in einen Zeiger, um anzuzeigen, dass die Karte klickbar ist */
  }

  .title {
    font-size: 2em;
    margin-bottom: 15px;
  }

  .text {
    font-size: large;
    margin-bottom: 20px;
  }
</style> -->

<!-- <template>
  <div class="video-wrapper">

    <div v-for="frage in pruefungsFragen" :key="frage.id">
      <div>{{ frage.text }}</div>

      <iframe width="860" height="615" src="https://share.synthesia.io/embeds/videos/cf813257-4487-4a18-8779-97a2b36a183a"
        frameborder="0" allowfullscreen></iframe>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pruefungsFragen: [
        {
          id: 2,
          text: "Frage 2",
          videoUrl: "https://share.synthesia.io/embeds/videos/cf813257-4487-4a18-8779-97a2b36a183a"
        },
      ]
    };
  }
};
</script>

<style scoped lang="scss">
.video-wrapper {
  display: flex;
  justify-content: center; 
}
</style>' -->


<!-- <template>
  <div>
    <button @click="startRecognition">Sprechen Sie jetzt</button>
    <div v-if="transcript">Ihre Antwort: {{ transcript }}</div>
    <div v-if="bewertung !== null">Bewertung: {{ bewertung ? 'Richtig' : 'Falsch' }}</div>
  </div>
</template>

<script>
/* global webkitSpeechRecognition SpeechRecognition */
export default {
  data() {
    return {
      recognition: null,
      transcript: '',
      bewertung: null,
      stichpunkte: [
        { frageId: 1, loesungen: ["Stichpunkt1", "Stichpunkt2", "Stichpunkt3"] },
        // Fügen Sie hier Stichpunkte für weitere Fragen hinzu
      ],
      aktuelleFrageId: 1, // Setzen Sie die ID der aktuellen Frage
    };
  },
  methods: {
    startRecognition() {
      if (!('webkitSpeechRecognition' in window)) {
        alert('Ihr Browser unterstützt die Web Speech API nicht.');
        return;
      }
      let recognition;

      if ('webkitSpeechRecognition' in window) {
        // Für Chrome und einige Chromium-basierte Browser
        recognition = new webkitSpeechRecognition();
      } else if ('SpeechRecognition' in window) {
        // Für zukünftige Browser, die die standardisierte SpeechRecognition API unterstützen
        recognition = new SpeechRecognition();
      } else {
        // Fallback, falls die Web Speech API nicht unterstützt wird
        alert('Ihr Browser unterstützt die Web Speech API nicht. Bitte verwenden Sie Google Chrome oder einen anderen kompatiblen Browser.');
      }

      if (recognition) {
        // Konfigurieren und verwenden Sie die recognition-Instanz
        recognition.lang = 'de-DE';
        recognition.onresult = function (event) {
          // Logik zur Verarbeitung des Transkripts
          const transcript = event.results[0][0].transcript;
          console.log(transcript);
          // Weiterer Code zur Verarbeitung des Transkripts
        };

        // Starten der Spracherkennung
        recognition.start();
      }
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = 'de-DE';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        this.transcript = event.results[0][0].transcript;
        console.log('Erkannter Text:', this.transcript);
        this.bewerteAntwort(this.transcript, this.aktuelleFrageId);
      };

      this.recognition.start();
    },
    bewerteAntwort(transkript, frageId) {
      const relevanteStichpunkte = this.stichpunkte.find(frage => frage.frageId === frageId).loesungen;
      const transkriptWorte = transkript.toLowerCase().split(/\s+/);
      let treffer = 0;

      relevanteStichpunkte.forEach(stichpunkt => {
        if (transkriptWorte.includes(stichpunkt.toLowerCase())) {
          treffer++;
        }
      });

      this.bewertung = (treffer / relevanteStichpunkte.length) >= 0.5;
    },
  },
};
</script> -->

