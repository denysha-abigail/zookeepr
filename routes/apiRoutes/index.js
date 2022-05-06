const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// employing Router as before but this time we're having it use the module exported from animalRoutes.js (note: .js extension is implied when supplying file names in require())
router.use(animalRoutes);
// middleware so that the router uses the new zookeeper routes
router.use(require('./zookeeperRoutes'));

module.exports = router;