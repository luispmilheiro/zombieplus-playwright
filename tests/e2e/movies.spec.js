import { test } from '../support'
import { executeSQL } from '../support/database'

const data = require('../support/fixtures/movies.json')

test.beforeEach(async ({ page }) => {
    await page.login.visit()
})

test('deve cadastrar um novo filme', async ({ page }) => {
    const movie = data.create
    await executeSQL(`DELETE FROM movies WHERE title = '${movie.title}';`)

    await page.login.submitLoginForm('admin@zombieplus.com', 'pwd123')
    await page.movies.isLoggedIn()

    await page.movies.create(movie.title, movie.overview, movie.company, movie.release_year)

    await page.toast.containText('Cadastro realizado com sucesso!')
})