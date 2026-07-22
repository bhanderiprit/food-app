

export async function errorHandler(err,req,res,next) {
    const statusCode = err.statusCode || 500

    if(statusCode === 500){
        console.log(err);
        
    }

    res.status(statusCode).json({
        success : false,
        message : statusCode === 500 ? 'Somthing Went Wrong' : err.message
    })
}