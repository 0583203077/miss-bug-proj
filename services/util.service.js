import fs from 'fs'
import PDFDocument from 'pdfkit-table'
import https from 'https'


export const utilService = {
    readJsonFile,
    makeId,
    createPdf,
    download
}

function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

// init document 
// let doc = new PDFDocument({ margin: 30, size: 'A4' })

// // connect to a write stream 
// doc.pipe(fs.createWriteStream('./bugs.pdf'))

async function createPdf(doc) {
    const bugs = readJsonFile('data/bug.json')
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
        headers: ['Title', 'Description', 'Severity', 'Created at'],
        rows: bugsArr,
    }
    await doc.table(table, { columnsSize: [200, 200, 100, 100] })
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, content => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}