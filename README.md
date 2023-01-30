# Healthy Habit Tracker API

## Introduction

This API is created as the backend for a full stack web application for tracking healthy habits.

## Features

- CRUD operations for habits
- Restful API endpoints
- Cloud hosting

## Tech Stack

- MongoDB
- Express


## User Endpoints

| Endpoint | HTTP Method | Description |
| --- | --- | --- |
| /users | GET | Get all users |
| /users/:id | GET | Get a specific user by id |
| /users/:id/habits | GET | Get habits for a specific user |
| /users | POST | Create a new user |
| /users/:id | PATCH | Update a specific user by id |
| /users/:id | DELETE | Delete a specific user by id |

## Habit Endpoints

| Endpoint | HTTP Method | Description |
| --- | --- | --- |
| /habits | GET | Get all habits |
| /habits/:id | GET | Get a specific habit by id |
| /habits/:id/points | GET | Get points for a specific habit by id (a habit is unique for a user) |
| /habits | POST | Create a new habit |
| /habits/:id | PATCH | Update a specific habit by id |
| /habits/:id | DELETE | Delete a specific habit by id |

## Points Endpoints

| Endpoint | HTTP Method | Description |
| --- | --- | --- |
| /points | POST | Create a new point |
| /points/:habitId | DELETE | Delete a specific point for a habit (by sending the date in the request body) |

