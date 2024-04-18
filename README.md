# Tobbit
<https://tobbit.onrender.com/api>

A lightweight, article based news application.


## Commands

`nmp run setup-dbs` -> drops and creates database

`npm run seed` -> drops and reseeds all tables

`npm test` -> runs test suite

`npm run prepare` -> installs husky


## Getting set up

### Cloning the repo
1. Click the fork button at the top of the repo page and follow the instructions to create your own copy
2. Navigate to the cloned repo on your github
3. Click the green "code" button at the top left
4. Copy the url under HTTPS
5. Open your local terminal and input the following command
`git clone https://github.com/your-username/Tobbit.git`

### Setting up .env files
You'll need to create two .env files to enable you to run two databases; one for testing and one for interacting with as a client would. To do this, you'll need 2 .env files with corresponding information:
- .env.test with `PGDATABASE=NC_NEWS_TEST`
- .env.development with `PGDATABASE=NC_NEWS`
You'll also have to add `PGPASSOWRD=` follwed by your postgresql password in each file if not on a mac.

For an example, have a look at the **[.env.example](https://github.com/Eleaha/Tobbit/blob/main/.env-example)** file.

### Creating and seeding the database
Once you have your .env files set up, run `npm run setup-dbs` to create your databases, then run `npm run seed` to seed the dev database.
The test database is re-seeded on running `npm test` before each test.

### Running tests
To run tests, use either `npm test` or `npm t` to run all, or use either command followed by the test file name if you'd like to specify.


## Technologies Needed

Run `npm i` to install dependencies via the package.JSON.

### Dev dependencies
- jest
- jest-extended
- jest-sorted
- supertest
- husky

### Regular dependencies
- dotenv
- pg
- express
- pg-format

### Minimum version requirements
- node v21.6.0
- Postgres V8.7.3
