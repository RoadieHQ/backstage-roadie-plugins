/*
 * Copyright 2021 Larder Software Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="cypress" />

Cypress.Commands.add('loginAsGuest', () => {
  cy.visit('/', {
    onLoad: (win: Window) =>
      win.localStorage.setItem('@backstage/core:SignInPage:provider', 'guest'),
  });
});

Cypress.Commands.add('saveGithubToken', () => {
  cy.intercept(
    'GET',
    'http://localhost:7007/api/auth/github/refresh?optional&scope=read%3Auser%20repo%20read%3Aorg&env=development',

    { fixture: 'githubLogin/login.json' },
  );
  cy.intercept(
    'GET',
    'http://localhost:7007/api/auth/github/refresh?optional&scope=read%3Auser%20repo&env=development',

    { fixture: 'githubLogin/login.json' },
  );
});

export {};
