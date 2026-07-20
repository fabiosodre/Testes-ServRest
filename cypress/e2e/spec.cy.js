import { createRandomUser } from '../support/helpers/userHelper'

describe('Login', () => {
  
  it('Deve realizar o login com sucesso', () => {
    cy.createUser().then((user) => {

      cy.visit('/login')

      cy.get('[data-testid="email"]').type(user.email)
      cy.get('[data-testid="senha"]').type(user.password)

      cy.get('[data-testid="entrar"]').click()

      cy.url().should('include', '/home')
    })
  })

  it('Deve exibir mensagem ao informar senha inválida', () => {
    cy.visit('/login')
    cy.get('[data-testid="email"]').type('fabio.sodre.prof@gmail.com')
    cy.get('[data-testid="senha"]').type('123')
    cy.get('[data-testid="entrar"]').click()
    cy.get('.alert').contains('Email e/ou senha inválidos')
  })
})

describe('Usuário autenticado', () => {
  beforeEach(() => {
    cy.createUserAdmin().then((admin) => {
      cy.login(admin.email, admin.password) //custom commands para login via API
    })
  })
  
  it('Deve acessar a área administrativa via login API', () => {
    cy.visit('/admin/home')
    cy.url().should('include', '/admin/home')
  })

  it('Deve realizar logout', () =>{
    cy.visit('/admin/home')
    cy.get('[data-testid="logout"]').click()
    cy.url({timeout:10000}).should('include', '/login')
  })

})

describe('Cadastro de usuário - Tela de Login', () => {

  it('Deve cadastrar um usuário e redirecionar para a home', () => {
    const RandomUser = createRandomUser()
    cy.visit('/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(RandomUser.nome)
    cy.get('[data-testid="email"]').type(RandomUser.email)
    cy.get('[data-testid="password"]').type(RandomUser.password)
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Cadastro realizado com sucesso')
    cy.url({timeout:10000}).should('include', '/home')
  })

  it('Deve cadastrar um usuário administrador e redirecionar para a admin home', () => {
    const RandomUser = createRandomUser()
    cy.visit('/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(RandomUser.nome)
    cy.get('[data-testid="email"]').type(RandomUser.email)
    cy.get('[data-testid="password"]').type(RandomUser.password)
    cy.get('[data-testid="checkbox"]').check() //marcando o checkbox
    cy.get('[data-testid="checkbox"]').should('be.checked') //confirmando que está marcado
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('.alert').contains('Cadastro realizado com sucesso')
    cy.url({timeout:10000}).should('include', '/admin/home')
  })

  it('Cadastro repetido', () => {
    cy.createUser().then((user) => {

      cy.visit('/login')
      cy.get('[data-testid="cadastrar"]').click()

      cy.get('[data-testid="nome"]').type(user.nome)
      cy.get('[data-testid="email"]').type(user.email)
      cy.get('[data-testid="password"]').type(user.password)

      cy.get('[data-testid="cadastrar"]').click()

      cy.get('.alert').contains('Este email já está sendo usado')
    })
  })

  it('Deve validar que o campo Nome é obrigatório', () => {
    const RandomUser = createRandomUser()
    cy.visit('/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="email"]').type(RandomUser.email)
    cy.get('[data-testid="password"]').type(RandomUser.password)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Nome é obrigatório', { timeout: 10000 })
    .should('be.visible');
  })

  it('Deve validar que o campo E-mail é obrigatório', () => {
    const RandomUser = createRandomUser()
    cy.visit('/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(RandomUser.nome)
    cy.get('[data-testid="password"]').type(RandomUser.password)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Email é obrigatório', { timeout: 10000 })
  .should('be.visible');
  })

  it('Deve validar que o campo Senha é obrigatório', () => {
    const RandomUser = createRandomUser()
    cy.visit('/login')
    cy.get('[data-testid="cadastrar"]').click()
    cy.get('[data-testid="nome"]').type(RandomUser.nome)
    cy.get('[data-testid="email"]').type(RandomUser.email)
    cy.get('[data-testid="cadastrar"]').click()
    cy.contains('.alert', 'Password é obrigatório', { timeout: 10000 })
  .should('be.visible');
  })
})

describe('Cadastro de usuário - Painel Administrativo', () => {

  beforeEach(() => {
    cy.createUserAdmin().then((admin) => {
    cy.login(admin.email, admin.password)
  })
  })
    
  it('Deve cadastrar um usuário e redirecionar para a lista de usuários', () => {
    
    const RandomUser = createRandomUser()
    cy.intercept('POST', '**/usuarios').as('cadastrarusuarios')
    
    cy.visit('/admin/home')

    cy.get('[data-testid="cadastrarUsuarios"]').click()
    cy.get('[data-testid="nome"]').type(RandomUser.nome)
    cy.get('[data-testid="email"]').type(RandomUser.email)
    cy.get('[data-testid="password"]').type(RandomUser.password)
    cy.get('[data-testid="cadastrarUsuario"]').click()

    cy.wait('@cadastrarusuarios').then(({ request, response }) => {
      expect(request.body.nome).to.eq(RandomUser.nome)
      expect(request.body.email).to.eq(RandomUser.email)
      expect(request.body.password).to.eq(RandomUser.password)
      expect(response.statusCode).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
    })
      
    cy.url({timeout:10000}).should('include', '/listarusuarios')
  }) 

  it('Deve cadastrar um usuário administrador e redirecionar para a lista de usuários', () => {
    
    const RandomUser = createRandomUser()
    cy.intercept('POST', '**/usuarios').as('cadastrarusuarios')

    cy.visit('/admin/home')  
    
    cy.get('[data-testid="cadastrarUsuarios"]').click()
    cy.get('[data-testid="nome"]').type(RandomUser.nome)
    cy.get('[data-testid="email"]').type(RandomUser.email)
    cy.get('[data-testid="password"]').type(RandomUser.password)
    cy.get('[data-testid="checkbox"]').check() //marcando o checkbox
    cy.get('[data-testid="checkbox"]').should('be.checked') //confirmando que está marcado
    cy.get('[data-testid="cadastrarUsuario"]').click()

    cy.wait('@cadastrarusuarios').then(({ request, response }) => {
      expect(request.body.nome).to.eq(RandomUser.nome)
      expect(request.body.email).to.eq(RandomUser.email)
      expect(request.body.password).to.eq(RandomUser.password)  
      expect(request.body.administrador).to.eq('true')
      expect(response.statusCode).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
    })

    cy.url({timeout:10000}).should('include', '/listarusuarios')
    })
    
})
