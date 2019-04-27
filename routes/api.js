const apiRouter = require('express').Router();

const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const usersRouter = require("./users");
const commentsRouter = require("./comments")
const {
  methodNotAllowed
} = require("../errors/index")
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);


apiRouter
  .route('/')
  .get((req, res) => res.send({
    ok: true
  }))
  .all(methodNotAllowed)

module.exports = apiRouter;