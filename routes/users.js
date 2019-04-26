const usersRouter = require("express").Router();
const {
    getUserByUsername
} = require("../controllers/users");

usersRouter.route("/:username")
    .get(getUserByUsername)
    .all(methodNotAllowed)

module.exports = usersRouter;