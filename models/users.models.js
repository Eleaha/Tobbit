const db = require('../db/connection');

function fetchUsers() {
	return db.query(`SELECT * FROM users`).then(({ rows }) => {
		return rows;
	});
}

function fetchUserByUsername(username){
	return db.query('SELECT * FROM users WHERE username=$1', [username]).then(({rows})=> {
		if(!rows.length){
			return Promise.reject({status: 404, msg: 'User not found'})
		}
		return rows[0]
	})
}

module.exports = { fetchUsers, fetchUserByUsername };
