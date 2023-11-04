// VTS Upload
document.addEventListener('DOMContentLoaded', function () {
    const chosenVoice = document.getElementById('chosenVoice');
    const textArea = document.getElementById('textarea');
    const voiceInput = document.getElementById('voiceInput');
    const uploadButton = document.getElementById('uploadButton');
    const generateButtonVTS = document.getElementById('generateButtonVTS');
    const generateButtonTTS = document.getElementById('generateButtonTTS');
    const uploadStatus = document.getElementById('uploadStatus');
    const popupContainer = document.getElementById('popupContainer');
    const showGeneratePopUp = document.getElementById('showGeneratePopUp');
    const closePopupButton = document.getElementById('closePopupButton');

    //set file to null
    let selectedFile = null;
    let selectedVoice = '0';
    let text = '';

    //disable buttons
    uploadButton.disabled = true;
    generateButtonVTS.disabled = true;
    generateButtonTTS.disabled = true;

    showGeneratePopUp.addEventListener('click', () => {
        popupContainer.style.display = 'flex';
    });

    closePopupButton.addEventListener('click', () => {
        popupContainer.style.display = 'none';
    });

    chosenVoice.addEventListener('change', function() {
        selectedVoice = chosenVoice.value;

        if (selectedVoice === '0') {
            generateButtonVTS.disabled = true;
            generateButtonTTS.disabled = true;
        } else if (selectedVoice !== '0' && selectedFile !== null) {
            generateButtonVTS.disabled = false;
        } else  if (selectedVoice !== '0' && text !== '') {
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

        //Define reader
        var reader = new FileReader();

        //Define conversion and POST function
        reader.onload = function(e) {
            // binary data converted to base64
            fileData = btoa(e.target.result);

            //base64 biiiiiiatch
            formData.append('voiceInput', fileData);

            //TODO: change "/vts" to some actual endpoint (the computer converting voice to speech), currently returns 404
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
        };

        //Define reader error
        reader.onerror = function(e) {
            // error occurred
            console.log('Error : ' + e.type);
        };

        //Start conversion and POST
        reader.readAsBinaryString(selectedFile);

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