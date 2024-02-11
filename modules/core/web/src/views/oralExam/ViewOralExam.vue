<template>
  <div class="page-container">
    <div v-if="!pruefungAbgebrochen">
    </div>
    <div v-else>
      <p>Die Prüfung wurde abgebrochen. Bitte wenden Sie sich an Ihren Prüfer.</p>
    </div>
    <div class="frage-container">

      <h1>test{{ pruefungsFragen[randomFrageId].id }}</h1>
      <iframe :src="pruefungsFragen[randomFrageId].videoUrl" width="915" height="515" frameborder="0"
        allowfullscreen></iframe>
      <div class="frage-nummer">
        Frage {{ aktuelleFrageIndex + 1 }} / {{ gesamtFragen }}
      </div>
      <div class="timer">
        <div class="timer-box">
          <p class="timer-label">Verbleibende Zeit:</p>
          <div class="timer-counter">{{ formatTime(remainingTime) }}</div>
        </div>
      </div>
      <button @click="toggleRecognition(pruefungsFragen[aktuelleFrageIndex].id)" :class="{ 'is-recording': isRecording }"
        class="microphone-button">
        <div class="microphone-icon">
          <div class="mic-top"></div>
          <div class="mic-body"></div>
        </div>
      </button>
      <button class="next-button" @click="gotoNextQuestion">Nächste Frage</button>
      <div v-if="transcript">Ihre Antwort: {{ transcript }}</div>
    </div>

    <div class="cancel-button" @click="showConfirmation">X</div>
    <div v-if="isConfirmationVisible" class="confirmation-dialog">
      <p>Sind Sie sich sicher, dass Sie die Prüfung abbrechen wollen?</p>
      <div class="confirmation-buttons">
        <button class="confirmation-button" @click="cancel">Prüfung nicht abbrechen</button>
        <button class="confirmation-button" @click="confirm">Prüfung abbrechen</button>
      </div>
    </div>
  </div>
  <DialogEndOfExam v-if=" this.showResult" :punkteAnzahl="this.punkteAnzahl" :gesamtFragen="gesamtFragen"
    :schwierigkeit="schwierigkeit" />
</template>
          
          
<script>
import { Fragenkatalog } from "./Fragenkatalog.ts";
import { useAuthUserStore } from "../../stores/authUserStore";
import { ref } from "vue";
import { useRoute } from "vue-router";
import DialogEndOfExam from "../../dialog/oralExaminator/DialogEndOfExam.vue"

let stufe = '';
export default {

  components: {
    DialogEndOfExam
  },

  beforeCreate() {
    const route = useRoute();
    const courseDescription = ref(route.params.stufe);
    stufe = courseDescription.value;
  },


  data() {
    // Annahme: `stufe` ist eine Variable, die die aktuelle Stufe speichert
    if (stufe === "Einfach") {
      return Fragenkatalog.dataStufe1();
    } else if (stufe === "Mittel") {
      return Fragenkatalog.dataStufe2();
    } else if (stufe === "Schwer") {
      return Fragenkatalog.dataStufe3();
    } else {
      console.log(stufe);
      return Fragenkatalog.dataStufe2();
    }
  },

  computed: {
    remainingTime() {
      return Math.max(this.duration - Math.floor((this.currentTime - this.startTime) / 1000), 0);
    }
  },

  mounted() {
    const authUserStore = useAuthUserStore();

    if (authUserStore.auth.user) {
      // Extrahieren des Benutzernamens
      this.username = authUserStore.auth.user.username;
    }

    this.startTime = Date.now();
    this.timerInterval = setInterval(() => {
      this.currentTime = Date.now();
      const timeLeft = this.remainingTime;
      if (timeLeft <= 0) {
        clearInterval(this.timerInterval); // Stoppt den Timer
        this.onTimeExpired(); // Methode aufrufen, wenn die Zeit abgelaufen ist
      }
    }, 1000);
  },

  //  beforeUnmount() {
  //   clearInterval(this.timerInterval);
  // },

  methods: {

    onTimeExpired() {
      alert('Die Prüfungszeit ist abgelaufen. Die Prüfung wird jetzt abgebrochen.');
      this.pruefungAbgebrochen = true; // Setzen Sie den Zustand auf abgebrochen
      // Implementieren Sie hier zusätzliche Logik für den Abbruch der Prüfung
      // this.$router.push('/');
      this.$router.push('/dashStudent/examListStudent');
    },


    formatTime(timeInSeconds) {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      // Fehlende Template-Literal-Syntax korrigiert
      return `${this.padTime(minutes)}:${this.padTime(seconds)}`;
    },

    padTime(time) {
      return (time < 10 ? '0' : '') + time;
    },

    showConfirmation() {
      this.isConfirmationVisible = true;
    },
    cancel() {
      this.isConfirmationVisible = false;
      console.log('Prüfung nicht abgebrochen');
    },
    confirm() {
      // Bestätigung anzeigen und Prüfung abbrechen, wenn der Benutzer zustimmt
      if (confirm('Möchten Sie die Prüfung wirklich abbrechen?')) {
        this.pruefungAbgebrochen = true; // Setzen Sie den Zustand auf abgebrochen
        // this.$router.push('/');
        this.$router.push('/dashStudent/examListStudent');
      }
    },

    toggleRecognition() {
      if (this.recognition && this.isRecording) {
        this.recognition.stop();
        this.isRecording = false;
      } else {
        this.startRecognition();
        this.isRecording = true;
      }
    },

    startRecognition() {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Die Spracherkennung wird von Ihrem Browser nicht unterstützt.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'de-DE';
      this.recognition.continuous = true;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event) => {
        this.transcript += event.results[event.results.length - 1][0].transcript;
        console.log('Erkannter Text:', this.transcript);
      };

      this.recognition.onend = () => {
        if (!this.isRecording) {
          // Verwenden Sie hier die korrekte Frage-ID. Wenn die aktuelle Frage-ID durch randomFrageId bestimmt wird,
          // verwenden Sie diese Variable, um die richtigen Lösungen abzurufen.
          const aktuelleFrageId = this.pruefungsFragen[this.aktuelleFrageIndex].id; // Stellen Sie sicher, dass dies die tatsächliche ID der aktuellen Frage ist.
          this.bewerteAntwort(this.transcript, aktuelleFrageId);
        }
        console.log('Spracherkennung beendet.');
      };

      this.recognition.onerror = (event) => {
        console.error('Spracherkennungsfehler:', event.error);
        this.isRecording = false;
      };

      this.recognition.start();
    },

    normalisiereTranskript(transkript) {
      return transkript.toLowerCase().replace(/[.,-/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s+/g, ' ').trim();
    },


    pluralize(word) {
      // Pluralisierungslogik für spezielle Fälle in der deutschen Sprache
      if (word.endsWith('us')) {
        return word.replace(/us$/, 'üse'); // Plural von Wörtern, die auf "us" enden
      } else if (word.endsWith('is')) {
        return word.replace(/is$/, 'en'); // Plural von Wörtern, die auf "is" enden
      } else if (word.endsWith('e') && !['ge', 'se', 'ze'].some(suffix => word.endsWith(suffix))) {
        return `${word}n`; // Plural von Wörtern, die auf "e" enden, aber nicht auf bestimmte Suffixe folgen
      } else if (word.endsWith('f')) {
        return `${word.slice(0, -1)}ve`; // Plural von Wörtern, die auf "f" enden
      } else if (word.endsWith('in')) {
        return `${word.slice(0, -2)}innen`; // Plural von Wörtern, die auf "in" enden
      } else {
        return `${word}e`; // Standardpluralisierung durch Hinzufügen von "e"
      }
    },

    depluralize(word) {
      // Depluralisierungslogik für spezielle Fälle in der deutschen Sprache
      if (word.endsWith('üse')) {
        return word.replace(/üse$/, 'us'); // Singular von Wörtern, die auf "üse" enden
      } else if (word.endsWith('en')) {
        return word.slice(0, -1); // Singular von Wörtern, die auf "en" enden
      } else if (word.endsWith('ve')) {
        return `${word.slice(0, -2)}f`; // Singular von Wörtern, die auf "ve" enden
      } else if (word.endsWith('innen')) {
        return `${word.slice(0, -5)}in`; // Singular von Wörtern, die auf "innen" enden
      }
      return word; // Standard: Rückgabe des Wortes unverändert
    },

    combineWords(words) {
      let combinedWords = [];

      // Kombinationen von benachbarten Wörtern
      for (let i = 0; i < words.length; i++) {
        combinedWords.push(words[i]);
        if (i < words.length - 1) {
          combinedWords.push(words[i] + words[i + 1]);
        }
      }

      // Kombinationen von mehr als zwei Wörtern
      for (let i = 0; i < words.length - 2; i++) {
        combinedWords.push(words[i] + words[i + 1] + words[i + 2]);
      }

      return combinedWords;
    },

    levenshtein(a, b) {
      const matrix = [];
      let i;
      let j;
      if (a.length === 0) return b.length;
      if (b.length === 0) return a.length;
      // Initialisierung der ersten Zeile und Spalte der Matrix
      for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      // Durchlaufen der Matrix und Aktualisierung der Distanzwerte
      for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) == a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
          }
        }
      }
      return matrix[b.length][a.length];
    },

    bewerteAntwort(transkript) {
      // Verwenden Sie randomFrageId, um die entsprechende Frage und deren Lösungen zu finden.


      const frageId = this.randomFrageId; // Nutzen Sie die aktuell ausgewählte Frage-ID
      const frage = this.stichpunkte.find(frage => frage.frageId === frageId + 1);

      if (!transkript || !frage || !this.normalisiereTranskript) {
        console.error("Transkript, Frage oder normalisiereTranskript fehlt.");
        return;
      }

      const normalisiertesTranskript = this.normalisiereTranskript(transkript).split(' ');


      let erkannteLoesungenCount = 0;
      const levenshteinDistanceThreshold = 2;

      // Kombinieren und normalisieren Sie die Lösungswörter, um eine umfassendere Erkennung zu ermöglichen.
      const relevanteLoesungen = frage.loesungen.flatMap(loesung => {
        const normalizedLoesung = this.normalisiereTranskript(loesung);
        return this.combineWords(normalizedLoesung.split(/\s+/));
      });

      // Überprüfen Sie jedes Wort im Transkript gegen die Liste der relevanten Lösungen.
      relevanteLoesungen.forEach(loesung => {
        normalisiertesTranskript.forEach(wort => {
          if (this.levenshtein(wort, loesung) <= levenshteinDistanceThreshold) {
            erkannteLoesungenCount++;
          }
        });
      });

      const bewertungErgebnis = erkannteLoesungenCount >= Math.ceil(relevanteLoesungen.length / 2);
      this.bewertung = bewertungErgebnis ? 'Richtig' : 'Falsch';
      if (this.bewertung === "Richtig") this.punkteAnzahl++;


      // Debugging-Ausgaben

      console.log(`Erkannte Lösungen: ${erkannteLoesungenCount}`);
      console.log(`Erforderliche Lösungen: ${Math.ceil(relevanteLoesungen.length / 2)}`);
      console.log(`Bewertung: ${this.bewertung}`);
      /*console.log('normalisierteWoerter:' + normalisierteWoerter)*/
      console.log(normalisiertesTranskript)
      console.log(relevanteLoesungen)
      console.log(levenshteinDistanceThreshold)
    },




    gotoNextQuestion() {
      if (this.aktuelleFrageIndex < this.gesamtFragen - 1) {
        this.aktuelleFrageIndex++;
        // Aktualisieren Sie this.randomFrageId entsprechend der neuen Auswahl
      } else {
        // Falls alle Fragen durchlaufen wurden, hier kannst du weitere Logik einfügen
        console.log("Alle Fragen wurden durchlaufen!");
        // alert(this.username + " bist alle Fragen durchgegangen. Deine Punktzahl lautet: " + this.punkteAnzahl);
        // location.reload();
        this.showResult = true;
      }

      // Erzeuge ein Array mit den Zahlen von 1 bis länge unsere Fragen, falls es nicht existiert
      if (!this.questionIds) {
        this.questionIds = Array.from({ length: this.pruefungsFragen.length }, (_, i) => i + 1);
      }

      // Überprüfe, ob noch verbleibende Fragen vorhanden sind
      if (this.questionIds.length > 0) {
        // Wähle eine zufällige Frage-ID aus den verbleibenden Fragen aus
        const randomIndex = Math.floor(Math.random() * this.questionIds.length);
        const randomQuestionId = this.questionIds[randomIndex];

        // Entferne die ausgewählte Frage-ID aus dem Array
        this.questionIds.splice(randomIndex, 1);

        // Aktualisiere die zufällig ausgewählte Frage-ID
        this.randomFrageId = randomQuestionId;

        // Zurücksetzen von Bewertung und Transkript
        this.bewertung = null;
        this.transcript = '';

      } else {
        // Alle Fragen wurden bereits angezeigt
        console.log('Alle Fragen wurden angezeigt.');
      }
    }
  },
};

</script>
<style scoped lang="scss">
          
          .page-container {
          position: relative;
          }
          
          .frage-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 20px;
          }
          
          iframe {
          // Stellen Sie sicher, dass das Iframe responsive ist und sich gut in Ihr Layout einfügt
          max-width: 100%;
          border: none; // Entfernt die Standardrahmen um das Iframe
          // Optional: Runden Sie die Ecken des Iframe ab, wenn Sie möchten
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);
          }
          
          .microphone-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
          margin-top: 20px; // Abstand vom Video
          }
          
          .microphone-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border: 2px solid currentColor; /* Farbe des Icons */
          border-radius: 50%;
          color: #555; /* Farbe des Icons */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.6);
          }
          
          .mic-top {
          background-color: currentColor;
          width: 50%;
          height: 8px;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);
          }
          
          .mic-body {
          background-color: currentColor;
          width: 60%;
          height: 24px;
          border-radius: 11px;
          margin-top: -4px; /* Adjust this value to fit the design */
          box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);
          }
          
          .is-recording {
          .microphone-icon,
          .mic-top,
          .mic-body {
          border-color: red; // Ändert die Farbe des Rahmens in Rot
          background-color: red; // Ändert die Farbe des Mikrofons in Rot
          box-shadow: 0 2px 5px rgba(61, 61, 59, 0.6);
          }
          }
          
          .cancel-button {
          position: absolute;
          right: 40px; // Abstand vom rechten Rand des Containers
          bottom: 20px; // Abstand vom unteren Rand des Containers
          width: 40px; // Breite des Buttons
          height: 40px; // Höhe des Buttons
          border-radius: 40%; // Machen Sie den Button kreisförmig
          background-color: rgb(186, 25, 25); // Farbe des Buttons
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px; // Größe des X-Symbols
          color: white; // Farbe des X-Symbols
          cursor: pointer; // Cursor-Stil beim Hover
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); // Schatten für 3D-Effekt
          border: none; // Kein Rand
          outline: none; // Entfernt den Fokus-Rand, der manchmal von Browsern hinzugefügt wird
          }
          
          .confirmation-dialog {
          text-align: center;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
          }
          
          .cancel-button:hover {
          background-color: rgb(130, 4, 4);
          }
          
          .cancel-button:focus {
          outline: none; // Entfernen Sie den Umriss, wenn der Button fokussiert ist (für die Zugänglichkeit möglicherweise nicht ideal)
          }
          
          .confirmation-buttons {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          }
          .confirmation-button {
          border: 1px solid black;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          background-color: #d6f5c8;
          flex: 1;
          margin: 0 5px;
          }
          
          .confirmation-button:hover {
          background-color: #b9f0a2;
          }
          
          .frage-nummer {
          font-weight: 800;
          font-size: larger;
          position: absolute; // Positioniert relativ zum nächsten positionierten Vorfahren
          right: 0; // Rechts ausgerichtet im übergeordneten Container
          top: 0; // Oben im übergeordneten Container
          padding: 10px; // Ein wenig Platz um den Text
          background: rgba(0, 0, 0, 0.7); // Ein semi-transparenter Hintergrund
          color: white; // Weiße Textfarbe
          border-radius: 0 0 0 10px; // Abgerundete Ecke unten links
          }
          
          .timer {
          position: absolute;
          top: 10px;
          left: 10px; /* Links ausgerichtet */
          padding: 5px 7px;
          background-color: #ffffff; /* Hintergrundfarbe des Timers */
          border-radius: 25px; /* Runde Ecken */
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Leichter Schatten für den Timer */
          font-size: 1.2em;
          font-weight: bold;
          color: #333333; /* Textfarbe */
          display: flex;
          align-items: center;
          z-index: 1; /* Stellen Sie sicher, dass der Timer über dem Video liegt */
          }
          
          
          .timer-box {
          border: 2px solid #eeeeee; /* Randfarbe des inneren Behälters */
          border-radius: 20px; /* Runde Ecken */
          padding: 8px 15px; /* Innenabstand */
          background-color: #ffffff; /* Hintergrundfarbe des inneren Behälters */
          display: flex;
          align-items: center;
          }
          
          .timer-label {
          font-size: 16px;
          margin-right: 10px; /* Abstand zwischen Label und Zähler */
          }
          
          .timer-counter {
          font-size: 24px;
          color: #ff4500; /* Farbe des Zählers */
          }
          
          .next-button {
          background-color: #4CAF50; /* Hintergrundfarbe */
          color: #fff; /* Textfarbe */
          border: none; /* Rand */
          border-radius: 5px; /* Abgerundete Ecken */
          padding: 10px 20px; /* Innenabstand */
          font-size: 16px; /* Schriftgröße */
          cursor: pointer; /* Zeiger beim Überfahren */
          transition: background-color 0.3s; /* Übergangseffekt */
          }
          
          .next-button:hover {
          background-color: #45a049; /* Hintergrundfarbe beim Überfahren */
          }
      



    
/* Stil für die Buttons */
.confirmation-button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #5fe392; /* Primärfarbe */
  color: white; /* Textfarbe */
  cursor: pointer; /* Cursor-Stil */
}

.confirmation-button:hover {
  background-color: #c70616; /* Dunklere Schattierung bei Hover */
}



          </style>