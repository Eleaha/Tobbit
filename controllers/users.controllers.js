const {fetchUsers} = require('../models/users.models')

function getUsers(req, res, next){
    return fetchUsers().then((users)=> {
        console.log(users)
        res.status(200).send({users})
    })
}

module.exports = { getUsers };