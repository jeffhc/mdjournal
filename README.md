# `epsas` | Express Passport Session Authentication Skeleton

This repository contains an Express 4.x example that implements the
default Passport.js session authentication, using local-passport.

It includes:
* Basic login/logout pages
* A simple User model connected to MongoDB
* User creation
* A test authentication protected route

Among these features, it also has:
* Flash messages
* Bootstrap 4.3

## Installation instructions

1. `git clone https://github.com/jeffhc/epsas.git`
2. `npm install`
3. Create a file *config/Config.js* that exports an object with a secret
4. `npm start` runs development mode, `npm run production` runs production mode (no stack traces in render functions)

