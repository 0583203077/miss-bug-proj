const { useState, useEffect } = React

import { bugService } from '../services/bug.service.js'
import { userService } from "../services/user.service.js"

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugSort } from '../cmps/BugSort.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'


export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
    const [totalPageSize, setTotalPageSize] = useState(null)
    const [sortBy, setSortBy] = useState(bugService.getDefaultSortBy())

    useEffect(loadBugs, [filterBy, sortBy])

    function loadBugs() {
        bugService.query(filterBy, sortBy)
            .then(({ bugs, totalPageSize }) => {
                setTotalPageSize(totalPageSize)
                setBugs(bugs)
            })
            .catch(err => showErrorMsg(`Couldn't load bugs - ${err}`))
    }

    function onRemoveBug(bugId) {
        bugService.remove(bugId)
            .then(() => {
                const bugsToUpdate = bugs.filter(bug => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => showErrorMsg(`Cannot remove bug`, err))
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?', 'Bug ' + Date.now()),
            severity: +prompt('Bug severity?', 3),
            description: prompt('description?'),
            createdAt: Date.now(),
            owner:userService.getLoggedinUser()._id
        }

        bugService.save(bug)
            .then(savedBug => {
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => showErrorMsg(`Cannot add bug`, err))
    }

    function onDownloadPdf() {
        console.log('downloadPdf')
        bugService.downloadPdf()
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?', bug.severity)
        const bugToSave = { ...bug, severity }

        bugService.save(bugToSave)
            .then(savedBug => {
                const bugsToUpdate = bugs.map(currBug =>
                    currBug._id === savedBug._id ? savedBug : currBug)

                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch(err => showErrorMsg('Cannot update bug', err))
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function onSetSort(sortBy) {
        setSortBy(prevSort => ({ ...prevSort, ...sortBy }))
    }

    function onChangePageIdx(diff) {
        setFilterBy(prevFilter => ({
            ...prevFilter,
            pageIdx: prevFilter.pageIdx + diff,
        }))
    }

    return <section className="bug-index main-content">

        <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
                <BugSort onSetSort={onSetSort} sortBy={sortBy} />

        <div className="paging flex">
            <button
                disabled={filterBy.pageIdx === 0} className="btn"
                onClick={() => {
                    onChangePageIdx(-1)
                }}
            >
                Previous
            </button>
            <span>{filterBy.pageIdx + 1}</span>
            <button
                disabled={filterBy.pageIdx === totalPageSize - 1}
                className="btn"
                onClick={() => {
                    onChangePageIdx(1)
                }}
            >
                Next
            </button>
        </div>
        <header>
            <h3>Bug List</h3>
            <button onClick={onAddBug}>Add Bug</button>
            <button onClick={onDownloadPdf}>Download Pdf</button>
        </header>

        <BugList
            bugs={bugs}
            onRemoveBug={onRemoveBug}
            onEditBug={onEditBug} />
    </section>
}
