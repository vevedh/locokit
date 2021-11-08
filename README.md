# Low-Code Kit Platform

This is the monorepo of the [LocoKit, aka Low-Code Kit platform](https://locokit.io).

There is the backend part (`api` folder),
the frontend (`front` folder),
the documentation (`docs`)
and several packages. (only `glossary` actually).

## Getting started

Initialize node modules:

```sh
npm ci # install deps of api, front, docs, glossary
```

From here you need docker and docker-compose in recent version.

In the `front` folder, 
you need to create a `.env` file from the `.env.dist`.

In the `api` folder,
same thing, but with the `.env.example` file.

```sh
docker-compose up # you can add -d to use the daemon option of docker-compose

# in another terminal
npm run migrate:latest
npm run seed:run
npm run start
```

The default user created is `superadmin@locokit.io` with password `locokit`.

## API


### Swagger

A swagger is available on http://localhost:3030/swagger/ once the project has started.

This is made with [Redoc UI](https://redocly.github.io/redoc/).

### Restore a dump

You can restore any staging / production dump you have access to by putting them
in the `dumps` folder.

This folder is shared with the postgres dockers. (`lck-db` and `lck-db-test`)

For restoring a dump :

```sh
docker exec -it lck-db bash
pg_restore --no-owner --clean -d public -U postgres -W /dumps/your_dump # you'll have to enter the password pouicpouic
```

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Contribute

If you encounter a bug, please submit an issue.

If you want to contribute to the code,
first ask to the team where to begin.

When making a contribution, please name your branch with the issue's id.

For example, on the issue n° 23, you could name your branch `23-add-of-a-new-feature` or `23-fix-this-horrible-bug`.

Then you could submit a Merge Request.

The CI is configured, so you could check also if your branch is not breaking anything.


```sh
npm ci
```

A postinstall copy some patches directly in the `node_modules` directory,
waiting for our PR to be merged.

### Configuration

**`public/config.js`**

This file contains a `LCK_SETTINGS` variable
allowing the app to know some settings like the API URL, the localStorage key, ...

This file is used at runtime, so you could customise it
when you deploy the app.

You have an example in the `public/config.js.dist` ready to be used
with the `lck-api` project.
Copy paste this file in a new `public/config.js` and it should do the trick.

**`.env`**

Same for this file, you'll find an example at the root in `.env.dist` file.

This file contains more global variables used at compilation time.

As you can't change these vars after compilation time,
we have made a special `index.html` file to be generic when the build is done.
You'll find after build in the `dist/index-generic.html` file.
This file contains the `.env` variables in an template-handlebar syntax.

This allows you to compile only the html file if you need
to customize these vars before deploy.
We've made a node script for that, in `scripts/compileTemplate.js`
that you can trigger with `npm run build:html`.
If you use it in a CI environment,
you could give to your CI some env vars that will be injected in your html file.

### Compiles and hot-reloads for development

```sh
npm run serve
```

### Compiles and minifies for production

```sh
npm run build
```

You'll get an `index-generic.html` file in the `dist` folder.
You can use the `npm run build:html` if you want to customize the title or other vars.

### Run your unit tests

* only stories of the storybook

```sh
npm run test:unit-stories
```

* run stories and update imageshots

```sh
npm run test:update-imageshot
```

* except stories

```sh
npm run test:unit-src
```

* all unit tests

```sh
npm run test:unit
```

### Lints and fixes files

```sh
npm run lint
```

### Storybook

```sh
npm run storybook:serve
```

Every story in the project is snapshoted + imageshoted.

We use the addon storyshot of storybook, for both snap and images.

Sometimes, an imageshot need to wait for an element, wait for its DOM injection.

Sometimes too, there are animations that slow the process of taking the screenshot.

For every story you write, you can add an arg `waitForSelector` that would be a CSS selector,
and we use it to tell puppeteer (used under the hood by storyshot for imageshot)
to wait the DOM element with the CSS selector you define is really in the DOM.

We encounter lots of issues on Mac OS, so if you use this OS,
don't worry if your CI is broken. Ask a developer with a Linux OS to update your shots.

### Customize configuration

A configuration file is present in `public/config.js`.

```js
const LCK_SETTINGS = {
  API_URL: 'http://localhost:3030',
  LOCALSTORAGE_KEY: 'lck-auth',
  SENTRY_DSN: '', // here you can set your SENTRY_DSN, please check sentry documentation
  SENTRY_ENV: 'local',
  STORAGE_PATH: 'http://localhost:8000/storage'
}
```

You can write your own configuration settings here,
when you deploy this front, you will have to override these settings
to match your environement configuration.

## Contribute

If you encounter a bug, please submit an issue.

If you want to contribute to the code,
first ask to the team where to begin (with an issue).

1. create an issue, or be assigned on an issue
2. put the issue in the "Doing" column of the board
3. create a local branch prefixed by the issue's id (this help gitlab to wire issue / branch / MR)
4. add some tests / stories for the code you're writing
5. when your work is ok for you, push it to the repo
6. create a MR
7. check the CI is ok. CD is configured too, you could check your storybook & on surge.sh to see if it's working (this will help us for the review process)
8. if all is green, put your issue in "To be reviewed" column of the board
9. affect your MR to someone in the team to be reviewed
10. maybe you'll have to take in consideration some aspects of your code, so discuss and take in consideration the remarks (restart to 4.)
11. if review is ok, the reviewer will approve it
12. now, you can merge it !!!... Congratulations !
