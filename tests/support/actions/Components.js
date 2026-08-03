import { expect } from '@playwright/test';

export class Toast {

    constructor(page) {
        this.page = page
    }

    async containText(message) {
        const toast = this.page.locator('.toast')
        await expect(toast).toContainText(message)
        await expect(toast).not.toBeVisible({ timeout: 5000 })
    }
}

export class Dialog {

    constructor(page) {
        this.page = page
    }

    async haveText(message) {
        const dialog = this.page.locator('#swal2-html-container')
        await expect(dialog).toHaveText(message)
        await this.page.locator('.swal2-confirm').click()
    }
}