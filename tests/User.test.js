const request = require('supertest')
const User = require('../models/User')
const userRoutes = require('../routes/userRoutes')
const express = require('express')
const server = express()
const connectDB = require('../config/dbConn')
// const bodyParser = require('body-parser')


  connectDB()
  server.use(express.json())
  server.use("/users", userRoutes)


describe('Users controller', () => {
  let user
  let testPassword
  beforeEach(async () => {

    testPassword = 'testpassword'
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: testPassword
    })
  })

  afterEach(async () => {
    await User.deleteMany({})
  })

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(server).get('/users')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        {
          __v: expect.anything(),
          _id: expect.any(String),
          createdAt: expect.any(String),
          username: 'testuser',
          email: 'test@example.com'
        }
      ])
    })
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const response = await request(server).post('/users').type('json').send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: testPassword
      })
      .set('Accept', 'application/json')
      .expect(201)
      expect(response.body).toEqual({ message: 'New user newuser' })
    })

    it('should return error if user already exists', async () => {
      const response = await request(server).post('/users').send({
        username: 'testuser',
        email: 'newuser2@example.com',
        password: testPassword
      })

      expect(response.status).toBe(409)
      expect(response.body).toEqual({ message: 'Duplicate username' })
    })
  })
})