const request = require('supertest')
const Points = require('../models/Points')
const pointsRoutes = require('../routes/pointsRoutes')
const express = require('express')
const server = express()
const connectDB = require('../config/dbConn')
const User = require('../models/User')
const Habit = require('../models/Habit')

connectDB()
server.use(express.json())
server.use("/points", pointsRoutes)

describe('Points controller', () => {
  let user
  let habit
  let testPoints

  beforeEach(async () => {
    testPoints = 5
    user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword'
    })

    habit = await Habit.create({
      name: 'testhabit',
      points: 5,
      multiplier: 2,
      description: 'test habit'
    })
  })

  afterEach(async () => {
    await Points.deleteMany({})
    await User.deleteMany({})
    await Habit.deleteMany({})
  })

  describe('GET /points', () => {
    it('should return all points', async () => {
      const point = await Points.create({
        user: user,
        habit: habit,
        points: testPoints
      })

      const response = await request(server).get('/points')

      expect(response.status).toBe(200)
      expect(response.body).toEqual([
        {
            __v: expect.any(Number),
          _id: expect.any(String),
          user: {
            _id: expect.any(String),
            username: 'testuser',
          },
          habit: {
            _id: expect.any(String),
            name: 'testhabit',
          },
          points: testPoints,
          date: expect.any(String)
        }
      ])
    })
  })

    describe('POST /points', () => {
    it('should create a new points record', async () => {
        const user = await User.findOne({username: 'testuser'}).lean().exec()
        const habit = await Habit.findOne({name: 'testhabit'}).lean().exec()
        const userId = user._id.valueOf()
        const habitId = habit._id.valueOf()
        console.log(userId, habitId)

      const response = await request(server).post('/points').type('json').send({
        userId: userId,
        habitId: habitId,
        points: 5
      })

      expect(response.status).toBe(201)
      expect(response.body).toStrictEqual({message: 'New log created'})
    })

    it('should error when creating a new points record on the same day', async () => {
        const user = await User.findOne({username: 'testuser'}).lean().exec()
        const habit = await Habit.findOne({name: 'testhabit'}).lean().exec()
        const userId = user._id.valueOf()
        const habitId = habit._id.valueOf()
        await request(server).post('/points').type('json').send({
        userId: userId,
        habitId: habitId,
        points: 5
      })

      const response = await request(server).post('/points').type('json').send({
        userId: userId,
        habitId: habitId,
        points: 5
      })

      expect(response.status).toBe(409)
      expect(response.body).toStrictEqual({message: 'Duplicate record'})
    })
  })

})