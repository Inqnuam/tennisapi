export const authorize = (key = process.env.API_KEY) => {
    return (req, res, next) => {
        const userKey = req.headers["api_key"];
        if (key === userKey) {
            next();
        } else {
            res.status(401).json({ error: "You are not allowed" });
        }
    };
};
