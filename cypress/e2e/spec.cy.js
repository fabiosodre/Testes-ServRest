import { faker } from '@faker-js/faker';

describe('Teste de login', () => {
  
  beforeEach(() => {
    cy.login('fabio.sodre.prof@gmail.com', '123456') //custom commands para login via API
  })

  it('Login via API', () => {
    cy.visit('https://front.serverest.dev/admin/home')
  })
  
  it('Login com sucesso', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="email"]').type('fabio.sodre.prof@gmail.com')
    cy.get('[data-testid="senha"]').type('123456')
    cy.get('[data-testid="entrar"]').click()
  })
  it('Login com falha', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="email"]').type('fabio.sodre.prof@gmail.com')
    cy.get('[data-testid="senha"]').type('123')
    cy.get('[data-testid="entrar"]').click()
    cy.get('.alert').contains('Email e/ou senha inválidos')
  })
  })

  describe.only('Cadastro de usuário', () => {

    const randomName = faker.person.firstName()
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password();

    it('Novo cadastro', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(randomName)
    cy.get('[data-testid="email"]').type(randomEmail)
    cy.get('[data-testid="password"]').type(randomPassword)
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Cadastro realizado com sucesso')
  })

  it('Novo cadastro como administrador', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(faker.person.firstName())
    cy.get('[data-testid="email"]').type(faker.internet.email())
    cy.get('[data-testid="password"]').type(faker.internet.password())
    cy.get('[data-testid="checkbox"]').check() //marcando o checkbox
    cy.get('[data-testid="checkbox"]').should('be.checked') //confirmando que está marcado
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Cadastro realizado com sucesso')
  })

    it('Cadastro repetido', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(randomName)
    cy.get('[data-testid="email"]').type(randomEmail)
    cy.get('[data-testid="password"]').type(randomPassword)
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Este email já está sendo usado')
  })

  it.only('Deve validar que o campo Nome é obrigatório', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="email"]').type(randomEmail)
    cy.get('[data-testid="password"]').type(randomPassword)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Nome é obrigatório', { timeout: 10000 })
  .should('be.visible');
  })

  })
