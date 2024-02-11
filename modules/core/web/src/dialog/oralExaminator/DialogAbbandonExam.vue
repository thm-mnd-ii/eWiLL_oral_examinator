<template>
    <v-dialog v-model="dialogCancelExam" max-width="700" :persistent="true">
        <v-card class="result-card">
            <v-card-title class="result-title">Ergebnisse</v-card-title>
            <v-card-text>
                <div>
                    <p>Sind Sie sicher, dass sie diese Prüfung abbrechen wollen? </p>
                    <P>Alle bis jetzt richtig beantwortete Fragen werden nicht gewertet!</P> 
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="cancelExam">Prüfung abbrechen</v-btn>
                <v-btn color="success" @click="back ">zurück zur Prüfung </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        punkteAnzahl: Number,
        gesamtFragen: Number,
        schwierigkeit: String
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
            return (this.punkteAnzahl + "/" + this.gesamtFragen)
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
            location.reload()
        },


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
    color: #4caf50;
}
</style>