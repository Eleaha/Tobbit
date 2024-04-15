const {fetchArticleById} = require('../models/articles.models')

function getArticleById(req, res, next){
    
    const {article_id} = req.params
    return fetchArticleById(article_id).then((article) =>{
        res.status(200).send({article})
    })
    .catch(next)
}

module.exports = { getArticleById };