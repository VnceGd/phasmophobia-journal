let ghosts = {
    SPIRIT: 'Spirit',
    WRAITH: 'Wraith',
    PHANTOM: 'Phantom',
    POLTERGEIST: 'Poltergeist',
    BANSHEE: 'Banshee',
    JINN: 'Jinn',
    MARE: 'Mare',
    REVENANT: 'Revenant',
    SHADE: 'Shade',
    DEMON: 'Demon',
    YUREI: 'Yurei',
    ONI: 'Oni',
    YOKAI: 'Yokai',
    HANTU: 'Hantu',
    GORYO: 'Goryo',
    MYLING: 'Myling',
    ONRYO: 'Onryo',
    THE_TWINS: 'The Twins',
    RAIJU: 'Raiju',
    OBAKE: 'Obake',
}
let ghostType = ghosts.SPIRIT
const ghostPageOffset = 3

let pageLeft = document.getElementById('page-left')
let pageRight = document.getElementById('page-right')
let currentPage = 0
const evidencePage = 2
const maxPage = 22

// Set page to the specified index
function setPage(index) {
    if (index == currentPage) return

    currentPage = index
    populatePage(currentPage)

    // Disable flip buttons when at the second or last page
    if (currentPage >= maxPage)
        document.getElementById('flip-right').classList.add('disabled')
    else
        document.getElementById('flip-right').classList.remove('disabled')

    if (currentPage <= evidencePage)
        document.getElementById('flip-left').classList.add('disabled')
    else
        document.getElementById('flip-left').classList.remove('disabled')
}

function prevPage() {
    setPage(currentPage - 1)
}

function nextPage() {
    setPage(currentPage + 1)
}

// Clear right page content only
// (Left page is always the Ghost Types page for now)
function clearPage() {
    document.getElementById('content-right').innerHTML = ''
}

// Display page for the specified index
function populatePage(index) {
    clearPage()

    if (index > evidencePage) {
        populateGhostData()
    }
    else if (index == evidencePage) {
        populateEvidence()
        checkEvidence()
    }

    // Add page number last
    let pPageNumRight = document.createElement('p')
    pPageNumRight.className = "pagenum"
    pPageNumRight.innerHTML = `${currentPage}`
    document.getElementById('content-right').appendChild(pPageNumRight)
}

// Create and append html elements for the Evidence page
function populateEvidence() {
    let h1 = document.createElement('h1')
    h1.innerHTML = 'Evidence'
    let divSubContent = document.createElement('div')
    divSubContent.className = "subcontent"

    // Evidence listing
    let divEvidenceList = document.createElement('div')
    divEvidenceList.className = "evidencelist"
    let ulEvidenceListLeft = document.createElement('ul')
    ulEvidenceListLeft.className = "checklist left"
    let ulEvidenceListRight = document.createElement('ul')
    ulEvidenceListRight.className = "checklist right"

    // Display selectable evidences as two columns (lists)
    for (let e = 0; e < evidences.length; e++) {
        let liEvidence = document.createElement('li')
        let elementEvidence = evidences[e]
        liEvidence.onclick = () => { cycleEvidence(e) }
        liEvidence.id = elementEvidence
        liEvidence.innerHTML = elementEvidence

        // If evidences were previously selected or eliminated, set their classes to match
        if (selectedEvidences.includes(evidences[e]))
            liEvidence.classList.add('selected')
        else if (eliminatedEvidences.includes(evidences[e]))
            liEvidence.classList.add('eliminated')
        
        // Limit left list to four items
        if (e < 4)
            ulEvidenceListLeft.appendChild(liEvidence)
        else
            ulEvidenceListRight.appendChild(liEvidence)
    }

    // Ghost listing
    let divGhostList = document.createElement('div')
    divGhostList.className = "ghostlist"
    let pGhostList = document.createElement('p')
    pGhostList.innerHTML = 'The ghost type could still be one of these:'
    let divGhostCol0 = document.createElement('ul')
    divGhostCol0.className = "col 0"
    let divGhostCol1 = document.createElement('ul')
    divGhostCol1.className = "col 1"
    let divGhostCol2 = document.createElement('ul')
    divGhostCol2.className = "col 2"

    // Display selectable ghosts as three columns (lists)
    for (let g = 0; g < Object.keys(ghosts).length; g++)
    {
        let liGhostType = document.createElement('li')
        let valueGhostType = Object.values(ghosts)[g]
        liGhostType.onclick = () => { setGhostPrediction(valueGhostType) }
        liGhostType.id = valueGhostType
        liGhostType.innerHTML = valueGhostType

        // Ghost indices will increase left to right, then top to bottom
        // Therefore, need modulus to append to the correct list
        if (g % 3 == 0)
            divGhostCol0.appendChild(liGhostType)
        else if (g % 3 == 1)
            divGhostCol1.appendChild(liGhostType)
        else
            divGhostCol2.appendChild(liGhostType)
    }

    // Prediction section
    let pGhostPrediction = document.createElement('p')
    pGhostPrediction.innerHTML = `Using the evidence we've found, we believe the ghost is a`
    let h2GhostPrediction = document.createElement('h2')
    h2GhostPrediction.id = "ghost-prediction"
    if (ghostPrediction != '')
        h2GhostPrediction.innerHTML = `${ghostPrediction}`
    else
        h2GhostPrediction.innerHTML = 'Not yet discovered'

    // Append all child elements to parent divs
    divEvidenceList.appendChild(ulEvidenceListLeft)
    divEvidenceList.appendChild(ulEvidenceListRight)

    divGhostList.appendChild(pGhostList)
    divGhostList.appendChild(divGhostCol0)
    divGhostList.appendChild(divGhostCol1)
    divGhostList.appendChild(divGhostCol2)
    divGhostList.appendChild(pGhostPrediction)
    divGhostList.appendChild(h2GhostPrediction)

    divSubContent.appendChild(divEvidenceList)
    divSubContent.appendChild(document.createElement('hr'))
    divSubContent.appendChild(divGhostList)

    // Append content to right page
    let contentRight = document.getElementById('content-right')
    contentRight.appendChild(h1)
    contentRight.appendChild(document.createElement('hr'))
    contentRight.appendChild(divSubContent)
}

// Create and append html elements for the Ghost Types page
// For now, this should only be called once on page load
function populateGhostTypes() {
    let h1 = document.createElement('h1')
    h1.innerHTML = 'Ghost Types'
    let divSubContent = document.createElement('div')
    divSubContent.className = "subcontent"
    let pSubContent = document.createElement('p')
    pSubContent.innerHTML = 'Select a ghost type below to view more information:'
    let olGhostListLeft = document.createElement('ol')
    olGhostListLeft.className = "list left"
    let olGhostListRight = document.createElement('ol')
    olGhostListRight.start = 13 // Start second list at 13 since first is limited to 12
    olGhostListRight.className = "list right"

    // Display ghost types as two numbered lists
    for (let g = 0; g < Object.keys(ghosts).length; g++)
    {
        let aGhost = document.createElement('a')
        aGhost.onclick = () => { setPage(g + ghostPageOffset) }
        aGhost.innerHTML = `<li>${Object.values(ghosts)[g]}</li>`

        // Limit first list to twelve items
        if (g < 12)
            olGhostListLeft.appendChild(aGhost)
        else
            olGhostListRight.appendChild(aGhost)
    }

    divSubContent.appendChild(pSubContent)
    divSubContent.appendChild(olGhostListLeft)
    divSubContent.appendChild(olGhostListRight)

    // For now, Ghost Types page is always page one
    let pPageNumLeft = document.createElement('p')
    pPageNumLeft.className = "pagenum"
    pPageNumLeft.innerHTML = '1'

    // Append content to left page
    let contentLeft = document.getElementById('content-left')
    contentLeft.appendChild(h1)
    contentLeft.appendChild(document.createElement('hr'))
    contentLeft.appendChild(divSubContent)
    contentLeft.appendChild(pPageNumLeft)
}

// Create and append html elements for a Ghost's page
function populateGhostData() {
    fetch('api/ghosts.json')
    .then(response => response.json())
    .then(data => {
        // Determine ghost type from page number
        let ghostId = currentPage - ghostPageOffset
        let ghostType = Object.values(ghosts)[ghostId]

        // Separate JSON data into individual variables
        let ghost = data.ghosts[ghostId]
        let ghostDescription = ghost.description
        let ghostStrength = ghost.strength
        let ghostWeakness = ghost.weakness
        let ghostEvidence = ghost.evidence

        // Create elements for each section of content
        let h1 = document.createElement('h1')
        h1.innerHTML = ghostType
        let divDesc = document.createElement('div')
        divDesc.className = "description"
        divDesc.innerHTML = `<p>${ghostDescription}</p><br><p>Strength: ${ghostStrength} </p><br> <p>Weakness: ${ghostWeakness}</p>`
        let divEvidence = document.createElement('div')
        divEvidence.className = "evidence"
        divEvidence.innerHTML = `<h3>Evidence</h3> ${ghostEvidence[0]} <br> ${ghostEvidence[1]} <br> ${ghostEvidence[2]}`

        // Append content to right page
        let contentRight = document.getElementById('content-right')
        contentRight.appendChild(h1)
        contentRight.appendChild(document.createElement('hr'))
        contentRight.appendChild(divDesc)
        contentRight.appendChild(divEvidence)
    })
}

// Set initial pages to Ghost Types (1) and Evidence (2)
function init() {
    populateGhostTypes()
    setPage(evidencePage)
}

document.body.onload = init()