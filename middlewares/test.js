const x = function(req,res,next){
    req.a = 'a'
    console.log('a');
    next()
}

module.exports = {
    x
}