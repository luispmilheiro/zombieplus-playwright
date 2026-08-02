import { test, expect } from '../support'
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  await page.landing.submitLeadForm(faker.person.fullName(), faker.internet.email())

  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await page.toast.containText(message)
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

  await page.landing.submitLeadForm(leadName, leadEmail)

  const message = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'
  await page.toast.containText(message)
});

test('não deve cadastrar email incorreto', async ({ page }) => {
  await page.landing.submitLeadForm(faker.person.fullName(), 'www.gmail.com')
  await page.landing.alertHaveText('Email incorreto')
});

test('não deve cadastrar sem nome', async ({ page }) => {
  await page.landing.submitLeadForm('', faker.internet.email())
  await page.landing.alertHaveText('Campo obrigatório')
});

test('não deve cadastrar sem email', async ({ page }) => {
  await page.landing.submitLeadForm(faker.person.fullName(), '')
  await page.landing.alertHaveText('Campo obrigatório')
});

test('não deve cadastrar sem dados', async ({ page }) => {
  await page.landing.submitLeadForm('', '')
  await page.landing.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
});