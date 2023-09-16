const { User } = require("../models");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const abilities = require('../permissions');

const hasPermission = asyncHandler(async (req, action, user = null) => {
  if(action !== 'create' && req.user.role !== 'Admin' && user.id !== req.user.id) {
    return false;
  }

  req.ability = abilities.defineAbilitiesFor(req.user);
  return req.ability.can(action, "User");
});

const index = asyncHandler(async (req, res, next) => {
  const canCreateUser = await hasPermission(req, "create");
  let allUsers;
  
  if (req.user.role === 'Admin') {
    allUsers = await User.findAll();
  } else {
    allUsers = await User.findAll({ where: { id: req.user.id }})
  }

  res.render("users/index", {
    title: "User List",
    userList: allUsers,
    canCreateUser: canCreateUser,
  });
});

const show = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  const [canUpdateUser, canDeleteUser] = await Promise.all([
    User.findByPk(req.params.id),
    hasPermission(req, "delete", user),
  ]);

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("users/show", {
    title: user.name,
    user: user,
    canUpdateUser: canUpdateUser,
    canDeleteUser: canDeleteUser,
  });
});

const create_get = asyncHandler(async (req, res, next) => {
  const isAdmin = (req.user.role === 'Admin') ? true : false;

  res.render("users/form", {
    title: "Create User",
    isAdmin: isAdmin,
  });
});

const create_post = asyncHandler(async (req, res, next) => {
  const user = new User(req.body);
  const errors = validationResult(req);
  const isAdmin = (req.user.role === 'Admin') ? true : false;

  if (!errors.isEmpty()) {
    res.render("users/form", {
      title: "Create User",
      isAdmin: isAdmin,
      user: user,
      errors: errors.array(),
    });

    return;
  }

  try {
    await user.save();
    res.redirect(`/users/${user.id}`);
  } catch (err) {
    err.status = 422;
    return next(err);
  }
});

const update_get = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id)
  const isAdmin = (req.user.role === 'Admin') ? true : false;

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("users/form", {
    title: "Update User",
    isAdmin: isAdmin,
    user: user,
  });
});

const update_post = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  const isAdmin = (req.user.role === 'Admin') ? true : false;
  
  if (req.body.password === '') {
    delete req.body.password;
  }

  user.set(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("users/form", {
      title: "Update User",
      isAdmin: isAdmin,
      user: user,
      errors: errors.array(),
    });

    return;
  }
  
  try {
    await user.save();
    res.redirect(`/users/${user.id}`);
  } catch (err) {
    err.status = 422;
    return next(err);
  }
});

const delete_get = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("users/delete", {
    title: "Delete User",
    user: user,
  });
});

const delete_post = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  try {
    await user.destroy();
    res.redirect(`/users`);
  } catch (err) {
    err.status = 422;
    return next(err);
  }
});

module.exports = {
  index,
  show,
  create_get,
  create_post,
  update_get,
  update_post,
  delete_get,
  delete_post
};