# AirBNC
This repository mimics the functionality of the Air BnB website.  It will connect and insert data into a database using Node-Postgres.

SETUP
Before using, please install:
Jest: npm install jest -D
Node-Postgres: npm install pg
dotenv: npm install dotenv
node-pg-format: npm install pg-format

Please include the following in a .gitignore file:
node_modules
.env
The following variable should be in your .env:
PGDATABASE=airbnb_test

To setup the database run: "npm run setup-db"