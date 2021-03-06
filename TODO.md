# TODO list:

- E2E testing:

  - [x] Add more smoke tests:
    - [x] Check /reports page
  - [ ] Add business flow (aka regression) tests:
    - [ ] The same with testing of ui validation
      - [ ] (add / update / remove) record
      - [ ] sign in validation
      - [ ] sign up validation
    - [ ] Check that users do not have access to records and reports of other users
  - [ ] Add ability to run tests in parallel
  - [ ] Add ability to run
    - [ ] Only smoke tests
    - [ ] Only regression tests
  - [ ] Add ability to generate reports (when it's running under docker-compose and on CI)
    - [ ] Screenshots saving
    - [ ] Add video recording

<br><br>

- Front-end development:

  - [ ] Add more flow types
  - [x] Integrate stylelint
  - [ ] Split styles (vendor, main, theme)
  - [ ] Should we create separate (in `local_modules`) custom forms and modals?
  - [ ] Extract and isolate into separate HoC's and components with render props apollo-graphql related logic
  - [ ] Improve custom `next-routes`
    - [ ] `Router.toggleAuth(isAuthenticated: boolean)` replace with `canActivate` and `canDeactivate` (see also Angular router API)

<br><br>

- Back-end development:
  - [x] Integrate InversifyJS
  - [x] Replace `sequelize` with `knex` and `objection`
  - [ ] Add more flow types
  - [ ] Should we get rid of http/2 server implementation?
  - [ ] Add cursor based pagination
    - [ ] for records
    - [ ] for reports
  - [ ] Add indexes for records in database
  - [ ] Move into separate thread calculation of reports

<br><br>

- Other:
  - [ ] Add mustistage build pipeline for Travis CI
  - [ ] Deploy app
  - [ ] Add Continuous Deployment (when all tests are passed and created new tag in github)
