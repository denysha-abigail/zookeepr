// HERE, we use Router, which allows you to declare routes in any file as long as you use the proper middleware
const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');


// /api was stripped from each address in order to avoid our router function from appending /api to each URL

// WE MAKE A GET REQUEST EVERY TIME WE ENTER A URL INTO THE BROWSER AND PRESS THE ENTER KEY TO SEE WHAT WILL COME BACK IN RESPONSE; GET is the default request method when using Fetch API

// to add route that the front-end can request data from
// the get() method requires two arguments; 1st -> string that describes the route the client will have to fetch from; 2nd -> callback function that will execute every time that route is accessed with a GET request
router.get('/animals', (req, res) => {
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
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        // if no record exists for the animal being searched for, the client receives a 404 error
        res.send(404);
    }
});

// sets up route on server that accepts data to be used or stored server-side
// POST is just another method of the app object that allows us to create route; post means that we defined a route that listens for POST requests, not GET requests
// when we make any type of request to the server, Express.js will go through a couple of different phases; first, it will take the URL we made a request to and check to see if it's one of the URL endpoints we've defined; once it finds a matching route, it then checks to see the method of the request and determiens which callback function to execute; if we make a GET request to /api/animals, then the app.get('/api/animals') callback function will execute; if it's a POST request, it'll go to this callback function below
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    // the length property is always going to be one number ahead of the last index of the array
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        // anything in the 400 range means that it's a user error and not a server error
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);

        // req.body is where our incoming content will be
        // with POST requests, we can package up data (typically as an object) and send it to the server; the req.body property is where we can access that data on the server side and do something with it
        res.json(animal);
    }
});

module.exports  = router;