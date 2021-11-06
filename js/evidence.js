let evidences = [
    "EMF Level 5",
    "Fingerprints",
    "Ghost Writing",
    "Freezing Temperatures",
    "D.O.T.S Projector",
    "Ghost Orb",
    "Spirit Box"
]
let selectedEvidences = []
let eliminatedEvidences = []
let ghostPrediction = ''

// Set evidence at specified index as selected
function selectEvidence(index) {
    // Max of three evidences can be selected
    if (selectedEvidences.length > 2) return

    let evidence = evidences[index]
    selectedEvidences.push(evidence)
    document.getElementById(evidence).classList.add('selected')
}

// Set evidence at specified index as eliminated
function eliminateEvidence(index) {
    let evidence = evidences[index]
    selectedEvidences = selectedEvidences.filter(value => value != evidence) // remove evidence from selected array
    eliminatedEvidences.push(evidence)
    document.getElementById(evidence).classList.remove('selected')
    document.getElementById(evidence).classList.add('eliminated')
}

// Reset evidence to original state
function deselectEvidence(index) {
    let evidence = evidences[index]
    eliminatedEvidences = eliminatedEvidences.filter(value => value != evidence) // remove evidence from eliminated array
    document.getElementById(evidence).classList.remove('eliminated')
}

// Cycle evidence state between selected, eliminated, and deselected
function cycleEvidence(index) {
    if (selectedEvidences.includes(evidences[index]))
        eliminateEvidence(index)
    else if (eliminatedEvidences.includes(evidences[index]))
        deselectEvidence(index)
    else
        selectEvidence(index)
    checkEvidence()
}

// Filter ghost possibilities based on selected evidence
function checkEvidence() {
    fetch('api/ghosts.json')
    .then(response => response.json())
    .then(data => {
        for (let g = 0; g < Object.keys(ghosts).length; g++) {
            let ghost = data.ghosts[g]
            let ghostEvidence = ghost.evidence
            let ghostElement = document.getElementById(ghost.type)

            // Reset element if needed
            if (ghostElement.classList.contains('disabled'))
                ghostElement.classList.remove('disabled')

            // Disable element if any selected evidence DOES NOT match one of the ghost's evidences
            for(let se = 0; se < selectedEvidences.length; se++)
                if (!ghostEvidence.includes(selectedEvidences[se])) {
                    ghostElement.classList.add('disabled')
                    break
                }

            // Disable element if any eliminated evidence DOES match one of the ghost's evidences
            for(let ee = 0; ee < eliminatedEvidences.length; ee++)
                if (ghostEvidence.includes(eliminatedEvidences[ee])) {
                    ghostElement.classList.add('disabled')
                    break
                }
        }
    })
}

// Set ghost prediction to specified ghost (string)
function setGhostPrediction(ghost) {
    if (document.getElementById(ghost).classList.contains('disabled')) return

    ghostPrediction = ghost
    document.getElementById('ghost-prediction').innerHTML = ghost
}