const db = require('../db/connection');


function fetchArticleById(id){
    return db.query('SELECT * FROM articles WHERE article_id=$1', [id]).then(({rows}) => {
        if(!rows.length){
            return Promise.reject({status: 404, msg: '404 - not found'})
        }
        return rows[0]
    })
}

module.exports = {fetchArticleById}