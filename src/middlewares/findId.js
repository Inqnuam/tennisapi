import ServerError from "../helpers/serverError.js";

export const findId = (req, res, next) => {
    const id = req.params.id ?? req.query.id ?? req.body.id;

    if (id) {
        res.locals.id = id;
        next();
    } else {
        const err = new ServerError(404, "Id is required", "Contenu introuvable");
        next(err);
    }
};
