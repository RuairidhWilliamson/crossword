import changelog from './changelog';

const changelogContainer = document.querySelector(".changelog");

changelog.reverse().forEach(entry => {
    const divEntry = document.createElement("div");
    changelogContainer.append(divEntry);


    const container = document.createElement("div");
    container.classList.add("changelog-title");

    const version = document.createElement("h2");
    version.textContent = entry.version;

    const date = document.createElement("h5");
    date.textContent = entry.date;

    container.append(version);
    container.append(date);

    const changesContainer = document.createElement("div");
    entry.changes.forEach(change => {
        const elem = document.createElement("ul");
        elem.textContent = change;
        changesContainer.append(elem);
    });

    divEntry.append(container);
    divEntry.append(changesContainer);
});