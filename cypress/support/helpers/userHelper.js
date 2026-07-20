import { faker } from '@faker-js/faker'

export const createRandomUser = () => ({
  nome: faker.person.firstName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
})