# pollify - A Simple Polling Website
pollify is a web application built with Express.js that allows editors to create polls with options, admins to manage these polls, and voters to vote on the available options. This README.md file provides an overview of the project, its features, setup instructions, and usage guidelines.

## Features:
- Users have 3 roles: voters, editors and admins.
- Editors can create polls with multiple options.
- Admins can update polls' statuses as draft, published and closed.
- Voters can view and vote on published polls.

## Tools and Libraries:
- Sequelize is used as ORM.
- Passport is used for authentication.
- Casl is used for authorization.

## Getting Started
### Prerequisites
Before you can run pollify, ensure you have the following prerequisites installed on your system:
- Node.js and npm (Node Package Manager)
- PostgreSQL or another supported database system
- Git (optional, for cloning the repository)

### Installation

Clone the pollify repository (if you haven't already):

    git clone git@github.com:ozenbusra/pollify.git

Navigate to the project directory:

    cd pollify

Install the project dependencies:

    npm install

Run database migrations to set up the database tables:

    sequelize db:migrate

Run seed data to create initial data:

    node seed

Start the application:

    npm run serverstart