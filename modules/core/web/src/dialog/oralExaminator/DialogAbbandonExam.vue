<template>
    <v-dialog v-model="showResult" max-width="700" :persistent="true">
        <v-card class="result-card">
            <v-card-title class="result-title">Ergebnisse</v-card-title>
            <v-card-subtitle v-if="message != null" class="result-subtitle">{{ message }}</v-card-subtitle>
            <v-card-text>
                <div>
                    <p>Ergebnis: <span :class="{ 'result-status': true, 'passed': passed, 'not-passed': !passed }">{{ passed ? 'Bestanden' : 'Nicht Bestanden' }}</span></p>
                    <p>Richtig beantwortete Fragen: {{ correctAnswers }}</p>
                    <p>Schwierigkeit: {{ giveStufe }}</p>
                    <p>Datum: {{ formattedDate }}</p>
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="goBack">Zurück</v-btn>
                <v-btn color="success" @click="retry">Erneut Versuchen</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        punkteAnzahl: Number,
        gesamtFragen: Number,
        schwierigkeit: String,
        message : String,
    },
    data() {
        return {
            showResult: true,
            date: new Date(),
        }
    },
    computed: {
        formattedDate() {
            return this.date.toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        },
        correctAnswers() {
            return `${this.punkteAnzahl} / ${this.gesamtFragen}`;
        },
        passed() {
            return this.punkteAnzahl >= this.gesamtFragen / 2;
        },
        giveStufe() {
            return this.schwierigkeit;
        }
    },
    methods: {
        goBack() {
            this.$router.push('/testLogin/dashStudent/examListStudent');
        },
        retry() {
            location.reload();
        }
    }
}
</script>

<style scoped>
.result-card {
    background-color: #f5f5f5;
    border: 2px solid #4caf50;
    border-radius: 10px;
}

.result-title {
    color: #4caf50;
}

.result-status {
    font-weight: bold;
}

.passed {
    color: #4caf50;
}

.not-passed {
    color: red;
}

.result-subtitle {
    color: red;
}
</style>

