// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })



Cypress.Commands.add('createUser', () => {
const user = {
    nome: 'User',
    email: `user_${Date.now()}@teste.com`,
    password: '123456',
    administrador: 'false'
  }
  return cy.request('POST', 'https://serverest.dev/usuarios', user)
  .then((response) => {
    expect(response.status).to.eq(201)
    return {
        ...user,
        id: response.body._id
      }
  }) 
})

Cypress.Commands.add('createUserAdmin', () => {
const admin = {
    nome: 'Admin',
    email: `admin_${Date.now()}@teste.com`,
    password: '123456',
    administrador: 'true'
  }
  return cy.request('POST', 'https://serverest.dev/usuarios', admin)
  .then((response) => {
    expect(response.status).to.eq(201)
    return {
        ...admin,
        id: response.body._id
      }
  }) 
})

Cypress.Commands.add('login', (email,password) => { 
 cy.request('POST', 'https://serverest.dev/login', {
    email: email,
    password: password
  }).then((response) => {
    cy.window().then((win) => {
      win.localStorage.setItem(
      'serverest/userToken',
      response.body.authorization
    )
    })
  })   
 })