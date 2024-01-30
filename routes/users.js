const router = require("express").Router();

const usersController = require("../controllers/users");

const { isAuthenticated } = require("../middleware/authenticate");

//select
router.get("/", usersController.getAll);

router.get("/:id", usersController.getSingle);

//create
router.post("/", isAuthenticated, usersController.createUser);

//update
router.put("/:id", isAuthenticated, usersController.updateUser);

//delete
router.delete("/:id", isAuthenticated, usersController.deleteUser);

module.exports = router;
