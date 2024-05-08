const config={
    production :{
        JWT_SECRET: process.env.JWT_SECRET,
        DATABASE: `${process.env.MONGO_URI}/drive-test`
    },
    default : {
        JWT_SECRET: process.env.JWT_SECRET,
        DATABASE: `${process.env.MONGO_URI}/drive-test`
    }
}


exports.get = function get(env){
    return config[env] || config.default
}