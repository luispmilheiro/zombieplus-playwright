import { test } from '../support'

test.beforeEach(async ({ page }) => {
  await page.login.visit()
})

test('deve logar como administrador', async ({ page }) => {
  await page.login.submitLoginForm('admin@zombieplus.com', 'pwd123')

  await page.login.isLoggedIn('Admin')
})

test('não deve logar com senha incorreta', async ({ page }) => {
  await page.login.submitLoginForm('admin@zombieplus.com', 'senha123')

  const message = /Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente./
  await page.toast.containText(message)
})

test('não deve logar com email inválido', async ({ page }) => {
  await page.login.submitLoginForm('admin.zombieplus.com', 'pwd123')

  await page.login.alertHaveText('Email incorreto')
})

test('não deve logar sem email', async ({ page }) => {
  await page.login.submitLoginForm('', 'pwd123')

  await page.login.alertHaveText('Campo obrigatório')
})

test('não deve logar sem senha', async ({ page }) => {
  await page.login.submitLoginForm('admin@zombieplus.com', '')

  await page.login.alertHaveText('Campo obrigatório')
})

test('não deve logar sem dados', async ({ page }) => {
  await page.login.submitLoginForm('', '')

  await page.login.alertHaveText(['Campo obrigatório', 'Campo obrigatório'])
})