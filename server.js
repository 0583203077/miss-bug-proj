import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'
import { authService } from './services/auth.service.js'

import cookieParser from 'cookie-parser'

import express from 'express'
import path from 'path'
import { utilService } from './services/util.service.js'
import PDFDocument from 'pdfkit-table'
import fs from 'fs'

const app = express()

//* Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')


app.get('/', (req, res) => res.send('Hello misheo'))


//* Read
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: req.query.pageIdx !== undefined ? +req.query.pageIdx : undefined,
        labels: req.query.labels ? req.query.labels : [],
        owner: req.query.owner || ''
    }
    const sortBy = {
        type: req.query.type || '',
        dir: +req.query.desc || 1
    }

    bugService.query(filterBy, sortBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            res.status(400).send('Cannot load bugs')
        })
})

//* Read by ID
app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params

    let visitedBugs = req.cookies.visitedBugs || []
    if (visitedBugs.length >= 3 && !visitedBugs.includes(bugId)) {
        return res.status(401).send('Wait for a bit')
    }
    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }

    res.cookie('visitedBugs', visitedBugs, { maxAge: 20 * 1000 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(400).send('Cannot send bug')
        })
})

//* Remove/Delete
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Cannot remove bug`)
    const { bugId } = req.params
    bugService.remove(bugId, loggedinUser)
        .then(() => res.send(`Bug removed - ${bugId}`))
        .catch(err => {
            res.status(400).send('Cannot remove bug')
            console.log(err)
        })
})

app.get('/api/bug/pdf', async (req, res) => {
    const doc = new PDFDocument({ margin: 30, size: 'A4' })
    doc.pipe(fs.createWriteStream('./bugs.pdf'))
    await utilService.createPdf(doc)
    doc.end()
    res.send('PDF created')
})

//* Create
app.post('/api/bug', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Can't add bug`)
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        createdAt: req.body.createdAt,
        labels: req.body.labels
    }
    bugService.save(bugToSave, loggedinUser).then(bug => res.send(bug))
        .catch(err =>
            res.status(400).send('Cannot save bug')
        )
})

//* Edit
app.put('/api/bug/:bugId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Can't update car`)
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
        createdAt: req.body.createdAt,
        labels: req.body.labels,
        owner: req.body.owner
    }
    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            res.status(400).send('Cannot save bug')
        })
})

//* Auth API
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body
    authService.checkLogin({ username, password })
        .then(user => {
            const loginToken = authService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(() => res.status(404).send('Invalid Credentials'))
})

app.post('/api/auth/signup', (req, res) => {
    console.log('BODY:', req.body)
    const { username, password, fullname } = req.body
    userService.add({ username, password, fullname })
        .then(user => {
            if (user) {
                const loginToken = authService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
        .catch(err => {
            console.log('err:', err)
            res.status(400).send('Username taken.')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

//* User API

app.get('/api/user', (req, res) => {

    userService.query()
        .then(user => res.send(user))
        .catch(err => {
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params

    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            res.status(400).send('Cannot load user')
        })
})

app.delete('/api/user/:userId', (req, res) => {
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send(`Cannot remove user`)
    const { userId } = req.params
    userService.remove(userId)
        .then(() => res.send(`Bug removed - ${userId}`))
        .catch(err => {
            res.status(400).send('Cannot remove user')
            console.log(err)
        })
})

app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

app.listen(3031, () => console.log('Server ready at port 3031'))