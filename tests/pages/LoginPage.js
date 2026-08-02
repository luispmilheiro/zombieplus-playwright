import { expect } from '@playwright/test';

export class LoginPage {

    constructor(page) {
        this.page = page
    }

    async visit() {
        await this.page.goto('http://localhost:3000/admin/login');
        expect(this.page.locator('.login-form')).toBeVisible()
    }

    async submitLoginForm(email, password) {
        await this.page.getByPlaceholder('E-mail').fill(email)
        await this.page.getByPlaceholder('Senha').fill(password)
        await this.page.locator('button[type=submit]').getByText('Entrar').click()
    }

    async alertHaveText(target) {
        await expect(this.page.locator('span[class$=alert]')).toHaveText(target)
    }

}