// npm start turns on your server
// server.js file is in charge of starting our server

const fs = require('fs');
// path is another module built into Node.js API that provides utilities for working with file and directory paths; it makes working with our file system a little more predictable, especially when working with production environments, such as Heroku
const path = require('path');
const express = require('express');
const { animals } = require('./data/animals');
// the require() statements will read the index.js files in each of the directories indicated; with require(), the index.js file will be the default file read if no other file is provided
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


const PORT = process.env.PORT || 3001;

// to instantiate the server
// app represents a single instance of the express.js server
// every time you call express(), you're creating a new Express.js object; changing the properties or methods on one Express.js object doesn't affect other Express.js objects you create
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
// middleware that instructs the server to make certain files readily available and to not gate it behind a server endpoint
// express.static() works by providing a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources; this means that all of our front-end code can now be accessed without having a specific server endpoint created for it
// every time we create a server that will serve a front end as well as JSON data, we'll always want to use this middleware
// used to load corresponding resources properly
app.use(express.static('public'));
// this is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes; if / is the endpoint, then the router will serve back our HTML routes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// to make our server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});