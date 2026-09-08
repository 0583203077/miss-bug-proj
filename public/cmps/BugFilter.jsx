
const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const labelsOptions = ['critical', 'need-CR', 'dev-branch', 'famous', 'high', 'popular']

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                // לבדוק האם ניתן לבחור יותר מאפשרות אחת ואם כן האם מסנן לפי הבחירה המרובה
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            [field]: value
        }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const {
        txt,
        minSeverity,
        labels,
        sortBy,
        sortDir,
        pageIdx
    } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter & Sort</h2>

            <form onSubmit={onSubmitFilter}>

                <div className="field">
                    <label htmlFor="txt">Text</label>
                    <input
                        id="txt"
                        name="txt"
                        value={txt}
                        onChange={handleChange}
                        placeholder="Search title"
                    />
                </div>

                <div className="field">
                    <label htmlFor="minSeverity">Min Severity</label>
                    <input
                        id="minSeverity"
                        name="minSeverity"
                        type="number"
                        value={minSeverity}
                        onChange={handleChange}
                    />
                </div>

                <div className="label-selector">
                    {labelsOptions.map(label => (
                        <div key={label}>
                            <input
                                type="checkbox"
                                value={label}
                                checked={selectedLabels.includes(label)}
                                onChange={handleLabelChange}
                                id={`checkbox-${label}`}
                            />
                            <label htmlFor={`checkbox-${label}`}>{label}</label>
                        </div>
                    ))}
                </div>

            </form>
        </section>
    )
}