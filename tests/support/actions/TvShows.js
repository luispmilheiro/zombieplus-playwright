import { expect } from '@playwright/test';

export class TvShows {

    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('/admin/tvshows');
        expect(this.page.locator('//h1[text()="Séries de TV"]')).toBeVisible()
    }

    async goToForm() {
        await this.visit()
        await this.page.locator('a[href$="/register"]').click()
    }

    async submitForm() {
        await this.page.getByRole('button', { name: 'Cadastrar' }).click()
    }

    async create(tvshow) {
        await this.goToForm()

        await this.page.locator('#title').fill(tvshow.title)

        await this.page.locator('#overview').fill(tvshow.overview)

        await this.page.locator('#select_company_id').click()
        await this.page.locator('#select_company_id .react-select__option').filter({ hasText: tvshow.company }).click()

        await this.page.locator('#select_year').click()
        await this.page.locator('#select_year .react-select__option').filter({ hasText: tvshow.release_year }).click()

        await this.page.locator('#seasons').fill(String(tvshow.season))

        await this.page.locator('#cover').setInputFiles('tests/support/fixtures' + tvshow.cover)

        if (tvshow.featured) {
            await this.page.locator('.featured .react-switch').click()
        }

        await this.submitForm()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('.alert')).toHaveText(target)
    }

    async remove(tvshow) {
        await this.page.getByRole('row', { name: tvshow.title }).getByRole('button').click()
        await this.page.click('.confirm-removal')
    }

    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome').fill(target)
        await this.page.click('.actions button')
    }

    async tableHave(content) {
        const rows = await this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }
}