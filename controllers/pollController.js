const { Poll, User, Option, Vote, sequelize } = require("../models");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const abilities = require('../permissions');

const hasPollPermission = asyncHandler(async (req, action, poll = null) => {
  if(action !== 'create' && req.user.role !== 'Admin' && (poll.creator_id !== req.user.id || poll.status !== 'Draft')) {
    return false;
  }

  req.ability = abilities.defineAbilitiesFor(req.user);
  return req.ability.can(action, "Poll");
});

const hasVotePermission = asyncHandler(async (req, poll) => {
  const userHasVoted = await Vote.findOne({where: { voter_id: req.user.id }, include: [{ model: Option, as: 'option', where: { poll_id: poll.id } } ] } );

  if (req.user.role === 'Voter' && userHasVoted) {
    return false;
  } 

  req.ability = abilities.defineAbilitiesFor(req.user);
  return req.ability.can("create", "Vote");
});

const index = asyncHandler(async (req, res, next) => {
  const canCreatePoll = await hasPollPermission(req, "create");
  let allPolls;
  
  if (req.user.role === 'Admin') {
    allPolls = await Poll.findAll();
  } else if (req.user.role === 'Editor') {
    allPolls = await Poll.findAll({ where: { creator_id: req.user.id }});
  } else {
    allPolls = await Poll.findAll({ where: { status: 'Published' }});
  }

  res.render("polls/index", {
    title: "Poll List",
    pollList: allPolls,
    canCreatePoll: canCreatePoll,
  });
});

const show = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findByPk(req.params.id, {
    include: [{ model: User, as: 'creator' }, { model: Option, as: 'options', where: { poll_id: req.params.id }, include: { model: Vote, as: 'votes' }}],
  });

  const [canUpdatePoll, canDeletePoll, canCreateVote] = await Promise.all([
    hasPollPermission(req, "update", poll),
    hasPollPermission(req, "delete", poll),
    hasVotePermission(req, poll),
  ])
  
  if (poll === null) {
    const err = new Error("Poll not found");
    err.status = 404;
    return next(err);
  }

  res.render("polls/show", {
    title: poll.title,
    poll: poll,
    canUpdatePoll: canUpdatePoll,
    canDeletePoll: canDeletePoll,
    canCreateVote: canCreateVote
  });
});

const create_get = asyncHandler(async (req, res, next) => {
  const editors = await User.findAll({ where: { role: 'Editor' }});

  res.render("polls/form", {
    title: "Create Poll",
    editors: editors,
    user: req.user,
  });
});

const create_post = asyncHandler(async (req, res, next) => {
  const poll = new Poll(req.body);

  if (req.body.creator_id === undefined) {
    poll.set({ creator_id: req.user.id });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.render("polls/form", {
      title: "Create Poll",
      poll: poll,
      user: req.user,
      errors: errors.array(),
    });

    return;
  }

  const req_options = req.body["options[]"] || [];
  const options = (typeof req_options === "string") ? [req_options] : req_options

  const transaction = await sequelize.transaction();

  try {
    await poll.save({ transaction: transaction });
    
    for (const optionText of options) {
      await Option.create({ option_text: optionText, poll_id: poll.id }, { transaction: transaction });
    }

    await transaction.commit();
    res.redirect(`/polls/${poll.id}`);
  } catch (err) {
    await transaction.rollback();
    err.status = 422;
    return next(err);
  }
});

const update_get = asyncHandler(async (req, res, next) => {
  const [ poll, editors ] = await Promise.all([
    Poll.findByPk(req.params.id, { include: [{ model: User, as: 'creator' }, { model: Option, as: 'options' }]}),
    User.findAll({ where: { role: 'Editor' }})
  ])

  if (poll === null) {
    const err = new Error("Poll not found");
    err.status = 404;
    return next(err);
  }

  res.render("polls/form", {
    title: "Update Poll",
    poll: poll,
    user: req.user,
    editors: editors,
  });
});

const update_post = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findByPk(req.params.id);
  poll.set(req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render("polls/form", {
      title: "Update Poll",
      poll: poll,
      user: req.user,
      errors: errors.array(),
    });

    return;
  }

  const transaction = await sequelize.transaction();
  
  try {
    await poll.save({ transaction: transaction });

    const req_options = req.body["options[]"] || [];
    const updatedOptions = (typeof req_options === "string") ? [req_options] : req_options
    const existingOptions = await Option.findAll({ where: { poll_id: poll.id }})

    for (const existingOption of existingOptions) {
      if (!updatedOptions.includes(existingOption.option_text)) {
        await existingOption.destroy({ transaction: transaction });
      }
    }

    for (const updatedOption of updatedOptions) {
      const ifExist = await Option.findAll({ where: { poll_id: poll.id, option_text: updatedOption }})

      if (ifExist.length === 0) {
        await Option.create({ option_text: updatedOption, poll_id: poll.id }, { transaction: transaction });
      }
    }
    
    await transaction.commit();
    res.redirect(`/polls/${poll.id}`);
  } catch (err) {
    await transaction.rollback();
    err.status = 422;
    return next(err);
  }
});

const delete_get = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findByPk(req.params.id, { include: [{ model: User, as: 'creator' }]});

  if (poll === null) {
    const err = new Error("Poll not found");
    err.status = 404;
    return next(err);
  }

  res.render("polls/delete", {
    title: "Delete Poll",
    poll: poll,
  });
});

const delete_post = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findByPk(req.params.id);
  const transaction = await sequelize.transaction();

  try {
    await Option.destroy({ where: { poll_id: poll.id }, transaction: transaction });
    await poll.destroy({ transaction: transaction });
    await transaction.commit(); // Commit the transaction
    res.redirect(`/polls`);
  } catch (err) {
    await transaction.rollback();
    err.status = 422;
    return next(err);
  }
});

const create_vote = asyncHandler(async (req, res, next) => {
  const vote = new Vote({ option_id: req.params.option_id, voter_id: req.user.id });

  try {
    await vote.save();
    res.redirect(`/polls/${req.params.id}`);
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
  delete_post,
  create_vote,
};