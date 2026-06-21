import fs from 'fs'
import { utilService } from "./util.service.js";

const bugs = utilService.readJsonFile('data/bug.json')
const PAGE_SIZE = 3


export const bugService = {
    query,
    getById,
    remove,
    save
}

function query(filterBy = {}) {
    console.log(bugs)
    let bugsToDisplay = bugs
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels.length) {
        bugsToDisplay = bugsToDisplay.filter(bug =>
            bug.labels.some(label => filterBy.labels.includes(label))
        )
    }

    if (filterBy.sortBy) {
        const sortDir = filterBy.sortDir || 1

        bugsToDisplay.sort((a, b) => {
            const valA = a[filterBy.sortBy]
            const valB = b[filterBy.sortBy]

            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * sortDir
            }

            return (valA - valB) * sortDir
        })
    }

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE // 0,3,6,9
        bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }
    console.log(filterBy)
    console.log(bugsToDisplay)

    return Promise.resolve(bugsToDisplay)
}

function getById(bugId) {
    const bug = bugs.find(curBug => curBug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot remove bug - ' + bugId)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}