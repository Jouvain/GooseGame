
const board = [
    ["x","x","x","x","R","G","x","x","x","B"],
    [" "," "," "," "," "," "," "," "," ","x"],
    ["B","x","x","x","R","G","x","B"," ","x"],
    ["x"," "," "," "," "," "," ","x"," ","x"],
    ["x"," ","B","x","x","x"," ","x"," ","x"],
    ["x"," ","x"," "," "," "," ","x"," ","x"],
    ["x"," ","B","x","x","x","x","B"," ","x"],
    ["x"," "," "," "," "," "," "," "," ","x"],
    ["B","x","x","x","R","G","x","x","x","B"],
]
// const container = document.getElementById("container");
// const cell = document.createElement("div");
// cell.dataRow = 1;
// cell.dataCol = 2;
// cell.classList.add("boardBox");
// container.appendChild(cell);


const rouge = $("#rouge img");
let rougeAdvance = 0;
const vert = $("#vert img");
let vertAdvance = 0;

const butStart = document.getElementById("butStart");
butStart.addEventListener("click", (Event) => {
    start();
    giveTurn();
});
const butRouge = document.getElementById("butRouge");
butRouge.addEventListener("click", (Event) => {
    var nbr = drawDice();
    butRouge.disabled = true;
    butVert.disabled = false;
    movePawn(nbr, rouge,  rougeAdvance);
});
const butVert = document.getElementById("butVert");
butVert.addEventListener("click", (Event) => {
    var nbr = drawDice();
    butRouge.disabled = false;
    butVert.disabled = true;
    movePawn(nbr, vert,  vertAdvance);
});


/** FONCTIONS */

function rollDice(min, max) {
    /** obtention d'un nombre alea 1-6 et affichage du dé correspondant */
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

// !!!!! TODO display none pour tous les autres dés
function drawDice() {
    var dieRolled = rollDice(1,6)
    var diceId = dieRolled.toString();
    const die = document.getElementById(`d${diceId}`);
    $(die).siblings().hide();
    $(die).show();
    return dieRolled;
}

function movePawn(nbrMoves, pawn) {
    /** déplacement du pion P sur N cases  */
    if(pawn === rouge) {
        rougeAdvance = rougeAdvance + nbrMoves;
        const destination = document.getElementById(rougeAdvance);
        $(pawn).appendTo(destination);
        console.log(`rouge = ${rougeAdvance}`)
    } else {
        vertAdvance = vertAdvance + nbrMoves;
        const destination = document.getElementById(vertAdvance);
        $(pawn).appendTo(destination);
        console.log(`vert =${vertAdvance}`)
    }
    
    
}

function resetPawn() {
    /** retour du pion à la case départ */
}

function hasWon() {
    /** indique la victoire et fin de partie */
}

function start() {
    /** débloque les boutons d'action et affiche le plateau de jeu */
    drawBoard(board);
    placeBoard(board);
}

function giveTurn() {
    /** détermine à qui est-ce de jouer */
    var alea = rollDice(1,2);
    if (alea === 1) {
        butRouge.disabled = false;
        butVert.disabled = true;
    } else {
        butRouge.disabled = true;
        butVert.disabled = false;
    }

}



function drawBoard(board) {
    /** création des cases du plateau de jeu */
    var caseId = 1;
    // const container = document.getElementById("container");
    board.forEach((line)=> {
        line.forEach((cell) => {
            const caseTest = document.createElement("div");
            caseTest.classList.add("boardBox");
            container.appendChild(caseTest);
            switch(cell) {
                case " ":
                    caseTest.classList.add("boardBox--empty");
                    break;
                case "B":
                    caseTest.classList.add("boardBox--black");
                    caseTest.id = `${caseId}`;
                    caseId += 1;
                    break;
                case "R":
                    caseTest.classList.add("boardBox--red");
                    caseTest.id = `${caseId}`;
                    caseId += 1;
                    break;
                case "G":
                    caseTest.classList.add("boardBox--green");
                    caseTest.id = `${caseId}`;
                    caseId += 1;
                    break;
                default:
                    caseTest.id = `${caseId}`;
                    caseId += 1;
                    break;
            }
        })
    })
}



function placeBoard(board) {
    /** création des cases du plateau de jeu */
    const container = document.getElementById("container");
    var line = 0;
    var col = 1;
    var modificator = 0;
    var targetId = 1 
    placeCases(line, col, targetId, modificator, board);
}

function placeCases(line, col, targetId, modificator, board) {
    if(targetId < 54) {
        while(col <= board[line].length- modificator) {
            const placedCase = document.getElementById(targetId);
            placedCase.style.gridRow = line+1;
            placedCase.style.gridColumn = col+1;
            targetId +=1;
            col +=1;
        }
        line += 1;
    }
    if(targetId < 54) {
        while(line < board.length - modificator) {
            const placedCase = document.getElementById(targetId);
            placedCase.style.gridRow = line +1;
            placedCase.style.gridColumn = col;
            targetId += 1;
            line += 1;
        }
        col -= 1;
    }
    if(targetId < 54) {
        while(col > 1 + modificator) {
            const placedCase = document.getElementById(targetId);
            placedCase.style.gridRow = line;
            placedCase.style.gridColumn = col;
            targetId += 1;
            col -= 1;
       }
       col +=1;
       line -= 1;
       modificator += 1;
    }
    if(targetId < 54) {
        while(line > 1 + modificator) {
            const placedCase = document.getElementById(targetId);
            placedCase.style.gridRow = line;
            placedCase.style.gridColumn = col;
            targetId += 1;
            line -= 1;
       }
       modificator +=1;
       placeCases(line, col, targetId, modificator, board)
    }

 
}


