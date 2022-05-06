// lib folder = short for library; stores files that will be used by multiple files in your application
const fs = require("fs");
const path = require("path");

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

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

// function that accepts the POST route's req.body value and the array we want to add the data to; in this case, the animalsArray since we want to add a new animal to the catalog
// when this function is executed within the app.post() route's callback, it'll take the new animal data and add it to the animalsArray we passed in before writing the new array data to animals.json; after saving it, we'll send the data back to the route's callback function so it can finally respond to the request
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    // synchronous version of fs.writeFile() and doesn't require a callback function (however, if we were writing to a much larger data set, the asynchronouse fs.writeFile() would be better)
    // path.join() joins the value of __dirname (which represents the directory of the file we execute the code in) with the path to the animals.json file to write our animals.json file in the data subdirectory
    fs.writeFileSync(
        path.join(__dirname, '../data/animals.json'),
        // to save the JavaScript array as JSON -> JSON.stringify; null and 2 are to keep the data formatted (null -> means we don't want to edit any or our existing data; 2 -> indicates we want to create white space between our values to make it more readable)
        // null and 2 could be left out and the animals.json file would still work but would be incredibly hard to read
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    // now when we POST a new animal, we'll add it to the imported animals array from the animals.json file
    return animal;
};

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
  };