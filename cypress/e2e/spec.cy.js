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

  it('Logout do sistema', () =>{
    cy.visit('https://front.serverest.dev/admin/home')
    cy.get('[data-testid="logout"]').click()
    cy.url({timeout:10000}).should('include', '/login')
  })
  })

  describe('Cadastro de usuário - Tela de Login', () => {

    const randomName = faker.person.firstName()
    const randomEmail = faker.internet.email();
    const randomPassword = faker.internet.password();

  it('Deve cadastrar um usuário e redirecionar para a home', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(randomName)
    cy.get('[data-testid="email"]').type(randomEmail)
    cy.get('[data-testid="password"]').type(randomPassword)
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Cadastro realizado com sucesso')
    cy.url({timeout:10000}).should('include', '/home')
  })

  it('Deve cadastrar um usuário administrador e redirecionar para a admin home', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(faker.person.firstName())
    cy.get('[data-testid="email"]').type(faker.internet.email())
    cy.get('[data-testid="password"]').type(faker.internet.password())
    cy.get('[data-testid="checkbox"]').check() //marcando o checkbox
    cy.get('[data-testid="checkbox"]').should('be.checked') //confirmando que está marcado
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Cadastro realizado com sucesso')
    cy.url({timeout:10000}).should('include', '/admin/home')
  })

  it.only('Cadastro repetido', () => {
    cy.createUser().then((user) => {

      cy.visit('https://front.serverest.dev/login')
      cy.get('[data-testid="cadastrar"]').click()

      cy.get('[data-testid="nome"]').type(user.nome)
      cy.get('[data-testid="email"]').type(user.email)
      cy.get('[data-testid="password"]').type(user.password)

      cy.get('[data-testid="cadastrar"]').click()

      cy.get('.alert').contains('Este email já está sendo usado')
    })
  })

  it('Deve validar que o campo Nome é obrigatório', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="email"]').type(randomEmail)
    cy.get('[data-testid="password"]').type(randomPassword)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Nome é obrigatório', { timeout: 10000 })
  .should('be.visible');
  })

  it('Deve validar que o campo E-mail é obrigatório', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(randomName)
    cy.get('[data-testid="password"]').type(randomPassword)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Email é obrigatório', { timeout: 10000 })
  .should('be.visible');
  })

  it('Deve validar que o campo Senha é obrigatório', () => {
    cy.visit('https://front.serverest.dev/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(randomName)
    cy.get('[data-testid="email"]').type(randomEmail)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Password é obrigatório', { timeout: 10000 })
  .should('be.visible');
  })

describe('Cadastro de usuário - Painel Administrativo', () => {
    
  beforeEach(() => {
    cy.createUserAdmin().then((admin) => {
    cy.log(JSON.stringify(admin))
    cy.login(admin.email, admin.password)
  })
  })
    
    it('Deve cadastrar um usuário e redirecionar para a lista de usuários', () => {
      
      cy.intercept('POST', '**/usuarios').as('cadastrarusuarios')

      cy.visit('https://front.serverest.dev/admin/home')

      cy.get('[data-testid="cadastrarUsuarios"]').click()
      cy.get('[data-testid="nome"]').type(randomName)
      cy.get('[data-testid="email"]').type(randomEmail)
      cy.get('[data-testid="password"]').type(randomPassword)
      cy.get('[data-testid="cadastrarUsuario"]').click()

      cy.wait('@cadastrarusuarios').then(({ request, response }) => {
        expect(request.body.nome).to.eq(randomName)
        expect(request.body.email).to.eq(randomEmail)
        expect(response.statusCode).to.eq(201)
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      })

      cy.url({timeout:10000}).should('include', '/listarusuarios')
    }) 

    it('Deve cadastrar um usuário administrador e redirecionar para a lista de usuários', () => {
      cy.intercept('POST', '**/usuarios').as('cadastrarusuarios')

      cy.visit('https://front.serverest.dev/admin/home')  
      
      cy.get('[data-testid="cadastrarUsuarios"]').click()
      cy.get('[data-testid="nome"]').type(randomName)
      cy.get('[data-testid="email"]').type(randomEmail)
      cy.get('[data-testid="password"]').type(randomPassword)
      cy.get('[data-testid="checkbox"]').check() //marcando o checkbox
      cy.get('[data-testid="checkbox"]').should('be.checked') //confirmando que está marcado
      cy.get('[data-testid="cadastrarUsuario"]').click()

      cy.wait('@cadastrarusuarios').then(({ request, response }) => {
        expect(request.body.nome).to.eq(randomName)
        expect(request.body.email).to.eq(randomEmail)
        expect(request.body.administrador).to.eq('true')
        expect(response.statusCode).to.eq(201)
        expect(response.body.message).to.eq('Cadastro realizado com sucesso')
      })

      cy.url({timeout:10000}).should('include', '/listarusuarios')
    })
    
})

  })
