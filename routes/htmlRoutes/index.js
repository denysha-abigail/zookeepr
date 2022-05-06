// include path so that we can export each routing call using router, not app
const path = require('path');
const router = require('express').Router();

// the '/' brings us to the root route of the server
// unlike most GET and POST routes that deal with creating or returning JSON data, this GET route only has the job of responding with an HTML page to display in the browser
router.get('/', (req, res) => {
    // specifies where to find the file we want our server to read and send back to the client
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// this route will take us to /animals; we can assume that a route that has the term api in it will deal in transference of JSON data, whereas a more nomral-looking endpoint such as /animals should serve an HTML page
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// the * will act as a wildcard, meaning any route that wasn't previously defined will fall under this request and will receive the homepage as the response; essentially this will re-direct the user to the homepage if the client makes a request for a route that doesn't exist
// the * route should always come last! Otherwise it will take precedence over named routes
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = router;