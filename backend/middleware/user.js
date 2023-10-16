const UserDTO = require("../dto/userDTO");

createUserValidation = (req, res, next) => {
    try {
        const { username, email, password, first_name, last_name, age } = req.body;
        const userDTO = new UserDTO();
        const isValid = userDTO.createUserVerification(username, email, password, first_name, last_name, age);
        if (!isValid) {
            return res.status(400).json(userDTO.getValidationErrors());
        }
        next();
    } catch (error) {
        res.status(400).send("Invalid parameters");
    }
};

loginValidation = (req, res, next) => {
    try {
        const { username, password } = req.body;
        const userDTO = new UserDTO();
        const isValid = userDTO.login(username, password);
        if (!isValid) {
            return res.status(400).json(userDTO.getValidationErrors());
        }
        next();
    } catch (error) {
        res.status(400).send("Invalid parameters");
    }
};

//add last connection
logoutValidation = (req, res, next) => {
    try {
        next();
    } catch (error) {
        res.status(400).send("Invalid parameters");
    }
};

updateInfosValidation = (req, res, next) => {
    try {
        const id = req.user.userId;
        const { gender, sexual_preferences, biography, files } = req.body;
        const userDTO = new UserDTO();
        const isValid = userDTO.updateInfos(id, gender, sexual_preferences, biography, files);
        if (!isValid) {
            return res.status(400).json(userDTO.getValidationErrors());
        }
        next();
    } catch (error) {
        console.log(error);
        res.status(400).send("Invalid parameters");
    }
};

getUserByIdValidation = (req, res, next) => {
    try {
        const id = req.params.id;
        const userDTO = new UserDTO();
        const isValid = userDTO.getUserById(id);
        if (!isValid) {
            return res.status(400).json(userDTO.getValidationErrors());
        }
        next();
    } catch (error) {
        res.status(400).send("Invalid parameters");
    }
};

getUserByUsernameValidation = (req, res, next) => {
    try {
        const username = req.body.username;
        const userDTO = new UserDTO();
        const isValid = userDTO.getUserByUsername(username);
        if (!isValid) {
            return res.status(400).json(userDTO.getValidationErrors());
        }
        next();
    } catch (error) {
        res.status(400).send("Invalid parameters");
    }
};

module.exports = {
    createUserValidation,
    loginValidation,
    logoutValidation,
    updateInfosValidation,
    getUserByIdValidation,
    getUserByUsernameValidation
};