import express from 'express'
import cors from 'cors'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
app.use(cors())
app.use(express.json())


const prisma = new PrismaClient({
    log: ['error', 'info', 'query', 'warn']
})


function createToken(id: number) {
    const token = jwt.sign({ id: id }, 'shhhh', { expiresIn: '3day' })
    return token
}

async function getUserFromToken(token: string) {
    const data = jwt.verify(token, 'shhhh')
    //@ts-ignore
    const user = await prisma.user.findUnique({ where: { id: data.id }, include: { orders: { include: { item: true } } } })
    return user
}

app.post('/sign-up', async (req, res) => {
    const { email, password, name } = req.body
    try {
        const hash = bcrypt.hashSync(password)
        const user = await prisma.user.create({ data: { email, password: hash, name }, include: { orders: { include: { item: true } } } })
        res.send({ user, token: createToken(user.id) })
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }
})

app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body
    try {
        //@ts-ignore
        const user = await prisma.user.findUnique({ where: { email: email }, include: { orders: { include: { item: true } } } })
        //@ts-ignore
        const passwordMatches = bcrypt.compareSync(password, user.password)
        if (user && passwordMatches) {
            res.send({ user, token: createToken(user.id) })
        } else {
            throw Error('Boom')
        }
    } catch (err) {
        res.status(400).send({ error: 'Email/password invalid.' })
    }

})


app.get('/validate', async (req, res) => {
    const token = req.headers.authorization || ''
    try {
        const user = await getUserFromToken(token)
        res.send(user)
    } catch (err) {
        //@ts-ignore
        res.status(400).send({ error: err.message })
    }

})

app.listen(4000, () => {
    console.log(`Server up: http://localhost:4000`)
})
