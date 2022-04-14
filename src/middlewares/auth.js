export const authorize = (key = process.env.API_KEY) => {
    return (req, res, next) => {
        const userKey = req.headers["api-key"];
        if (key === userKey) {
            next();
        } else {
            const err = ServerError(401, "not authorized", "Vous n'êtes pas autorisé à faire cette action");
            next(err);
        }
    };
};
