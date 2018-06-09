module.exports = {
  'Login' : function (browser) {

    const devServer = browser.globals.devServerURL
    var data = browser.globals.data

    browser
      .useCss()
      .url(devServer)
      .click('#login-button')
      .pause(1000)
      .setValue('#login_field', data.username)
      .pause(1000)
      .setValue('#password', data.password)
      .pause(1000)
      .click('input[name=commit]')
      .waitForElementVisible('#app > div > main', 10000)
  },
  // 'Visualize the user feed' : function (browser) {
  //
  // },
  // 'Search w/ input string' : function (browser) {
  //   browser
  //     .useCss()
  //     .waitForElementVisible('#app > div > nav', 10000, false)
  //     .pause(1500)
  //     .waitForElementVisible('#search-button', 10000, false)
  //     .pause(2000)
  //     .click('#app > div.application--wrap > nav > div.toolbar__content > a.search-container')
  //     .waitForElementVisible('#search-component', 10000, false)
  //     .setValue('#search-input-field', 'rock')
  //     .pause(1500)
  //     .click('#execute-search-button')
  //     .pause(2500)
  //
  // },
  // 'Filter by category' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#repositories-search-filter')
  //     .pause(1000)
  //     .waitForElementVisible('#repositories-search-filter > div.expansion-panel__body', 10000, false)
  //     // .click('#repositories-search-filter')
  //     // .pause(3000)
  //     // .click('#users-search-filter')
  //     // .pause(1000)
  //     // .waitForElementVisible('#users-search-filter > div.expansion-panel__body', 10000, false)
  //     // .click('#users-search-filter')
  //     // .pause(3000)
  //     // .click('#code-search-filter')
  //     // .pause(1000)
  //     // .waitForElementVisible('#code-search-filter > div.expansion-panel__body', 10000, false)
  //     // .click('#code-search-filter')
  //     // .pause(3000)
  //     // .click('#issues-search-filter')
  //     // .pause(1000)
  //     // .waitForElementVisible('#issues-search-filter > div.expansion-panel__body', 10000, false)
  //     // .click('#issues-search-filter')
  //     .pause(1000)
  // },
  // 'Access a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > div > div > a:nth-child(2)')
  //     .pause(3000)
  //     .waitForElementVisible('#repos-list', 3000, false)
  //     .click('#repos-list > li:nth-child(1)')
  //     // if not, try this #repos-list > li:nth-child(1) > a
  //     .pause(1000)
  //     .waitForElementVisible('#known-repo-container', 45000)
  //     .pause(2000)
  //     .saveScreenshot('access_repo.png')
  // },
  // 'Access the files on a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(3)')
  //     .pause(1000)
  //     .click('#Files > div > div > div > div > div > ul > li')
  //     .pause(1000)
  //     .waitForElementVisible('#file-container', 10000, false)
  //     .saveScreenshot('access_file.png')
  // },
  // 'Update a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#file-container > div.flex.row > span:nth-child(2) > button')
  //     .pause(1000)
  //     .waitForElementVisible('#update-file-container', 10000, false)
  //     .setValue('#update-file-container > div.flex.xs12.text-sm-left > div > div > div.CodeMirror-scroll > div.CodeMirror-sizer', 'test input')
  //     .setValue('#update-file-container > div:nth-child(4) > div > div > div > div.input-group__input > textarea', 'test input message')
  //     .setValue('#update-file-container > div.layout.row.wrap > div.flex.xs12.sm6 > div > div.input-group__input > div.input-group__selections > input', 'master')
  //     .click('#app > div.menu__content.menu__content--select.menu__content--autocomplete.menuable__content__active > div > ul > li')
  //     .pause(1000)
  //     .click('#update-file-container > div.flex.row > button:nth-child(2)')
  //     .pause(1000)
  //     .waitForElementVisible('#known-repo-container', 10000, false)
  // },
  // 'List the committed changes on a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(4)')
  //     .pause(1000)
  //     .waitForElementVisible('#Commits', 10000, false)
  //     .saveScreenshot('commits.png')
  // },
  // 'List the contributors of a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(7)')
  //     .pause(1000)
  //     .waitForElementVisible('#Contributors', 10000, false)
  //     .saveScreenshot('contributors.png')
  // },
  // 'List the collaborators of a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(5)')
  //     .pause(1000)
  //     .waitForElementVisible('#Collaborators', 10000, false)
  //     .saveScreenshot('collaborators.png')
  // },
  // 'Access the wiki of a repository' : function (browser) {
  //
  // },
  // 'Pin (save) a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#save-button')
  //     .pause(1000)
  //     .waitForElementVisible('#success-alert', 10000, false)
  //     .saveScreenshot('save_repo.png')
  // },
  // 'List the issues of a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(6)')
  //     .pause(1000)
  //     .waitForElementVisible('#Issues', 2000, false)
  //     .saveScreenshot('issues.png')
  // },
  // 'Star a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#star-button')
  //     .pause(1000)
  //     .waitForElementVisible('#success-alert', 10000, false)
  //     .saveScreenshot('watch_repo.png')
  // },
  // 'Mark a repository as being watched' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#watch-button')
  //     .pause(1000)
  //     // .waitForElementVisible('#success-alert', 10000, false)
  //     .saveScreenshot('watch_repo.png')
  // },
  // 'Fork a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#fork-button')
  //     .pause(1000)
  //     .waitForElementVisible('#success-alert', 10000, false)
  //     .saveScreenshot('fork_repo.png')
  // },
  // 'Check profile information' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#toolbar-side-icon')
  //     .pause(1000)
  //     .waitForElementVisible('#app > div > aside', 10000, false)
  //     .click('#profile-drawer-button')
  //     .pause(1000)
  //     .waitForElementVisible('#profile-info', 10000, false)
  //     .saveScreenshot('profile.png')
  // },
  // 'List contributed repositories' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div > ul > li:nth-child(2)')
  //     .pause(1000)
  //     .waitForElementVisible('#user-repositories', 2000, false)
  //     .saveScreenshot('list_contrib_repos.png')
  // },
  // 'List the starred repositories' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div > ul > li:nth-child(6)')
  //     .pause(1000)
  //     .waitForElementVisible('#user-starred', 2000, false)
  //     .saveScreenshot('list_starred_repos.png')
  // },
  // 'List the user gists' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div > ul > li:nth-child(3)')
  //     .pause(1000)
  //     .waitForElementVisible('#user-gists', 2000, false)
  //     .saveScreenshot('list_user_gists.png')
  // },
  // 'List the user followers' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div > ul > li:nth-child(4)')
  //     .pause(1000)
  //     .waitForElementVisible('#user-followers', 2000, false)
  //     .saveScreenshot('list_user_followers.png')
  // },
  // 'List who the user is following' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div > ul > li:nth-child(5)')
  //     .pause(1000)
  //     .waitForElementVisible('#user-following', 2000, false)
  // },
  // 'List the user repos' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > main > div > div > ul > li:nth-child(2)')
  //     .pause(1000)
  //     .waitForElementVisible('#user-repositories', 2000, false)
  //     .saveScreenshot('list_user_repositories.png')
  // },
  //
  // 'Create an issue' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > div > div > a:nth-child(2)')
  //     .pause(3000)
  //     .waitForElementVisible('#repos-list', 3000, false)
  //     .click('#repos-list > li:nth-child(2)')
  //     // if not, try this #repos-list > li:nth-child(1) > a
  //     .pause(1000)
  //     .waitForElementVisible('#known-repo-container', 45000, false)
  //     .pause(2000)
  //     .click('#app > div > main > div > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(6)')
  //     .pause(1000)
  //     .waitForElementVisible('#Issues', 2000, false)
  //     .pause(1000)
  //     .click('#Issues > div > div > div > div > div > a > button')
  //     .pause(1000)
  //     .waitForElementVisible('#create-issue', 20000, false)
  //     .setValue('#create-issue > form > div:nth-child(1) > div.flex.xs8.sm6 > div > div.input-group__input > input[type="text"]', 'Creating new issue title for testing')
  //     .setValue('#create-issue > form > div:nth-child(2) > div > div > div > div > div.input-group__input > textarea', 'Creating new issue body for testing')
  //     .click('#create-issue > form > button:nth-child(3)')
  //     .pause(1000)
  //     .waitForElementVisible('#success-alert', 10000, false)
  //     .waitForElementVisible('#single-issue', 30000, false)
  // },
  // 'Comment on an issue' : function (browser) {
  //   browser
  //     .useCss()
  //     .setValue('#single-issue > div.layout.row.wrap > div > div > div > div > div.input-group__input > textarea', 'Commenting on this issue just for testing.')
  //     .click('#single-issue > div.layout.row.wrap > div > div > button')
  //     .pause(1000)
  // },
  // 'List the pull requests of a repository' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#app > div > div > div > a:nth-child(2)')
  //     .pause(3000)
  //     .waitForElementVisible('#repos-list', 3000, false)
  //     .click('#repos-list > li:nth-child(2)')
  //     // if not, try this #repos-list > li:nth-child(1) > a
  //     .pause(1000)
  //     .waitForElementVisible('#known-repo-container', 45000, false)
  //     .pause(2000)
  //     .click('#known-repo-container > div.container.mt-3.grid-list-xl.text-xs-center.fluid > div.tabs > div > div > div > div:nth-child(8)')
  //     .pause(1000)
  //     .waitForElementVisible('#Pull-requests', 2000, false)
  //     .saveScreenshot('pull-requests.png')
  // },
  // 'Create a Pull-Request' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#Pull-requests > div > div > div > div > a > button')
  //     .pause(2000)
  //     .waitForElementVisible('#create-pull-request', 10000, false)
  //     .setValue('#create-pull-request > form > div:nth-child(1) > div.flex.xs8.sm6 > div > div.input-group__input > input[type="text"]', 'Creating a new PR title for testing')
  //     .setValue('#create-pull-request > form > div.flex.xs12 > div > div > div > div.input-group__input > textarea', 'Creating new pr body for testing')
  //     .setValue('#base-branch-select > div > div.input-group__input > div.input-group__selections > input', 'master')
  //     .pause(1000)
  //     .click('#app > div.menu__content.menu__content--select.menu__content--autocomplete.menuable__content__active > div > ul > li')
  //     .pause(1000)
  //     .setValue('#head-branch-select > div > div.input-group__input > div.input-group__selections > input', 'master')
  //     .pause(1000)
  //     .click('#app > div.menu__content.menu__content--select.menu__content--autocomplete.menuable__content__active > div > ul > li')
  //     .pause(1000)
  //     .click('#pr-modify-checkbox > div > div.input-group__input > div')
  //     .pause(1000)
  //     .click('#create-new-pr-button')
  //     .pause(1000)
  //     // .waitForElementVisible('#single-pull-request', 10000, false)
  //     .pause(1000)
  // },
  // 'Comment on a pull-request' : function (browser) {
  //   // browser
  //   //   .useCss()
  //   //   .setValue('#app > div > main > div > div.layout.row.wrap > div > div > div > div > div.input-group__input > textarea', 'Commenting on this pr just for testing.')
  //   //   .click('#app > div > main > div > div.layout.row.wrap > div > div > button')
  //   //   .pause(1000)
  // },
  // 'Make a commit' : function (browser) {
  //   var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  //   browser
  //     .useCss()
  //     .click('#app > div > div > div > a:nth-child(2)')
  //     .pause(3000)
  //     .waitForElementVisible('#repos-list', 3000, false)
  //     .click('#repos-list > li:nth-child(2)')
  //     // if not, try this #repos-list > li:nth-child(1) > a
  //     .pause(1000)
  //     .waitForElementVisible('#known-repo-container', 45000, false)
  //     .pause(2000)
  //     .click('#upload-button')
  //     .pause(1000)
  //     .waitForElementVisible('#create-file', 10000, false)
  //     .pause(1000)
  //     .setValue('#create-file > div:nth-child(1) > div.flex.xs8.sm6 > div > div.input-group__input > input[type="text"]', name + '.py')
  //     .setValue('#create-file > div.layout.row.wrap > div.flex.xs8.sm6 > div > div.input-group__input > div.input-group__selections > input', 'master')
  //     .pause(1000)
  //     .click('#app > div.menu__content.menu__content--select.menu__content--autocomplete.menuable__content__active > div > ul > li')
  //     .pause(1000)
  //     .setValue('#create-file > div:nth-child(3) > div > div > div.CodeMirror-scroll > div.CodeMirror-sizer', 'test content')
  //     .setValue('#create-file > div:nth-child(4) > div > div > div.input-group__input > textarea', 'test body create pr')
  //     .click('#create-file-button')
  //     .pause(1000)
  //     .waitForElementVisible('#success-alert', 30000, false)
  // },
  // 'List owned gists' : function (browser) {
  //     browser
  //       .useCss()
  //       .click('#app > div > div > div > a:nth-child(4)')
  //       .pause(1000)
  //       .waitForElementVisible('#gists-list', 10000, false)
  //       .saveScreenshot('list_gists.png')
  // },
  // 'Access a gist' : function (browser) {
  //   browser
  //     .useCss()
  //     .click('#e3 > div > div > div > ul > li:nth-child(2) > a > div')
  //     .pause(1000)
  //     .waitForElementVisible('#single-gist', 10000, false)
  //     .saveScreenshot('single_gist.png')
  // },
  // 'Create a repository' : function (browser) {
  //   var name = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  //   browser
  //     .useCss()
  //     .waitForElementVisible('#app > div > nav', 10000, false)
  //     .click('#toolbar-side-icon')
  //     .pause(1000)
  //     .waitForElementVisible('#app > div > aside', 10000, false)
  //     .pause(1000)
  //     .click('#app > div > aside > ul:nth-child(3) > li > a')
  //     .pause(1000)
  //     .waitForElementVisible('#create-repo-container', 30000, false)
  //     .setValue('#create-repo-container > form > div.layout.row.wrap > div.flex.xs8.sm8 > div > div.input-group__input > input[type="text"]', name)
  //     .setValue('#create-repo-container > form > div:nth-child(4) > div.flex.xs8.sm6 > div > div.input-group__input > textarea', 'test repo description')
  //     .setValue('#create-repo-container > form > div:nth-child(5) > div.flex.xs8.sm6 > div > div.input-group__input > input[type="text"]', 'test-repo.com')
  //     .setValue('#create-repo-container > form > div:nth-child(6) > div.flex.xs8.sm6 > div > div.input-group__input > div.input-group__selections > input', 'MIT License')
  //     .click('#app > div.menu__content.menu__content--select.menu__content--autocomplete.menuable__content__active > div > ul > li')
  //     .pause(1000)
  //     .setValue('#create-repo-container > form > div:nth-child(7) > div.flex.xs8.sm6 > div > div.input-group__input > div.input-group__selections > input', 'Python')
  //     .click('#app > div.menu__content.menu__content--select.menu__content--autocomplete.menuable__content__active > div > ul > li')
  //     .pause(1000)
  //     .click('#create-repo-container > form > div.input-group.input-group--dirty.radio-group.radio-group--column > div.input-group__input > div:nth-child(2)')
  //     .pause(1000)
  //     .click('#create-repo-container > form > div:nth-child(9) > div > div')
  //     .pause(1000)
  //     .click('#create-repo-container > form > button:nth-child(10)')
  //     .pause(1000)
  //     .waitForElementVisible('#repos-list', 120000, false)
  //     .saveScreenshot('create_repo.png')
  // },
  'Logout' : function (browser) {
    browser
      .useCss()
      .click('#toolbar-side-icon')
      .pause(1000)
      .waitForElementVisible('#app > div > aside', 10000, false)
      .click('#logout-button')
      .pause(1000)
      .waitForElementVisible('#hello-component', 10000, false)
      .saveScreenshot('profile.png')
  },


};
