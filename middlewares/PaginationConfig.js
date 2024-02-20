// Middleware for set default configuration for pagination results
const paginationConfig = () => {
    return async (req,res,next) => {
        req.paginatePage = req.query.page ? req.query.page : 1;
        req.paginateLimit = req.query.limit ? req.query.limit : 10;
        req.paginateOffset = (parseInt(req.paginatePage) - 1) * req.paginateLimit;
        next();
    }
}

export default paginationConfig

