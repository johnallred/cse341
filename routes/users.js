const router = require('express').Router();

const usersController = require('../controllers/users');

//select
router.get('/', usersController.getAll);

router.get('/:id', usersController.getSingle);

//create
router.post('/', usersController.createUser);

//update
router.put('/:id', usersController.updateUser);

//delete
router.delete('/:id', usersController.deleteUser);

module.exports = router;