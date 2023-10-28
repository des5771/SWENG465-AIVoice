// VTS Upload
document.addEventListener('DOMContentLoaded', function () {
    const chosenVoice = document.getElementById('chosenVoice');
    const textArea = document.getElementById('textarea');
    const voiceInput = document.getElementById('voiceInput');
    const uploadButton = document.getElementById('uploadButton');
    const generateButtonVTS = document.getElementById('generateButtonVTS');
    const generateButtonTTS = document.getElementById('generateButtonTTS');
    const uploadStatus = document.getElementById('uploadStatus');

    //set file to null
    let selectedFile = null;
    let selectedVoice = '0';
    let text = '';

    //disable buttons
    uploadButton.disabled = true;
    generateButtonVTS.disabled = true;
    generateButtonTTS.disabled = true;

    chosenVoice.addEventListener('change', function() {
        selectedVoice = chosenVoice.value;

        if (selectedVoice === '0') {
            generateButtonVTS.disabled = true;
            generateButtonTTS.disabled = true;
        } else if (selectedVoice !== '0' && selectedFile !== null) {
            generateButtonVTS.disabled = false;
        } else  if (selectedVoice !== '0' && text !== null) {
            generateButtonTTS.disabled = false;
        }
    });

    textArea.addEventListener('change', () => {
       text = textArea.value;

       console.log(text)

        if (selectedVoice !== '0' && text !== '') {
            generateButtonTTS.disabled = false;
        }
    });

    voiceInput.addEventListener('change', (event) => {
        selectedFile = voiceInput.files[0];

        if (selectedFile !== null){
            uploadButton.disabled = false;
        }

        if (selectedFile == null) {
            generateButtonVTS.disabled = true;
        } else if (selectedVoice !== '0'){
            generateButtonVTS.disabled = false;
        }

    });

    uploadButton.addEventListener('click', () => {
        voiceInput.click(); // Open file dialog when the "Upload" button is clicked.

        //TODO: POST voice upload to be saved to account and enable generate VTS
    });

    generateButtonVTS.addEventListener('click', () => {
        generateVTS()
    });

    generateButtonTTS.addEventListener('click', () => {
        generateTTS()
    });

    function generateVTS() {
        const formData = new FormData();
        formData.append('chosenVoice', selectedVoice);

        //base64 biiiiiiatch
        formData.append('voiceInput', btoa(selectedFile));

        fetch('/vts', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                uploadStatus.textContent = data.message;
            })
            .catch(error => {
                uploadStatus.textContent = 'Error uploading the file: ' + error.message;
            });
    }

    function generateTTS() {
        const formData = new FormData();
        formData.append('chosenVoice', selectedVoice);

        //base64 biiiiiiatch
        formData.append('textInput', btoa(text));

        fetch('/tts', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                uploadStatus.textContent = data.message;
            })
            .catch(error => {
                uploadStatus.textContent = 'Error uploading the file: ' + error.message;
            });
    }
});

// VTS Generate

// TTS Generate
