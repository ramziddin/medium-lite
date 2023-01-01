import { Router } from "express"

export const apiRouter = Router()

// Authentication

apiRouter.post("/auth/login", async (req, res) => {})

apiRouter.post("/auth/signup", async (req, res) => {})

apiRouter.get("/auth/logout", async (req, res) => {})

// Users

apiRouter.get("/users", async (req, res) => {})

apiRouter.post("/users", async (req, res) => {})

apiRouter.get("/users/:id", async (req, res) => {})

apiRouter.put("/users/:id", async (req, res) => {})

apiRouter.delete("/users/:id", async (req, res) => {})

// Posts

apiRouter.get("/posts", async (req, res) => {})

apiRouter.post("/posts", async (req, res) => {})

apiRouter.get("/posts/:id", async (req, res) => {})

apiRouter.put("/posts/:id", async (req, res) => {})

apiRouter.delete("/posts/:id", async (req, res) => {})
