import { getPresentUser, updateUser } from "./storage.js";

const user=getPresentUser("presentUser")[0]

const $username = document.getElementById("username")
const $email = document.getElementById("email")
const $profilForm = document.getElementById("profilForm")
const $puzzleSelect = document.getElementById("puzzle-select")
const $image = document.getElementById("puzzleImage")
const $sizeselect = document.getElementById("size-select")
const $saved = document.getElementById("saved")

const $12 = document.getElementById("12")
const $16 = document.getElementById("16")
const $20 = document.getElementById("20")
const $42 = document.getElementById("42")
const $48 = document.getElementById("48")
const $56 = document.getElementById("56")

let puzzle = user.puzzle
const $selection = document.getElementById(puzzle)

$image.src = `ressources/${puzzle}/memory_detail.png`
adjustSizes(puzzle)

$selection.selected = true
$username.textContent = user.name
$email.textContent = user.email

$puzzleSelect.addEventListener("input", function () {
    $image.src = `ressources/${this.value}/memory_detail.png`
    $12.selected = true
    adjustSizes(this.value)
})

$profilForm.addEventListener("submit", function (event) {
    event.preventDefault()
    user.puzzle = $puzzleSelect.value
    user.size = parseInt($sizeselect.value)
    updateUser(user)
    $saved.textContent = "Modifications enregistrées"
    setTimeout(() => {
        $saved.textContent=""
    }, 3000);
})

function adjustSizes(selectedPuzzle) {
        switch (selectedPuzzle) {
        case "memory\-legume":
            $16.disabled = true
            $20.disabled = true
            $42.disabled = true
            $48.disabled = true
            $56.disabled = true
            break;
        case "alphabet\-scrabble":
            $16.disabled = false
            $20.disabled = false
            $42.disabled = false
            $48.disabled = false
            $56.disabled = true
            break;
        case "animaux":
            $16.disabled = false
            $20.disabled = false
            $42.disabled = false
            $48.disabled = false
            $56.disabled = false
            break;
        case "animauxAnimes":
            $16.disabled = false
            $20.disabled = true
            $42.disabled = true
            $48.disabled = true
            $56.disabled = true
            break;
        case "animauxdomestiques":
            $16.disabled = false
            $20.disabled = false
            $42.disabled = true
            $48.disabled = true
            $56.disabled = true
            break;
        case "chiens":
            $16.disabled = false
            $20.disabled = false
            $42.disabled = false
            $48.disabled = true
            $56.disabled = true
            break;
        case "dinosaures":
            $16.disabled = false
            $20.disabled = false
            $42.disabled = true
            $48.disabled = true
            $56.disabled = true
            break;
        case "dinosauresAvecNom":
            $16.disabled = false
            $20.disabled = false
            $42.disabled = true
            $48.disabled = true
            $56.disabled = true
            break;   
        default:
            break;
    }
}