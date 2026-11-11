export function Home() {
    return <section className="home-page">
        <div className="hero">
            <div className="hero-txt">
                <h2>Welcome to Miss Bug</h2>
                <p>A friendly little place to report, track and squash your bugs.</p>
            </div>
            <img src="assets/img/miss-bug.png" alt="Miss Bug the ladybug" />
        </div>

        <ul className="features">
            <li>
                <span className="icon">🐞</span>
                <h3>Report</h3>
                <p>Add a bug with a title, a description and a severity.</p>
            </li>
            <li>
                <span className="icon">🔍</span>
                <h3>Find</h3>
                <p>Filter by text, severity and labels, and sort the list.</p>
            </li>
            <li>
                <span className="icon">👤</span>
                <h3>Manage</h3>
                <p>Log in to edit and remove the bugs you reported.</p>
            </li>
        </ul>
    </section>
}
