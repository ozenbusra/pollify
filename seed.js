#! /usr/bin/env node

console.log('This script populates initial data.');
  
const { User, Poll, Option, Vote } = require("./models");

const users = [];
const polls = [];
const options = [];
const votes = [];

main().catch((err) => console.log(err));

async function main() {
  await createUsers();
  await createPolls();
  await createOptions();
  await createVotes();
};

async function createUser(index, username, email, password, role) {
  const userDetail = {
      username: username,
      email: email,
      password: password,
      role: role,
  };

  const user = await User.create(userDetail);
  users[index] = user;
  console.log(`Added user: ${username}`);
};

async function createUsers() {
  console.log("Adding Users");
  await Promise.all([
    createUser(0, "voter1", "voter1@gmail.com", "password123", "Voter"),
    createUser(1, "voter2", "voter2@gmail.com", "password123", "Voter"),
    createUser(2, "voter3", "voter3@gmail.com", "password123", "Voter"),
    createUser(3, "voter4", "voter4@gmail.com", "password123", "Voter"),
    createUser(4, "voter5", "voter5@gmail.com", "password123", "Voter"),
    createUser(5, "editor1", "editor1@gmail.com", "password123", "Editor"),
    createUser(6, "editor2", "editor2@gmail.com", "password123", "Editor"),
    createUser(7, "editor3", "editor3@gmail.com", "password123", "Editor"),
    createUser(8, "admin1", "admin1@gmail.com", "password123", "Admin"),
    createUser(9, "admin2", "admin2@gmail.com", "password123", "Admin"),
  ]);
};

async function createPoll(index, title, description, status, creatorId) {
  const pollDetail = {
      title: title,
      description: description,
      status: status,
      creator_id: creatorId,
  };

  const poll = await Poll.create(pollDetail)
  polls[index] = poll;
  console.log(`Added poll: ${title}`);
};

async function createPolls() {
  console.log("Adding Polls");
  await Promise.all([
    createPoll(0, "Poll 1", "Description 1", "Draft", 6),
    createPoll(1, "Poll 2", "Description 2", "Published", 8),
    createPoll(2, "Poll 3", "Description 3", "Closed", 7),
    createPoll(3, "Poll 4", "Description 4", "Draft", 7), 
    createPoll(4, "Poll 5", "Description 5", "Published", 8),
    createPoll(5, "Poll 6", "Description 6", "Published", 6),
    createPoll(6, "Poll 7", "Description 7", "Closed", 6)
  ]);
};

async function createOption(index, optionText, pollId) {
  const optionDetail = {
      option_text: optionText,
      poll_id: pollId,
  };

  const option = await Option.create(optionDetail)
  options[index] = option;
  console.log(`Added option: ${optionText}`);
};

async function createOptions() {
  console.log("Adding Options");
  await Promise.all([
    createOption(0, "Option 1", 1),
    createOption(1, "Option 2", 1),
    createOption(2, "Option 1", 2),
    createOption(3, "Option 2", 2),
    createOption(4, "Option 3", 2),
    createOption(5, "Option 1", 3),
    createOption(6, "Option 2", 3),
    createOption(7, "Option 1", 4),
    createOption(8, "Option 2", 4),
    createOption(9, "Option 3", 4),
    createOption(10, "Option 1", 5),
    createOption(11, "Option 2", 5),
    createOption(12, "Option 1", 6),
    createOption(13, "Option 2", 6),
    createOption(14, "Option 1", 7),
    createOption(15, "Option 2", 7),
    createOption(16, "Option 3", 7)
  ]);
};

async function createVote(index, optionId, voterId) {
  const voteDetail = {
      option_id: optionId,
      voter_id: voterId,
  };

  const vote = await Vote.create(voteDetail)
  votes[index] = vote;
  console.log(`Added vote: ${optionId}, ${voterId}`);
};

async function createVotes() {
  console.log("Adding Votes");
  await Promise.all([
    createVote(0, 3, 5),
    createVote(1, 4, 1),
    createVote(2, 3, 2),
    createVote(3, 5, 3),
    createVote(4, 6, 1),
    createVote(5, 6, 4),
    createVote(6, 7, 3),
    createVote(7, 12, 1),
    createVote(8, 11, 2),
    createVote(9, 11, 5),
    createVote(10, 14, 5),
    createVote(11, 13, 3),
    createVote(12, 14, 2),
    createVote(13, 15, 1),
    createVote(14, 16, 4),
    createVote(15, 17, 2),
    createVote(16, 15, 5),
  ]);
};
