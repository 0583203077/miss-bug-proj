import fs from 'fs'
import PDFDocument from 'pdfkit-table'
import { utilService } from "./util.service.js";


// init document 
let doc = new PDFDocument({ margin: 30, size: 'A4' })

// connect to a write stream 
doc.pipe(fs.createWriteStream('./bugs.pdf'))

createPdf(doc)
    .then(() => doc.end())      // close document 

function createPdf() {
    const bugs = utilService.readJsonFile('data/bug.json')
    const bugsArr = bugs.map(bug => {
        return [
            bug.title,
            bug.description,
            bug.severity,
            bug.createdAt
        ]
    }).sort((a, b) =>
        a[0].localeCompare(b[0])
    )
    const table = {
        title: 'Bugs',
        headers: ['Title', 'Description', 'Severity','Created at'],
        rows: bugsArr,
    }
    return doc.table(table, { columnsSize: [200, 200, 100,100] })
}

