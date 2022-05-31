export const handle404 = (req, res) => {
    res.status(404).json({
        error: {
            dev: "Unknown endpoint",
            cli: "Vous vous êtes perdu?",
        },
    });
};
