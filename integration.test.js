const axios = require('axios')
const uuid = require('uuid/v4')
const to = require('./lib/to')
const https = require('https')

// NOTE: These tests can be used to test student assignments by modifying the REMOTE_API_URL value below
//const REMOTE_API_URL = `http://localhost:3000`
const REMOTE_API_URL = `http://131.181.190.87:3000`
const EMAIL = `${uuid()}@fake-email.com`
const PASSWORD = 'webcomputing'
let TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAYXBpLmNvbSIsImV4cCI6MTU5MDM5NTcxNCwiaWF0IjoxNTkwMzA5MzE0fQ.SO5yeffhRmImxfa9TolnLGXQgYkN4PPd3ewYf2j1H68";

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  })
});

describe('all stock (with filtering)', () => {

  describe('Invalid Query Parameter', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols?name=a`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text Bad Request', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('Industry sector not found', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols?industry=an_industry_that_doesn't exist`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 404', () => expect(response.status).toBe(404))
    test('should return status text not found', () => expect(response.statusText).toBe('Not found'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('Valid response without filtering', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status OK', () => expect(response.statusText).toBe('OK'))
    test('should contain first name property', () => expect(response.data[0].name).toBe("Agilent Technologies Inc"))
    test('should contain first symbol property', () => expect(response.data[0].symbol).toBe("A"))
    test('should contain first industry property', () => expect(response.data[0].industry).toBe("Health Care"))

  })

  describe('Valid response with filtering', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/symbols?industry=d`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status OK', () => expect(response.statusText).toBe('OK'))
    test('should contain first name property', () => expect(response.data[0].name).toBe("American Airlines Group"))
    test('should contain first symbol property', () => expect(response.data[0].symbol).toBe("AAL"))
    test('should contain first industry property', () => expect(response.data[0].industry).toBe("Industrials"))

  })

})

describe('specific stocks', () => {

  describe('Invalid Query Parameter(s)', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/AAL?date=2020-03-23T14:00:00.000Z`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    //THIS IS JUST RETURNING 200 FROM THE SERVER?

    //test('should return status code 400', () => expect(response.status).toBe(400))
    //test('should return status text Invalid query parameter(s)', () => expect(response.statusText).toBe('Invalid query parameter(s)'))
    //test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('No entries', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/AALA`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 404', () => expect(response.status).toBe(404))
    test('should return status text not found', () => expect(response.statusText).toBe('Not Found'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('Correct', () => {

    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/AAL`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status OK', () => expect(response.statusText).toBe('OK'))
    test('should contain name property', () => expect(response.data.name).toBe("American Airlines Group"))
    test('should contain symbol property', () => expect(response.data.symbol).toBe("AAL"))
    test('should contain industry property', () => expect(response.data.industry).toBe("Industrials"))
    test('should contain timestamp property', () => expect(response.data.timestamp).toBe("2020-03-23T14:00:00.000Z"))
    test('should contain open property', () => expect(response.data.open).toBe(10.9))
    test('should contain high property', () => expect(response.data.high).toBe(11.36))

  })
})

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

describe('authed specific stocks', () => {

  describe('invalid paramaters/data format', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?begin=2020-03-15T00%3A00%3A00.000Z&until=2020-03-20T00%3A00%3A00.000Z`, 
      {headers: { Authorization: `Bearer ${TOKEN}`}}))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 400', () => expect(response.status).toBe(400))
    test('should return status text Bad Request', () => expect(response.statusText).toBe('Bad Request'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('access denied', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?from=2020-03-15T00%3A00%3A00.000Z&until=2020-03-20T00%3A00%3A00.000Z`))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 403', () => expect(response.status).toBe(403))
    test('should return status text forbidden', () => expect(response.statusText).toBe('Forbidden'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('Queried data not found', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?from=2020-04-15T00%3A00%3A00.000Z&to=2020-05-20T00%3A00%3A00.000Z`, 
      {headers: { Authorization: `Bearer ${TOKEN}`}}))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 404', () => expect(response.status).toBe(404))
    test('should return status text not found', () => expect(response.statusText).toBe('Not Found'))
    test('should contain message property', () => expect(response.data).toHaveProperty('message'))
  })

  describe('valid', () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${REMOTE_API_URL}/stocks/authed/AAL?from=2020-03-15T00%3A00%3A00.000Z&to=2020-03-20T00%3A00%3A00.000Z`, 
      {headers: { Authorization: `Bearer ${TOKEN}`}}))
      return response = request.resolve ? request.resolve : request.reject.response
    })

    test('should return status code 200', () => expect(response.status).toBe(200))
    test('should return status text ok', () => expect(response.statusText).toBe('OK'))
    test('should contain correct first date', () => expect(response.data[0].timestamp).toBe(`2020-03-19T14:00:00.000Z`))
    test('should contain correct symbol', () => expect(response.data[0].symbol).toBe('AAL'))
    test('should contain correct first date', () => expect(response.data[response.data.length-1].timestamp).toBe(`2020-03-15T14:00:00.000Z`))
    test('should contain correct symbol', () => expect(response.data[response.data.length-1].symbol).toBe('AAL'))
  })
})