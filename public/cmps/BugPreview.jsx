export function BugPreview({bug}) {

    function getSeverityClass(severity) {
        if (severity >= 4) return 'high'
        if (severity >= 3) return 'medium'
        return 'low'
    }

    return <article className="bug-preview">
        <p className="title">{bug.title}</p>
        <p>Severity: <span className={`severity ${getSeverityClass(bug.severity)}`}>{bug.severity}</span></p>
        {bug.labels && <div className="labels">
            {bug.labels.map(label => <span className="label" key={label}>{label}</span>)}
        </div>}
    </article>
}
