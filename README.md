**News application**

**Commands, npm...**

run setup-dbs - drops and creates database
run seed - drops and reseeds all tables
test - runs test suite
run prepare - installs husky

**Setting Up Environment Variables**

You'll need to create .env.test and .env.development files separately and add in your database connection information (PGDATABASE and PGPASSWORD if not on Mac). Have a look at the .env-example for a template.

**Technologies Needed**

run npm i to install

-> Dev dependencies
// jest
// jest-extended
// pg-format
// husky

-> Regular dependencies
// dotenv
// pg
