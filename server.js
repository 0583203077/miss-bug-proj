import { bugService } from './services/bug.service.js'
import cookieParser from 'cookie-parser'

import express from 'express'


const app = express()

app.use(cookieParser())

app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello misheo'))



app.get('/api/bug', (req, res) => {
    bugService.query().then(bugs => res.send(bugs))
        .catch(err =>
            res.status(400).send('Cannot load cars'))
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: req.query.severity,
        createdAt: req.query.createdAt
    }
    bugService.save(bugToSave).then(bug => res.send(bug))
        .catch(err =>
            res.status(400).send('Cannot save bug')
        )
})

// app.get('/api/bug/:bugId', (req, res) => {
//     const { bugId } = req.params
//     bugService.getById(bugId).then(bug => res.send(bug)

// )
//         .catch(err =>
//             res.status(400).send('Cannot send bug'))
// })

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
    .then(() => res.send(`Bug removed - ${bugId}`))
        .catch(err => {
            res.status(400).send('Cannot remove bug')
        })
}) 

// app.get('/cookies', (req, res) => {
//     let visitedCount = req.cookies.visitedCount || 0
//     visitedCount++
//     // console.log('visitedCount:', visitedCount)
//     res.cookie('visitedCount', visitedCount, { maxAge: 7 * 1000 })
//     console.log('visitedCount:', visitedCount)
//     res.send(`Hello Puki - ${visitedCount}`)
// })

app.get('/api/bug/:bugId', (req, res) => {

    const { bugId } = req.params

    let visitedBugs = req.cookies.visitedBugs || []

    // אם הבאג עדיין לא קיים ברשימה
    if (!visitedBugs.includes(bugId)) {
        visitedBugs.push(bugId)
    }

    console.log('User visited bugs:', visitedBugs)

    // אם עבר את המגבלה
    if (visitedBugs.length >= 3) {
        return res.status(401).send('Wait for a bit')
    }

    // שמירת cookie
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            res.status(400).send('Cannot send bug')
        })
})

app.listen(3031, () => console.log('Server ready at port 3031'))