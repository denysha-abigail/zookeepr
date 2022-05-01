const express = require('express');
const { animals } = require('./data/animals')

// to instantiate the server
const app = express();

// this function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
// the filterByQuery() method also ensures that query.personalityTraits is always an array before the .forEach() method executes
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        // if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
    // loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
        // check the trait against each animal in the filteredResults array; remember, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop
        // for each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait, so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished
        filteredResults = filteredResults.filter(
            animal => animal.personalityTraits.indexOf(trait) !== -1
        );
    });
}
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

// to add route that the front-end can request data from
// the get() method requires two arguments; 1st -> string that describes the route the client will have to fetch from; 2nd -> callback function that will execute every time that route is accessed with a GET request
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    // using send() method from the res parameter (response) to send the string Hello! to our client
            // res.send('Hello!');
    // the send() method is great for short messages, but if we want to send lots of JSON, simply change send to json
    res.json(results);
});

// to make our server listen
app.listen(3001, () => {
    console.log(`API server now on port 3001`);
})