import { test, expect } from '../support'
import { faker } from '@faker-js/faker'

import { executeSQL } from '../support/database'

test.beforeAll(async () => {
    await executeSQL('DELETE FROM leads')
})

test.beforeEach(async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  await page.leads.submitLeadForm(faker.person.fullName(), faker.internet.email())

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.dialog.haveText(message)
});

test('não deve cadastrar email já existente', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })
  expect(newLead.ok()).toBeTruthy()

  await page.leads.submitLeadForm(leadName, leadEmail)

  const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'
  await page.dialog.haveText(message)
});

test('não deve cadastrar email incorreto', async ({ page }) => {
  await page.leads.submitLeadForm(faker.person.fullName(), 'www.gmail.com')
  await page.leads.alertHaveText('Email incorreto')
});

test('não deve cadastrar sem nome', async ({ page }) => {
  await page.leads.submitLeadForm('', faker.internet.email())
  await page.leads.alertHaveText('Campo obrigatório')
});

test('não deve cadastrar sem email', async ({ page }) => {
  await page.leads.submitLeadForm(faker.person.fullName(), '')
  await page.leads.alertHaveText('Campo obrigatório')
});

test('não deve cadastrar sem dados', async ({ page }) => {
  await page.leads.submitLeadForm('', '')
  await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
});