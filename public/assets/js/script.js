const $animalForm = document.querySelector('#animal-form');

const handleAnimalFormSubmit = event => {
  event.preventDefault();

  // get animal data and organize it
  const name = $animalForm.querySelector('[name="animal-name"]').value;
  const species = $animalForm.querySelector('[name="species"]').value;
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;

  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const selectedTraits = $animalForm.querySelector('[name="personality"').selectedOptions;
  const personalityTraits = [];
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraits.push(selectedTraits[i].value);
  }
  const animalObject = { name, species, diet, personalityTraits };

  // because the request is coming from the server, we don't have to specify the full URL (similar to <script> and <link> tags to incorporate local files, except that now it's being done through a fetch() call)
  // HERE when we submit a new animal through the form, we collect all the input data into an object and use fetch() to POST our data to the server
  fetch('/api/animals', {
    // need to specify what type of request it is and set the method to POST; this will allow the request to make it to the proper endpoint in our server
    method: 'POST',
    // we have to tell the request what type of data we're looking to send and then actually provide the data so we set the headers property to inform the request that this is going to be JSON data
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    // that way, we can add stringified JSON data for our animalObject to the body property of the request
    body: JSON.stringify(animalObject)
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      alert('Error: ' + response.statusText);
    })
    .then(postResponse => {
      console.log(postResponse);
      alert('Thank you for adding an animal!');
    });
};



$animalForm.addEventListener('submit', handleAnimalFormSubmit);
