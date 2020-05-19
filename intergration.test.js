const axios = require('axios')
const uuid = require('uuid/v4')
const to = require('./lib/to')
const https = require('https')

// NOTE: These tests can be used to test student assignments by modifying the REMOTE_API_URL value below
const REMOTE_API_URL = `http://localhost:3000`
const EMAIL = `${uuid()}@fake-email.com`
const PASSWORD = 'webcomputing'

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
});

describe('user', () => {
  describe('registration', () => {
    describe('with missing email', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, { password: PASSWORD }))
        return response = request.resolve ? request.resolve : request.reject.response
      })

      // test('should print response debug message', () => console.log(response))
      test('should return status code 400', () => expect(response.status).toBe(400))
      test('should return status text Bad Request', () => expect(response.statusText).toBe('Bad Request'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })

    describe('with missing password', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, { email: EMAIL }))
        return response = request.resolve ? request.resolve : request.reject.response
      })

      // test('should print response debug message', () => console.log(response))
      test('should return status code 400', () => expect(response.status).toBe(400))
      test('should return status text Bad Request', () => expect(response.statusText).toBe('Bad Request'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })

    describe('with missing email and password', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, {}))
        return response = request.resolve ? request.resolve : request.reject.response
      })

      // test('should print response debug message', () => console.log(response))
      test('should return status code 400', () => expect(response.status).toBe(400))
      test('should return status text Bad Request', () => expect(response.statusText).toBe('Bad Request'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })

    describe('with valid email and password', () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`${REMOTE_API_URL}/user/register`, { email: EMAIL, password: PASSWORD }))
        return response = request.resolve ? request.resolve : request.reject.response
      })

      // test('should print response debug message', () => console.log(response))
      test('should return status code 201', () => expect(response.status).toBe(201))
      test('should return status text Created', () => expect(response.statusText).toBe('Created'))
      test('should contain message property', () => expect(response.data).toHaveProperty('message'))
    })
  })
})

describe('login', () => {
  describe('with missing email', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { password: PASSWORD }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    // test('should print response debug message', () => console.log(response))
    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text Created', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with missing password', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    // test('should print response debug message', () => console.log(response))
    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text Created', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with non-existing user (email)', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: `${uuid()}@fake-email.com`, password: PASSWORD }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    // test('should print response debug message', () => console.log(response))
    test('should return status code 401', () => expect(response.status).toBe(401))
    test('should return status text Created', () => expect(response.statusText).toBe('Unauthorized'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with invalid password', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL, password: 'PASSWORD' }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    // test('should print response debug message', () => console.log(response))
    test('should return status code 401', () => expect(response.status).toBe(401))
    test('should return status text Created', () => expect(response.statusText).toBe('Unauthorized'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('with valid email and password', () => {
    beforeAll(async () => {
      const request = await to.object(instance.post(`${REMOTE_API_URL}/user/login`, { email: EMAIL, password: PASSWORD }))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    // test('should print response debug message', () => console.log(response))
    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status text Created', () => expect(response.statusText).toBe('OK'))
    test('should contain token property', () => expect(response.data).toHaveProperty('token'))
    test('should contain token_type property', () => expect(response.data).toHaveProperty('token_type'))
    test('should contain expires_in property', () => expect(response.data).toHaveProperty('expires_in'))
    test('should contain correct token_type', () => expect(response.data.token_type).toBe(`Bearer`))
    test('should contain correct expires_in', () => expect(response.data.expires_in).toBe(86400))
  })
})

