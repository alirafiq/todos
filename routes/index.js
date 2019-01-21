const express = require('express');
const usersControllers = require('../controllers/Users');
const router = express.Router();

/* GET index page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'TODO'
  });
});

router.get("/activation/:key", usersControllers.activation);
router.get("/changepassword/:key", usersControllers.changepassword);
router.post("/changepassword/:key", usersControllers.updatePassword);


module.exports = router;
