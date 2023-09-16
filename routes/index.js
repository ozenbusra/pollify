const express = require("express");
const router = express.Router();

const userValidator = require("../validators/userValidator");
const pollValidator = require("../validators/pollValidator");
const authenticationValidator = require("../validators/authenticationValidator");
const authorizationValidator = require("../validators/authorizationValidator");

const indexController = require("../controllers/indexController")
const userController = require("../controllers/userController");
const pollController = require("../controllers/pollController");

router.get('/', authenticationValidator.isAuthenticated, indexController.index);
router.get('/login', indexController.login_get);
router.post('/login', indexController.login_post);
router.post('/logout', authenticationValidator.isAuthenticated, indexController.logout);

router.get("/users", authenticationValidator.isAuthenticated, userController.index);
router.get("/users/create", authenticationValidator.isAuthenticated, authorizationValidator.canCreateUser, userController.create_get);
router.post("/users/create", authenticationValidator.isAuthenticated, authorizationValidator.canCreateUser, userValidator.validate_create, userController.create_post);
router.get("/users/:id", authenticationValidator.isAuthenticated, authorizationValidator.canReadUser, userController.show);
router.get("/users/:id/update", authenticationValidator.isAuthenticated, authorizationValidator.canUpdateUser, userController.update_get);
router.post("/users/:id/update", authenticationValidator.isAuthenticated, authorizationValidator.canUpdateUser, userValidator.validate_update, userController.update_post);
router.get("/users/:id/delete", authenticationValidator.isAuthenticated, authorizationValidator.canDeleteUser, userController.delete_get);
router.post("/users/:id/delete", authenticationValidator.isAuthenticated, authorizationValidator.canDeleteUser, userController.delete_post);

router.get("/polls", authenticationValidator.isAuthenticated, pollController.index);
router.get("/polls/create", authenticationValidator.isAuthenticated, authorizationValidator.canCreatePoll, pollController.create_get);
router.post("/polls/create", authenticationValidator.isAuthenticated, authorizationValidator.canCreatePoll, pollValidator.validate_form, pollController.create_post);
router.get("/polls/:id", authenticationValidator.isAuthenticated, authorizationValidator.canReadPoll, pollController.show);
router.get("/polls/:id/update", authenticationValidator.isAuthenticated, authorizationValidator.canUpdatePoll, pollController.update_get);
router.post("/polls/:id/update", authenticationValidator.isAuthenticated, authorizationValidator.canUpdatePoll, pollValidator.validate_form, pollController.update_post);
router.get("/polls/:id/delete", authenticationValidator.isAuthenticated, authorizationValidator.canDeletePoll, pollController.delete_get);
router.post("/polls/:id/delete", authenticationValidator.isAuthenticated, authorizationValidator.canDeletePoll, pollController.delete_post);
router.post("/polls/:id/vote/:option_id", authenticationValidator.isAuthenticated, authorizationValidator.canCreateVote, pollController.create_vote);

module.exports = router;