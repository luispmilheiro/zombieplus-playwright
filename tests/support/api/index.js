import { expect } from '@playwright/test'
require('dotenv').config({ quiet: true })

export class Api {

    constructor(request) {
        this.base_api = process.env.BASE_API
        this.request = request
        this.token = undefined
    }

    async setToken() {
        const response = await this.request.post(this.base_api + '/sessions', {
            data: {
                email: 'admin@zombieplus.com',
                password: 'pwd123'
            }
        })
        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        this.token = 'Bearer ' + body.token
    }

    async getCompanyIdByName(companyName) {
        const response = await this.request.get(this.base_api + '/companies', {
            headers: {
                Authorization: this.token
            },
            params: {
                name: companyName
            }
        })
        expect(response.ok()).toBeTruthy()
        const body = JSON.parse(await response.text())
        return body.data[0].id
    }

    async postMovie(movie) {
        const response = await this.request.post(this.base_api + '/movies', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: movie.title,
                overview: movie.overview,
                company_id: await this.getCompanyIdByName(movie.company),
                release_year: movie.release_year,
                featured: movie.featured,
            }
        })
        expect(response.ok()).toBeTruthy()
    }

    async postTvShow(tvshow) {
        const response = await this.request.post(this.base_api + '/tvshows', {
            headers: {
                Authorization: this.token,
                ContentType: 'multipart/form-data',
                Accept: 'application/json, text/plain, */*'
            },
            multipart: {
                title: tvshow.title,
                overview: tvshow.overview,
                company_id: await this.getCompanyIdByName(tvshow.company),
                release_year: tvshow.release_year,
                seasons: tvshow.season,
                featured: tvshow.featured,
            }
        })
        expect(response.ok()).toBeTruthy()
    }

}