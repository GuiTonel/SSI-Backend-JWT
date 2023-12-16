const service = require("./services.js")

function regularUserPermission(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({message: "Not authorized!"});
    }
    try {
        var decoded_user = service.decodeJWT(token);
    } catch (err) {
        return res.status(401).json({message: "Not authorized!"});
    }

    req.userId = decoded_user.sub
    next()
}


function adminOnlyPermission(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({message: "Not authorized!"});
    }
    try {
        var decoded_user = service.decodeJWT(token);
    } catch (err) {
        return res.status(401).json({message: "Not authorized!"});
    }
    if (!decoded_user.is_admin) {
        return res.status(401).json({message: "Not authorized!"});
    }
    req.userId = decoded_user.sub
    next()
}

function ownerOrAdminPermission(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({message: "Not authorized!"});
    }
    try {
        var decoded_user = service.decodeJWT(token);
    } catch (err) {
        return res.status(401).json({message: "Not authorized!"});
    }

    if (!decoded_user.is_admin && (decoded_user.sub != req.params.id)) {
        return res.status(401).json({message: "Not authorized!"});
    }

    req.userId = decoded_user.sub
    next()
}

module.exports = {
    regularUserPermission,
    ownerOrAdminPermission,
    adminOnlyPermission,
}