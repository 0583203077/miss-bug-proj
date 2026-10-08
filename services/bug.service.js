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

function query(
    filterBy = { txt: '', severity: 0, userId: '', labels: '' },
    sortBy = { type: '', dir: 1 }) {
    // console.log(bugs)
    let bugsToDisplay = bugs
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.owner) {
        bugsToDisplay = bugsToDisplay.filter(bug => bug.owner && bug.owner._id === filterBy.owner)
    }

    if (filterBy.labels && filterBy.labels.length) {
        bugsToDisplay = bugsToDisplay.filter(bug =>
            (bug.labels || []).some(label => filterBy.labels.includes(label))
        )
    }

    if (sortBy) {
console.log('sortBy:', sortBy.type)
console.log('sortDir:', sortBy.dir)
console.log('first bug:', bugsToDisplay[0])
        const sortDir = sortBy.dir || 1

        bugsToDisplay.sort((a, b) => {
            const valA = a[sortBy.type]
            const valB = b[sortBy.type]

            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * sortDir
            }

            return (valA - valB) * sortDir
        })
    }
    const totalPageSize = Math.ceil(bugsToDisplay.length / PAGE_SIZE)

    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE // 0,3,6,9
        bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }
    // console.log(filterBy)
    // console.log(bugsToDisplay)

    return Promise.resolve({ bugs: bugsToDisplay, totalPageSize })
}

function getById(bugId) {
    const bug = bugs.find(curBug => curBug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    if (!loggedinUser.isAdmin)
        console.log(loggedinUser)
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Cannot remove bug - ' + bugId)
    if (!loggedinUser.isAdmin && loggedinUser._id !== bugs[bugIdx].owner._id)
        return Promise.reject(`Not your bug`)
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        if (!loggedinUser.isAdmin && loggedinUser._id !== bugToSave.owner._id)

            return Promise.reject(`Not your bug`)
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.owner = loggedinUser
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