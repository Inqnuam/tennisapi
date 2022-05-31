import ServerError from "../errors/serverError.js";

export const findId = (req, res, next) => {
    const id = req.params.id ?? req.query.id ?? req.body.id;

    if (id) {
        const idAsNumber = Number(id); // to satisfy chai test
        res.locals.id = isNaN(idAsNumber) ? id : idAsNumber;
        next();
    } else {
        const err = new ServerError(404, "Id is required", "Contenu introuvable");
        next(err);
    }
};
