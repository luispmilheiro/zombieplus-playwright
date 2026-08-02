import { expect } from '@playwright/test';

export class Movies {

    constructor(page) {
        this.page = page
    }

    async goToForm() {
        await this.page.locator('a[href$="/register"]').click()
    }

    async submitForm() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(movie) {
        await this.goToForm()

        await this.page.locator('#title').fill(movie.title)

        await this.page.locator('#overview').fill(movie.overview)

        await this.page.locator('#select_company_id').click()
        await this.page.locator('#select_company_id .react-select__option').filter({ hasText: movie.company }).click()

        await this.page.locator('#select_year').click()
        await this.page.locator('#select_year .react-select__option').filter({ hasText: movie.release_year }).click()

        await this.page.locator('#cover').setInputFiles('tests/support/fixtures' + movie.cover)

        if (movie.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submitForm()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }
}