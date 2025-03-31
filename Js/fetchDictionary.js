// Display/Containers
const container = document.querySelector('.contain');
const disp = document.querySelector('.display');
const defContainer = document.querySelector('.def');
const notFound = document.querySelector('.not-found');
const searchBtn = document.querySelector('.initSearch');
const searchInp = document.querySelector('.searchInput');
const wordInfo = document.querySelector('.word-info');


// Elements
const definitions = document.querySelector('.defins')
const partOfSpeech = document.querySelector('.prtSpeech');
const examples = document.querySelector('.examples');
const synAt = document.querySelector('.synonyms-antonyms');


// Handle API request/display
async function fetchDictionary() {
    // Stops execution
    if (searchInp.value === '') return;


    try {
        // REQUEST API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchInp.value.toLowerCase()}`);

        // Display full container  despite response code
        container.style.height = '800px';
        container.style.overflowY = 'auto';

        // Throw an error
        if (!response.ok) { throw new Error(); }

        // Covert response to JSON
        const data = await response.json();

        // Remove '404' from screen
        notFound.classList.remove('fade-in');
        notFound.style.display = 'none';


        // Display Container
        defContainer.style.display = 'flex';
        defContainer.classList.add('fade-in')
        disp.style.marginBottom = '40vh';


        //////////////// Display word ///////////////
        // Safe assign audio source
        let audioSrc = data[0]['phonetics'][0]['audio'] || [];
        for (let i = 0; i < data[0]['phonetics'].length; i++) {
            if (data[0]['phonetics'][i]['audio'] !== '') {
                audioSrc = data[0]['phonetics'][i]['audio'];
                break;
            }
        }

        // Display Main word/Pronunciation/Audio
        wordInfo.innerHTML = `
            <h2>📖 Main Word: ${data[0]['word'].charAt(0).toUpperCase() + data[0]['word'].slice(1)}</h2>
            <p>
            Pronunciation: <span>${data[0]['phonetics'][1]?.['text'] || data[0]['phonetics'][0]?.['text'] || 'N/A'}</span>
            <button class="audioBtn"><span class="material-symbols-outlined">volume_up</span></button>
            </p>
            <audio id="audio" onclick="this.play()">
            <source class="audioSrc" src="${audioSrc}" type="audio/mpeg">
            </audio>`;

        // Play audio or alert if no audio found
        document.querySelector('.audioBtn').addEventListener('click', () => {
            if (audioSrc.length == 0) {
                console.log('No audio found');
                return alert('No audio found for this word!');
            }
            // Play audio
            document.querySelector('#audio').play();
        });


        // Display definitions
        definitions.innerHTML = `${data[0]['meanings'][0]['definitions'].map(def => `<li>${def.definition}</li>`).join('')}`;


        // Display part of speech
        partOfSpeech.innerHTML = `🔠 Part of Speech: ${data[0]['meanings'][0]['partOfSpeech'].charAt(0).toUpperCase() + data[0]['meanings'][0]['partOfSpeech'].slice(1)}`;

        // Display examples
        examples.innerHTML = `<h3>💬 Example Sentence(s):</h3>
        ${data[0]['meanings'][1]?.['definitions']?.map(exp => exp['example'] ? `<li>"${exp['example']}"</li>` : '').join('') || 'N/A'}`;


        // Display synonyms and antonyms
        synAt.innerHTML = `
        <h3>🔗 synonyms-antonyms: </h3>
        <p>✅ Synonyms: ${data[0]['meanings'][0]['synonyms'].length > 0 ? data[0]['meanings'][0]['synonyms'].map(syn => `${syn}`).join(', ') : 'N/A'}</p>
        <p>❌ Antonyms: ${data[0]['meanings'][0]['antonyms'].length > 0 ? data[0]['meanings'][0]['antonyms'].map(ant => `${ant}`).join(', ') : 'N/A'}</p>`;

        // Display error view
    } catch (error) {
        defContainer.style.display = 'none';
        defContainer.classList.remove('fade-in');
        notFound.style.display = 'block';
        notFound.classList.add('fade-in');
        disp.style.marginBottom = '0';
    }
}


// Search Dictionary on click or enter key
searchBtn.addEventListener('click', fetchDictionary);
document.addEventListener('keypress', e => e.key === 'Enter' && fetchDictionary());




