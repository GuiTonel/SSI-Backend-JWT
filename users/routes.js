
const express = require('express')
const service = require("./services.js")
const authService = require("../auth/services.js")
const {regularUserPermission, ownerOrAdminPermission, adminOnlyPermission} = require("../auth/middlewares.js")
const md5 = require('md5')

const router = express()

 router.post('/', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (!(email && password && name)) {
      return res.status(400).json({"message": "Bad request!"});
    }
    if (await service.getUserByEmail(email)) {
        return res.status(200).json({"message": "Already registered user!"});
    }

    const user_id = await service.registerUser(name, email, password);
    const user = await service.getUserById(user_id);

    if (!user) {
        return res.status(500).json({"message": "Internal error!"});
    }

    const token = authService.generateJWT(user);
    return res.status(201).json({"jwt": token});
    
})

router.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!(email && password)) {
      return res.status(400).json({"message": "Bad request!"});
    }

    const user = await service.getUserByEmailAndPassword(email, md5(password));

    if (!user) {
        return res.status(401).json({"message": "Email or password incorrect!"});
    }
    const token = authService.generateJWT(user);
    return res.status(200).json({"jwt": token});
})


router.post('/:id/transfers', regularUserPermission, async (req, res) => {
    if (req.userId == req.params.id) {
        return res.status(400).json({"message": "Impossible transfer to yourself!"});
    }

    const value = req.body.value;

    if (!value || value <=0) {
      return res.status(400).json({"message": "The transfer need a valid value!"});
    }

    const author = await service.getUserById(req.userId);
    const destiny = await service.getUserById(req.params.id);

    if (author.value < value) {
      return res.status(400).json({"message": "Invalid transfer!"});
    }

    if (!(await service.updateUserValue(author.id, value))){
        return res.status(500).json({"message": "Internal error!"});
    }

    await service.updateUserValue(destiny.id, -value);
    await service.registerTransfer(author.id, destiny.id, value);

    return res.status(204).json();
})

router.get('/:id/transfers', ownerOrAdminPermission, async (req, res) => {
    const transfers = await service.listTransfers(req.userId);
    return res.status(200).json(transfers)
})

router.get("/", adminOnlyPermission, async (req, res) => {
    const users = await service.listUsers();
    return res.status(200).json(users)
})
 
module.exports = router;