const request = require('supertest')
const Habit = require('../models/Habit')
const habitRoutes = require('../routes/habitRoutes')
const express = require('express')
const server = express()
const connectDB = require('../config/dbConn')

connectDB()
server.use(express.json())
server.use("/habits", habitRoutes)

describe('Habits controller', () => {
  let habit
  let testName
  beforeEach(async () => {
    testName = 'testhabit'
    habit = await Habit.create({
      name: testName,
      points: 10,
      multiplier: 2,
      description: 'Test habit for testing purposes'
    })
  })

  afterEach(async () => {
    await Habit.deleteMany({})
  })

  describe('GET /habits', () => {
    it('should return all habits', async () => {
      const response = await request(server).get('/habits')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        {
          __v: expect.anything(),
          _id: expect.any(String),
          name: testName,
          points: 10,
          multiplier: 2,
          description: 'Test habit for testing purposes'
        }
      ])
    })
  })

  describe('POST /habits', () => {
    it('should create a new habit', async () => {
      const response = await request(server).post('/habits').send({
        name: 'newhabit',
        points: 15,
        multiplier: 3,
        description: 'New habit for testing purposes'
      })

      expect(response.status).toBe(201)
      expect(response.body).toEqual({ message: 'New habit newhabit' })
    })

    it('should return error if habit already exists', async () => {
      const response = await request(server).post('/habits').send({
        name: testName,
        points: 10,
        multiplier: 2,
        description: 'Test habit for testing purposes'
      })

      expect(response.status).toBe(409)
      expect(response.body).toEqual({ message: 'Duplicate habit' })
    })
  })
})
