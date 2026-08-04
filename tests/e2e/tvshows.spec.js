import { test, expect } from '../support'
import { executeSQL } from '../support/database'

const data = require('../support/fixtures/tvshows.json')

test.beforeAll(async () => {
    await executeSQL('DELETE FROM tvshows')
})

test('deve cadastrar uma nova série', async ({ page }) => {
    const tvshow = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    await page.dialog.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('deve poder remover uma série', async ({ page, request }) => {
    const tvshow = data.to_remove
    await request.api.postTvShow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.visit()
    await page.tvshows.remove(tvshow)
    await page.dialog.haveText('Série removida com sucesso.')
})

test('não deve cadastrar um título duplicado', async ({ page, request }) => {
    const tvshow = data.duplicate
    await request.api.postTvShow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    await page.dialog.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)
})

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({ page }) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goToForm()
    await page.tvshows.submitForm()
    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('deve realizar busca pelo termo zombie', async ({ page, request }) => {
    const tvshows = data.search
    tvshows.data.forEach(async (t) => {
        await request.api.postTvShow(t)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.visit()
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})