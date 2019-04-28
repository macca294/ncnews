const {
    selectUserByUsername
} = require('../models/users')

exports.getUserByUsername = (req, res, next) => {
    const {
        username
    } = req.params


    selectUserByUsername(username)
        .then(([user]) => {
            if (!user) next({
                code: 404
            })
            else res.status(200)
                .send({
                    'user': user
                })
        })

        .catch(next)
}