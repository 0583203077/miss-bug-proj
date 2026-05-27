import { bugService } from './services/bug.service.js'

import express from 'express'


const app = express()
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

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId).then(bug => res.send(bug))
        .catch(err =>
            res.status(400).send('Cannot send bug'))
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
    .then(() => res.send(`Bug removed - ${bugId}`))
        .catch(err => {
            res.status(400).send('Cannot remove bug')
        })
}) 

app.listen(3031, () => console.log('Server ready at port 3031'))