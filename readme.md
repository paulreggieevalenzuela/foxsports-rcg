# Fox Sports Isomorphic RCG Departure Tracker

## Getting Started

### Clone the repo

   git clone ssh://git@bitbucket.foxsports.com.au:7999/rcg/rcg-departure-tracker-fe.git

### Install dependencies.

    npm install

### Development

The following commands are available for working with the project:

| Command | Result |
| ------- | ------ |
| `grunt` | Builds the application. Assets can be found in `./_dist`. |
| `grunt watcher` | Builds the application with staging API. |
| `grunt clean` | Destroys the `./_dist` and `./tmp` directory. |
| `grunt test` | Runs the tests. |

#### Browser-sync support

In order to use [browser-sync](https://www.browsersync.io/) with the project, you need to do the following steps:

Install `browser-sync` globally:

1. `npm install -g browser-sync`

Run grunt watcher:

2. `grunt watcher`

Run `browser-sync` in a separate terminal tab:

3. `browser-sync start --config bs-config.js`

You can leave it running in the separate tab, and when grunt watcher updated your /dist folder, styles will be automatically injected into the browser without restart, and any updates to .js code will trigger browser restart automatically.
It also opens new docs tab in your browser when you start it the first time.


### Workflow
Always create a relevant branch from latest `develop` (always pull before branching). The branch name should contain the related JIRA number
and the name should be meaningful to the task in hand.

For a new feature, say a task to add match-scoreboard with JIRA #MC-153, your branch name could be
`feature/WEB-15-match-scoreboard`

No changes should be merged to `develop` without peer review, and qa approval.

#### Deploying to QA
When you have at-least 2 approvals on your peer review, push your feature branch to qa branch

`git push origin my-feature-branch:qa --force`

Note that we are force pushing and not merging. This ensures that your feature is tested in isolation.
Go to [Bamboo](https://bamboo.foxsports.com.au/browse/FSP-RDTF0) and find the build number for your changes to the qa branch.

Develop Deploy: [http://media.foxsports.com.au/stats/technology/resources/rcg-departure-board/latest/dist/docs/index.html](http://media.foxsports.com.au/stats/technology/resources/rcg-departure-board/latest/dist/docs/index.html)

You can then test the widgets at the following URL:

`http://media.foxsports.com.au/stats/technology/resources/rcg-departure-board/{build-number}/dist/docs/index.html`

e.g. if your feature branch was branched off from stable version 1.0.0 and your qa build number is 2 then the URL would be:

`stats/technology/resources/rcg-departure-board/1.0.0-qa2/dist/docs/index.html`


#### Merge and Release
TBA

## Contributors

   Front-end developers, Fox Sports Australia

## License

   MS Reference
