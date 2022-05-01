// npm start turns on your server

const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
// path is another module built into Node.js API that provides utilities for working with file and directory paths; it makes working with our file system a little more predictable, especially when working with production environments, such as Heroku
const path = require('path');

const PORT = process.env.PORT || 3001;

// to instantiate the server
const app = express();

// we need to tell our Express.js app to intercept POST requests before it gets to the callback function; at that point, the data will be run through a couple of functions to take the raw data transferred over HTTP and convert it to a JSON object
// app.use() is a method executed by the Express.js server that mounts a function to the server that our requests will pass through before getting to the intended endpoint; this is known as MIDDLEWARE; middleware functions essentially allow us to keep our route endpoint callback functions more readable while letting us reuse functionality across routes to keep our code DRY
// *** both of the middleware functions below need to be set up every time you create a server that's looking to accept POST data ***

// parse incoming string or array data
// this method is built into Express.js -> it takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object
// the extended:true option informs our server that there may be sub-array data nested in it as well so it needs to look as deep into the POST data as possible to parse all of the data correctly
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
// the express.json takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object
app.use(express.json());

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
    fs.writeFileSync(path.join(__dirname, './data/animals.json'),
    // to save the JavaScript array as JSON -> JSON.stringify; null and 2 are to keep the data formatted (null -> means we don't want to edit any or our existing data; 2 -> indicates we want to create white space between our values to make it more readable)
    // null and 2 could be left out and the animals.json file would still work but would be incredibly hard to read
    JSON.stringify({ animas: animalsArray }, null, 2)
    );

    // return finished code to post route for response
    // now when we POST a new animal, we'll add it to the imported animals array from the animals.json file
    return animal;
}

// WE MAKE A GET REQUEST EVERY TIME WE ENTER A URL INTO THE BROWSER AND PRESS THE ENTER KEY TO SEE WHAT WILL COME BACK IN RESPONSE; GET is the default request method when using Fetch API

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

// unlike the query object, the param object needs to be defined in the route path, with <route>/:parameterName>, in this case, /api/animals/:id
// a param route MUST come after the other GET route
// this route should only return a single animal because the id is unique and there won't be any query on a single animal; this is why we do not use the previous filterByQuery() function instead
// req.query is multifaceted, often combining multiple parameters, whereas req.param is specific to a single property, often intended to retrieve a single record
// param properties are determined by the value following the : in the route; i.e. the req.params.id in /animals/123?id=24&params=50 would be 123
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
       res.json(result); 
    } else {
        // if no record exists for the animal being searched for, the client receives a 404 error
        res.sendStatus(404);
    }  
});

// sets up route on server that accepts data to be used or stored server-side
// POST is just another method of the app object that allows us to create route; post means that we defined a route that listens for POST requests, not GET requests
// when we make any type of request to the server, Express.js will go through a couple of different phases; first, it will take the URL we made a request to and check to see if it's one of the URL endpoints we've defined; once it finds a matching route, it then checks to see the method of the request and determiens which callback function to execute; if we make a GET request to /api/animals, then the app.get('/api/animals') callback function will execute; if it's a POST request, it'll go to this callback function below
app.post('/api/animals', (req, res) => {
    // set id based on what the next index of the array will be
    // the length property is always going to be one number ahead of the last index of the array
    req.body.id = animals.length.toString();

    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    // req.body is where our incoming content will be
    // with POST requests, we can package up data (typically as an object) and send it to the server; the req.body property is where we can access that data on the server side and do something with it
    res.json(animal);
});

// to make our server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});