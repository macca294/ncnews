const usersRouter = require("express").Router();
const {
    getUser
} = require("../controllers/users");

topicsRouter.route("/:id")
    .get(getUser);

module.exports = usersRouter;