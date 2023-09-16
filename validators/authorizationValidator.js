const abilities = require('../permissions');
const { User, Poll, Option, Vote } = require("../models");
const asyncHandler = require("express-async-handler");

function authorize(req, res, next, action, subject, forbidden = false) {
  req.ability = abilities.defineAbilitiesFor(req.user);

  if(forbidden === false && req.ability.can(action, subject)) {
    next();
  } else {
    res.status(403).send('Access denied!');
  }
};
  
const canCreatePoll = asyncHandler(async (req, res, next) => {
  authorize(req, res, next, 'create', 'Poll');
});

const canReadPoll = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if (req.user.role === 'Voter') {
    const poll = await Poll.findByPk(req.params.id);
    forbidden = (poll.status !== 'Published') ? true : false
  } else if (req.user.role === 'Editor') {
    const poll = await Poll.findByPk(req.params.id);
    forbidden = (poll.creator_id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'read', 'Poll', forbidden);
});

const canUpdatePoll = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor') {
    const poll = await Poll.findByPk(req.params.id);
    forbidden = (poll.creator_id !== req.user.id || poll.status !== 'Draft') ? true : false
  }

  authorize(req, res, next, 'update', 'Poll', forbidden);
});

const canDeletePoll = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor') {
    const poll = await Poll.findByPk(req.params.id);
    forbidden = (poll.creator_id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'delete', 'Poll', forbidden);
});

const canCreateOption = asyncHandler(async (req, res, next) => {
  authorize(req, res, next, 'create', 'Option');
});
  
const canUpdateOption = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor') {
    const option = await Option.findByPk(req.params.id);
    forbidden = (option.poll.creator_id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'update', 'Option', forbidden);
});

const canDeleteOption = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor') {
    const option = await Option.findByPk(req.params.id);
    forbidden = (option.poll.creator_id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'delete', 'Option', forbidden);
});

const canCreateVote = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Voter') {
    const poll = await Poll.findByPk(req.params.id);
    const userHasVoted = await Vote.findOne({where: { voter_id: req.user.id }, include: [{ model: Option, as: 'option', where: { poll_id: poll.id } } ] } );

    forbidden = userHasVoted ? true : false
  }

  authorize(req, res, next, 'create', 'Vote', forbidden);
});

const canUpdateVote = asyncHandler(async (req, res, next) => {
  authorize(req, res, next, 'update', 'Vote');
});

const canDeleteVote = asyncHandler(async (req, res, next) => {
  authorize(req, res, next, 'delete', 'Vote');
});

const canCreateUser = asyncHandler(async (req, res, next) => {
  authorize(req, res, next, 'create', 'User');
});

const canReadUser = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor' || req.user.role === 'Voter') {
    const user = await User.findByPk(req.params.id);
    forbidden = (user.id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'read', 'User', forbidden);
});
  
const canUpdateUser = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor' || req.user.role === 'Voter') {
    const user = await User.findByPk(req.params.id);
    forbidden = (user.id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'update', 'User', forbidden);
});

const canDeleteUser = asyncHandler(async (req, res, next) => {
  let forbidden = false;
  
  if(req.user.role === 'Editor' || req.user.role === 'Voter') {
    const user = await User.findByPk(req.params.id);
    forbidden = (user.id !== req.user.id) ? true : false
  }

  authorize(req, res, next, 'delete', 'User', forbidden);
});

module.exports = {
  canCreatePoll,
  canReadPoll,
  canUpdatePoll,
  canDeletePoll,
  canCreateOption,
  canUpdateOption,
  canDeleteOption,
  canCreateVote,
  canUpdateVote,
  canDeleteVote,
  canCreateUser,
  canReadUser,
  canUpdateUser,
  canDeleteUser,
}