export class VoiceInput {
    constructor(onResult, onError) {
        this.onResult = onResult;
        this.onError = onError;
        this.recognition = null;
        this.isListening = false;

        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US'; // Default, can be changed to 'sw-KE'

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.onResult(transcript);
                this.isListening = false;
            };

            this.recognition.onerror = (event) => {
                this.onError(event.error);
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };
        }
    }

    start(lang = 'en-US') {
        if (!this.recognition) {
            this.onError("Speech recognition not supported in this browser.");
            return;
        }
        if (this.isListening) return;

        this.recognition.lang = lang;
        try {
            this.recognition.start();
            this.isListening = true;
        } catch (e) {
            console.error(e);
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }
}
