
const board = [
    ["x","x","G","x","x","x","x","x","x","R"],
    [" "," "," "," "," "," "," "," "," ","x"],
    ["x","x","x","x","x","x","x","x"," ","x"],
    ["G"," "," "," "," "," "," ","B"," ","x"],
    ["x"," ","x","x","x","x"," ","x"," ","B"],
    ["x"," ","x"," "," "," "," ","x"," ","x"],
    ["x"," ","x","x","x","x","x","x"," ","x"],
    ["x"," "," "," "," "," "," "," "," ","x"],
    ["B","x","x","x","R","x","x","x","x","x"],
]



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
butRouge.disabled = true;
const butVert = document.getElementById("butVert");
butVert.addEventListener("click", (Event) => {
    var nbr = drawDice();
    butRouge.disabled = false;
    butVert.disabled = true;
    movePawn(nbr, vert,  vertAdvance);
});
butVert.disabled = true;


/**** FONCTIONS ****/

/** obtention d'un nombre alea 1-6 et affichage du dé correspondant */
function rollDice(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}


function drawDice() {
    var dieRolled = rollDice(1,6)
    var diceId = dieRolled.toString();
    const die = document.getElementById(`d${diceId}`);
    $(die).siblings().hide();
    $(die).show();
    return dieRolled;
}

function displacePawn(advance, pawn) {
    const currentPosition = $(pawn).position();
    const destination = document.getElementById(advance);
    const destinationRect = destination.getBoundingClientRect();
    console.log(destinationRect);
    const destinationX = destinationRect.left;
    const destinationY = destinationRect.top;
    $(pawn).css({
        left: destinationX + 30 + "px",
        top: destinationY + 5 + "px"
    });
    setTimeout(()=> {
        $(pawn).appendTo(destination);
    }, "800")
    checkIdem();
    return destination;
}

function checkIdem() {
    if(rougeAdvance === vertAdvance) {
        var injustice = rollDice(1,2);
        if (injustice === 1) {
            movePawn(1, rouge);
        } else {
            movePawn(1, vert);
        }
    }
}

/** selon case de destination, déclenchement éventuel d'un mouvement du pion */
function checkPosition(pawn, destination) {
    if (pawn === rouge) {
        if (destination.classList.contains("boardBox--black")) {
            rougeAdvance = 1;
            displacePawn(rougeAdvance, pawn);
            displayAnimatedModal("<h1>RETROCEDERE !</h1>")
        } else if (destination.classList.contains("boardBox--red")) {
            rougeAdvance += 2;
            displacePawn(rougeAdvance, pawn);
            displayAnimatedModal("<h1>Courage, vas-y !</h1>")
        } else if (destination.classList.contains("boardBox--green")) {
            rougeAdvance -= 2;
            displacePawn(rougeAdvance, pawn);
            displayAnimatedModal("<h1>Oh, non !</h1>")
        } else if (vertAdvance === rougeAdvance) {
            // rougeAdvance += 2;
            // displacePawn(rougeAdvance, pawn);
            alert("Joli, on double !");
        }
    } else {
        if (destination.classList.contains("boardBox--black")) {
            vertAdvance = 1;
            displacePawn(vertAdvance, pawn);
            displayAnimatedModal("<h1>RETROCEDERE !</h1>")
        } else if (destination.classList.contains("boardBox--red")) {
            vertAdvance -= 2;
            displacePawn(vertAdvance, pawn);
            displayAnimatedModal("<h1>Oh, non !</h1>")
        } else if (destination.classList.contains("boardBox--green")) {
            vertAdvance += 2;
            displacePawn(vertAdvance, pawn);
            displayAnimatedModal("<h1>Courage, vas-y !</h1>")
        } else if (vertAdvance === rougeAdvance) {
            // vertAdvance += 2;
            // displacePawn(vertAdvance, pawn);
            alert("Joli, on double !");
        }
    }
    
}

///// BUG, les cases ne s'enchaînent pas, un Noir après R/V ne déclenche rien !
/** déplacement du pion P sur N cases  */
function movePawn(nbrMoves, pawn) {
    if(pawn === rouge) {
        rougeAdvance = rougeAdvance + nbrMoves;
        if (rougeAdvance < 54) {
            const destination = displacePawn(rougeAdvance, rouge);
            setTimeout(()=> {
                checkPosition(rouge, destination)
            }, "500");  
        } else {
            const destination = document.getElementById(54);
            $(pawn).appendTo(destination);
            setTimeout(()=> {
                hasWon("red");
            }, "500");   
        }
    } else {
        vertAdvance = vertAdvance + nbrMoves;
        if (vertAdvance < 54) {
            const destination = displacePawn(vertAdvance, vert);
            setTimeout(()=> {
                checkPosition(vert, destination)
            }, "500");
        } else {
            const destination = document.getElementById(54);
            $(pawn).appendTo(destination);
            setTimeout(()=> {
                hasWon("vert");
            }, "500");  
        }
    } 
}

/** retour du pion à la case départ */
function resetPawn(pawn) {
    const destination = document.getElementById(1);
    $(pawn).appendTo(destination);
    alert("Oh, non ! Retour à la case départ !");
}

/** indique la victoire et fin de partie */
function hasWon(redOrGreenString) {
    if(redOrGreenString === "red") {
        displayAnimatedModal("<h1>Victoire de Jeanne !<h1>");
    } else {
        displayAnimatedModal("<h1>Oh... Arthur l'emporte cette fois...<h1>");
    }
    resetAll();
}

/** débloque les boutons d'action et affiche le plateau de jeu */
function start() {
    drawBoard(board);
    placeBoard(board);
    displayResetButton();
    console.log($("#modalAnimation"))
    displayAnimatedModal("<h1>Que Dame Fortune aime votre victoire !<h1>");
    $(rouge).addClass("pawn");
    $(vert).addClass("pawn");
    $(rouge).css({
        left: 0 + "px",
        top: 0 + "px"
    })
    $(vert).css({
        left: 0 + "px",
        top: 100 + "px"
    })
}

function displayAnimatedModal(message) {
    $("#modalAnimation").addClass("animateModal");
    $("#modalAnimation").append(message);
    setTimeout (()=> {
        $("#modalAnimation").removeClass("animateModal");
        $("#modalAnimation h1").remove();
    }, "3000");
}

/**création du bouton de reset à la place du starter */
function displayResetButton() {
    butStart.style.display = "none";
    const resetButton = document.createElement("button");
    resetButton.classList.add("btn");
    resetButton.classList.add("btn-primary");
    resetButton.value = "Recommencer";
    resetButton.innerText = "Recommencer";
    resetButton.id = "resetButton";
    const buttonContainer = document.getElementById("divButStart");
    buttonContainer.appendChild(resetButton);
    resetButton.addEventListener("click", ()=> {
        resetAll();
    })
}

/** détermine à qui est-ce de jouer */
function giveTurn() {
    var alea = rollDice(1,2);
    if (alea === 1) {
        butRouge.disabled = false;
        butVert.disabled = true;
    } else {
        butRouge.disabled = true;
        butVert.disabled = false;
    }
}


/** création des cases du plateau de jeu */
function drawBoard(board) {
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


/** création des cases du plateau de jeu */
function placeBoard(board) {
    const container = document.getElementById("container");
    var line = 0;
    var col = 1;
    var modificator = 0;
    var targetId = 1 
    placeCases(line, col, targetId, modificator, board);
}

/**déplace des cases sur une grille en partant de la première "line" et première "col" en parcourant la matrice  */
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

/** réinitialise le jeu (plateau, pions, boutons...) */
function resetAll() {
    var destination = document.getElementById("rouge");
    $(rouge).css({
        left: 0 + "px",
        top: 0 + "px"
    })
    $(rouge).removeClass("pawn");
    $(rouge).appendTo(destination);
    rougeAdvance = 0;
    destination = document.getElementById("vert");
    $(vert).css({
        left: 0 + "px",
        top: 100 + "px"
    })
    $(vert).removeClass("pawn");
    $(vert).appendTo(destination);
    vertAdvance = 0;
    $("#resetButton").remove();
    butStart.style.display = "flex";
    $("#number").children().hide();
    for (let i = 1 ; i<55 ; i++ ){
        $(`#${i}`).remove();
    }
    butRouge.disabled = true;
    butVert.disabled = true;
}


/*********** ANIMATIONS CODEPEN *******************/
let par = [];
let colors = ['#f25f5c', '#ffe066', '#247ba0', '#70c1b3'];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  blendMode(BLEND);
  background(30);
  blendMode(ADD);
  
  let p;
  if(mouseX === 0 && mouseY === 0){
    p = new Particle(width/2, height/2);
  } else {
    p = new Particle(mouseX, mouseY);
  }
  par.push(p);
  
  for(let i = par.length - 1;i> 0; i--){
    par[i].update();
    par[i].show();
    
    if(par[i].size < 1){
      par.splice(i,1);
    }
  }
}

class Particle {
  constructor(x,y){
    this.pos = createVector(x,y);
    this.vel = p5.Vector.random2D().setMag(0.1);
    this.acc = p5.Vector.random2D().setMag(0.3);
    
    this.size = 100;
    this.color = colors[Math.floor(random(colors.length))];
  }
  
  show(){
    noStroke();
    push();
    translate(this.pos.x, this.pos.y);
    fill(this.color);
    
	drawingContext.shadowColor = color(this.color);
	drawingContext.shadowBlur = 20;
    
    ellipse(0,0,this.size);
    pop();
  }
  
  update(){
    this.size = 0.98 * this.size;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(2);
  }
}

