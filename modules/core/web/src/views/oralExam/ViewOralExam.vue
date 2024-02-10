<template>
    <div class="page-container">
        <div class="frage-container">
            <!-- Hier deine Frage anzeigen -->
            <h1>test{{ pruefungsFragen[randomFrageId].id}} </h1>
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
            <button @click="toggleRecognition(pruefungsFragen[aktuelleFrageIndex].id)"
                :class="{ 'is-recording': isRecording }" class="microphone-button">
                <div class="microphone-icon">
                    <div class="mic-top"></div>
                    <div class="mic-body"></div>
                </div>
            </button>
            <button class="next-button" @click="gotoNextQuestion">Nächste Frage</button>
            <div v-if="transcript">Ihre Antwort: {{ transcript }}</div>
            <div v-if="bewertung !== null">Bewertung: {{ bewertung ? 'Richtig' : 'Falsch' }}</div>
        </div>
        <div class="cancel-button" @click="showConfirmation">X</div>
        <div v-if="isConfirmationVisible" class="confirmation-dialog">
            <p>Sind Sie sich sicher, dass Sie die Prüfung abbrechen wollen?</p>
            <p>Eine abgebrochene Prüfung zählt hier im System als Fehlversuch.</p>
            <div class="confirmation-buttons">
                <button class="confirmation-button" @click="cancel">Prüfung nicht abbrechen</button>
                <button class="confirmation-button" @click="confirm">Prüfung abbrechen</button>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthUserStore } from "@/stores/authUserStore";

export default {
    data() {
        return {
            startTime: null,
            currentTime: null,
            duration: 600, // 10 Minuten in Sekunden
            timerInterval: null,
            recognition: null,
            isRecording: false, // Zustand der Aufnahme
            transcript: '',
            bewertung: null,
            isConfirmationVisible: false, // Zustand für die Anzeige des Bestätigungsdialogs
            aktuelleFrageIndex: 0, // Starten mit 0 für die erste Frage
            gesamtFragen: 10, // In diesem Beispiel gibt es insgesamt 10 Fragen
            randomFrageId: 0,
            punkteAnzahl: 0,
            username: null,
            pruefungsFragen: [
                { id: 1, videoUrl: "https://share.synthesia.io/embeds/videos/e4c36742-45aa-4248-8646-312f79b90e13" },
                { id: 2, videoUrl: "https://share.synthesia.io/embeds/videos/10be208d-4c46-4edb-8beb-b779794726d6" },
                { id: 3, videoUrl: "https://share.synthesia.io/embeds/videos/5cff5d89-23a8-446d-8e77-ebce0ce27441" },
                { id: 4, videoUrl: "https://share.synthesia.io/embeds/videos/82aee4f3-1406-411a-bff8-d1f7d80a01c3" },
                { id: 5, videoUrl: "https://share.synthesia.io/embeds/videos/fd363503-de90-4308-9ec0-4cabdfca6137" },
                { id: 6, videoUrl: "https://share.synthesia.io/embeds/videos/7fcaa1f8-225c-44d9-abb7-dcf04d4dc874" },
                { id: 7, videoUrl: "https://share.synthesia.io/embeds/videos/62469d80-0148-4a3b-9170-b518415a4bc9" },
                { id: 8, videoUrl: "https://share.synthesia.io/embeds/videos/88c3c733-f18b-4057-80b8-3c3227a62919" },
                { id: 9, videoUrl: "https://share.synthesia.io/embeds/videos/534daec1-ec69-4ab4-bf97-50b1ed6c51d6" },
                { id: 10, videoUrl: "https://share.synthesia.io/embeds/videos/ece8d47f-b94e-416f-86e9-d3a0e938963e" },
                { id: 11, videoUrl: "https://share.synthesia.io/embeds/videos/4e1136c5-da8d-46a4-8d0c-8a52c1096817" },
                { id: 12, videoUrl: "https://share.synthesia.io/embeds/videos/66f39c5b-f3af-4544-a610-3818d730905e" },
                { id: 13, videoUrl: "https://share.synthesia.io/embeds/videos/cf813257-4487-4a18-8779-97a2b36a183a" },
                { id: 14, videoUrl: "https://share.synthesia.io/embeds/videos/a18ad9fa-ff78-459f-b71b-e1d50847a3b8" },
                { id: 15, videoUrl: "https://share.synthesia.io/embeds/videos/4573a65e-af29-4d9f-936a-a9b9cc1253b0" },
                { id: 16, videoUrl: "https://share.synthesia.io/embeds/videos/76052e1c-b2f1-4b4e-a857-e5c4fefaa2e9" },
                { id: 17, videoUrl: "https://share.synthesia.io/embeds/videos/218cdbee-aab1-4419-87c1-2cc3edafc4af" },
                { id: 18, videoUrl: "https://share.synthesia.io/embeds/videos/01b24851-4c28-4360-95f3-0fe883639db4" },
                { id: 19, videoUrl: "https://share.synthesia.io/embeds/videos/588d2605-2e5f-48e2-ae69-66ba3ecf7cce" },
                { id: 20, videoUrl: "https://share.synthesia.io/embeds/videos/17dc3934-26e8-4181-aa12-96a579cb7fba" },
                { id: 21, videoUrl: "https://share.synthesia.io/embeds/videos/62822cef-e2c3-4072-8e98-5fc36e3acd7c" },
                { id: 22, videoUrl: "https://share.synthesia.io/embeds/videos/7be1121b-03ce-4966-acfa-6c89028febc3" },
                { id: 23, videoUrl: "https://share.synthesia.io/embeds/videos/032ac296-307c-46c6-8f53-8ec185562c98" },
                { id: 24, videoUrl: "https://share.synthesia.io/embeds/videos/5556be8a-a15f-4f31-aa26-487d585f2c2a" },
                { id: 25, videoUrl: "https://share.synthesia.io/embeds/videos/f85a5e24-ad21-4858-b244-dbf4f71be0ea" },
                { id: 26, videoUrl: "https://share.synthesia.io/embeds/videos/122617eb-45e6-45be-811e-8dce9dceabe5" },
                { id: 27, videoUrl: "https://share.synthesia.io/embeds/videos/04ba9b42-fb43-498e-b80e-bf3c7b709311" },
                { id: 28, videoUrl: "https://share.synthesia.io/embeds/videos/6444854e-77ef-4442-aef5-8d548d8a2071" },
                { id: 29, videoUrl: "https://share.synthesia.io/embeds/videos/a1ecaf3f-3ee9-46e1-bf2b-a88dfbb4a2dc" },
                { id: 30, videoUrl: "https://share.synthesia.io/embeds/videos/84107c84-d6ae-472d-b8c4-3c2ded9da74c" },
                { id: 31, videoUrl: "https://share.synthesia.io/embeds/videos/8424ce71-fffd-4427-a80e-d84d05350169" },
                { id: 32, videoUrl: "https://share.synthesia.io/embeds/videos/aebfbe8c-19b1-41b3-baad-f334c5566d4f" }

            ],
            stichpunkte: [
                { frageId: 1, loesungen: ["Effektives", "Daten", "Management", "Unternehmen", "Erfolg", "Information", "Gewinn", "Prozess", "Optimierung", "Strategisch", "Entscheidung", "Findung"] },
                { frageId: 2, loesungen: ["Lebenszyklus", "Daten", "Erfassung", "Speicherung", "Nutzung", "Archivierung", "Löschung"] },
                { frageId: 3, loesungen: ["Rolle", "Datenbanken", "Big Data", "Analytics", "Daten", "Aggregation", "Verarbeitung", "Analyse"] },
                { frageId: 4, loesungen: ["Daten", "Replikation", "verteilten", "Datenbanksystemen", "Kopien", "Servern", "Konsistenz", "Sicherung", "Ausfall", "Sicherheit"] },
                { frageId: 5, loesungen: ["Künstliche", "Intelligenz", "Daten", "Management", "Automatisierung", "Muster", "Erkennung", "Prädiktiv", "Analyse"] },
                { frageId: 6, loesungen: ["Graphen", "Daten", "Banken", "Beziehung", "Orientiert", "Netzwerk", "Strukturen", "Komplexe", "Verknüpfungen"] },
                { frageId: 7, loesungen: ["Leistung", "Optimierung", "Daten", "Banken", "Index", "Abfrage", "Optimierung", "Ressourcen", "Management"] },
                { frageId: 8, loesungen: ["Effektive", "Daten", "Archivierung", "Sicherung", "Langfristige", "Speicherung", "Backups", "Wiederherstellung", "Pläne"] },
                { frageId: 9, loesungen: ["Effiziente", "Daten", "Migration", "Planung", "Mapping", "Konsistenz", "Sicherung"] },
                { frageId: 10, loesungen: ["Umgang", "veraltete", "Daten", "Banken", "Migration", "Legacy", "System", "Integration", "Konservierung"] },
                { frageId: 11, loesungen: ["Mehrdimensionales", "Daten", "Modell", "Data", "Warehouse", "OLAP", "Würfel", "Komplexität", "Designs", "Performance"] },
                { frageId: 12, loesungen: ["Daten", "Partitionierung", "Strategien", "Skalierbarkeit", "Load", "Balancing", "Verteilung"] },
                { frageId: 13, loesungen: ["Daten", "Integration", "heterogene", "Quellen", "Mapping", "Format", "Konvertierung", "Middleware", "Einsatz"] },
                { frageId: 14, loesungen: ["Implementierung", "komplex", "Geschäft", "Logiken", "Regel", "Basiert", "System", "Stored", "Procedures", "Validierung", "Mechanismen"] },
                { frageId: 15, loesungen: ["Architektur", "In-Memory", "Daten", "Banken", "RAM", "Speicherung", "Schnelligkeit", "Echtzeit", "Analyse"] },
                { frageId: 16, loesungen: ["Daten", "Governance", "Strategie", "Richtlinien", "Verantwortlichkeiten", "Compliance"] },
                { frageId: 17, loesungen: ["Optimierung", "Abfragen", "Data", "Warehouse", "Daten", "Partitionierung", "Parallele", "Verarbeitung", "Effiziente", "Abfrage", "Pläne"] },
                { frageId: 18, loesungen: ["Skalierung", "NoSQL", "Daten", "Banken", "Horizontale", "Skalierbarkeit", "Verteilte", "Architektur", "Konsistenz", "Modelle"] },
                { frageId: 19, loesungen: ["Disaster", "Recovery", "Strategie", "Daten", "Banken", "Backup", "Lösungen", "Notfall", "Pläne", "Redundanzen"] },
                { frageId: 20, loesungen: ["Maschinelles", "Lernen", "Daten", "Bank", "Wartung", "Vorhersage", "Modelle", "Automatisierung", "Anomalie", "Erkennung"] },
                { frageId: 21, loesungen: ["Quanten", "Computing", "Daten", "Management", "Rechen", "Leistung", "Krypto", "Grafische", "Sicherheit", "Neue", "Verarbeitung", "Methoden"] },
                { frageId: 22, loesungen: ["Planung", "Daten", "Migration", "Cloud", "basiert", "Lösungen", "Strukturierung", "Cloud", "Integration", "Sicherheit"] },
                { frageId: 23, loesungen: ["Fortgeschrittene", "Daten", "Verschlüsselung", "Kryptografische", "Methoden", "Schlüssel", "Management", "Performance", "Aspekte"] },
                { frageId: 24, loesungen: ["Integration", "IoT", "Daten", "Strömen", "Echtzeit", "Verarbeitung", "Standardisierung", "Skalierbarkeit"] },
                { frageId: 25, loesungen: ["Strategie", "Archivierung", "Löschung", "Compliance", "Speicher", "Management", "Zugänglichkeit"] },
                { frageId: 26, loesungen: ["Cross", "Database", "Daten", "Banken", "Queries", "Polyglotte", "Persistenz", "Föderation", "Abfrage", "Komplexität"] },
                { frageId: 27, loesungen: ["KI", "Daten", "Integrität", "Validierung", "Automatisierte", "Überprüfung", "Anomalie", "Erkennung", "Lern", "Modelle"] },
                { frageId: 28, loesungen: ["Daten", "Zugriffs", "Berechtigung", "Modell", "Sicherheit", "Richtlinien", "Zugriff", "Kontrolle", "Benutzer", "Rollen"] },
                { frageId: 29, loesungen: ["Herausforderung", "Daten", "Migration", "Clouds", "Kompatibilität", "Sicherheit", "Integrität"] },
                { frageId: 30, loesungen: ["Kausal", "Analyse", "Daten", "Sätzen", "Statistische", "Modelle", "Ursache", "Wirkungs", "Beziehungen", "Komplexe", "Analysen"] },
                { frageId: 31, loesungen: ["Benutzerdefinierte", "Erweiterungen", "SQL", "Spezifisch", "Geschäfts", "Logiken", "Anpassung", "Effizienz", "Steigerung"] },
                { frageId: 32, loesungen: ["Verschiedene", "Daten", "Typen", "Flexible", "Abfragen", "Komplex", "Modelle"] },
            ]
        };
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
        }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.timerInterval);
    },

    methods: {
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
            this.isConfirmationVisible = false;
            console.log('Prüfung abgebrochen');
        },

        toggleRecognition(frageId) {
            if (this.recognition && this.isRecording) {
                this.recognition.stop();
                this.isRecording = false;
            } else {
                this.startRecognition(frageId);
                this.isRecording = true;
            }
        },
        startRecognition(frageId) {
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
                    this.bewerteAntwort(this.transcript, frageId);
                }
                console.log('Spracherkennung beendet.');
            };

            this.recognition.onerror = (event) => {
                console.error('Spracherkennungsfehler:', event.error);
                this.isRecording = false;
            };

            this.recognition.start();
        },

        bewerteAntwort(transkript, frageId) {
            const relevanteStichpunkte = this.stichpunkte.find(frage => frage.frageId === frageId).loesungen;
            let treffer = relevanteStichpunkte.reduce((acc, stichpunkt) => {
                return acc + (transkript.toLowerCase().includes(stichpunkt.toLowerCase()) ? 1 : 0);
            }, 0);
            this.bewertung = treffer >= relevanteStichpunkte.length / 2;
            if (this.bewertung) this.punkteAnzahl++;
        },

        gotoNextQuestion() {
            if (this.aktuelleFrageIndex < this.gesamtFragen - 1) {
                // Den Index für die nächste Frage erhöhen
                this.aktuelleFrageIndex++;
            } else {
                // Falls alle Fragen durchlaufen wurden, hier kannst du weitere Logik einfügen
                console.log("Alle Fragen wurden durchlaufen!");
                alert(this.username + " bist alle Fragen durchgegangen. Deine Punktzahl lautet: " + this.punkteAnzahl);
                location.reload();
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
</style>