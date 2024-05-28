let deactivate;
let deid;
let declass;
const stopage = [1, 9, 14, 22, 27, 35, 40, 48];
let audio = new Audio('audio/dice-142528.mp3');
let audioMove = new Audio('audio/projector-button-push-6258.mp3');

class Player {
    constructor(el, start, end, stripStart) {
        this.playerStatus = false;
        this.winnerid = new Array(4).fill(false);
        this.color = el;
        this.status = new Array(4).fill(false);
        this.id = new Array(4);
        this.start = start;
        this.stripStart = stripStart;
        this.end = end;
        let elements = document.getElementsByClassName(el);
        for (let i = 0; i < elements.length; i++) {
            this.id[i] = elements[i];
        }
        this.steps = new Array(4).fill(0);
    }

    setsubStatus(i) {
        this.status[i] = false;
    }

    setSteps(i) {
        this.steps[i] = 0;
    }

    checkStatus() {
        let flag = false;
        for (let i = 0; i < 4; i++) {
            if (this.status[i] == true) {
                flag = true;
            }
        }
        if (flag == false) {
            this.playerStatus = false;
        }
    }

    setStatus() {
        this.playerStatus = true;
    }

    getStatus() {
        return this.playerStatus;
    }

    getElementStatus(val) {
        return this.status[val];
    }

    activatePlayer() {
        for (let i = 0; i < 4; i++) {
            this.id[i].disabled = false;
            this.id[i].classList.add("btnzoom");
        }
        btn.disabled = false;
        return;
    }

    openMove(el) {
        for (let i = 0; i < 4; i++) {
            if (this.id[i].id == el) {
                this.status[i] = true;
                let ele = document.getElementById(this.start);
                ele.appendChild(this.id[i]);
            }
        }
        for (let i = 0; i < 4; i++) {
            this.id[i].disabled = true;
            this.id[i].classList.remove("btnzoom");
        }
    }

    enableBtn() {
        for (let i = 0; i < 4; i++) {
            if (this.status[i] == true) {
                this.id[i].disabled = false;
                this.id[i].classList.add("btnzoom");
            }
        }
    }
    getUnopenedPiece() {
        for (let i = 0; i < 4; i++) {
            if (!this.getElementStatus(i)) {
                return this.id[i];
            }
        }
        return null;
    }

    hasAnyMovablePiece() {
        for (let i = 0; i < 4; i++) {
            if (this.getElementStatus(i)) {
                return true;
            }
        }
        return false;
    }
    capturePiece(targetPiece) {
        let targetId = parseInt(targetPiece.id);
        let targetPlayer, targetPieceIndex;

        if (targetPiece.classList.contains('red')) {
            targetPlayer = red;
            targetPieceIndex = targetId - 101;
        } else if (targetPiece.classList.contains('blue')) {
            targetPlayer = ai;
            targetPieceIndex = targetId - 301;
        } // Add more conditions if there are more players

        if (targetPlayer && targetPlayer.getElementStatus(targetPieceIndex)) {
            let initialPlace = document.getElementById(targetPiece.className + targetPiece.id);
            initialPlace.appendChild(targetPiece);
            targetPlayer.setsubStatus(targetPieceIndex);
            targetPlayer.setSteps(targetPieceIndex);
            targetPlayer.checkStatus();
            deactivate = false;
            return true; // Indicates a capture was made
        }
        return false; // No capture made
    }

    movePlayer(el, val) {
        let dest = 0;
        let fl = false;
        for (let i = 0; i < 4; i++) {
            if (this.id[i].id == el) {
                this.status[i] = true;
                this.id[i].classList.remove("btnzoom");
                this.steps[i] += val;

                this.id[i].classList.remove("btnzoom");
                dest = this.start + this.steps[i];
                if (this.steps[i] > 50) {
                    if (this.steps[i] > 56) {
                        this.steps[i] -= val;
                        break;
                    } else if (this.steps[i] == 56) {
                        let winel = document.getElementById("win");
                        winel.appendChild(this.id[i]);
                        winel.lastElementChild.classList.add("red1");
                        this.winnerid[i] = true;

                        for (let i = 0; i < 4; i++) {
                            if (this.winnerid[i] == false) {
                                fl = true;
                            }
                        }
                        if (fl == false) {
                            alert(this.color + " Player Won !!! ...please refresh to start New Game");
                        }
                        break;
                    }
                    dest = (this.steps[i] - 50) + this.stripStart;
                } else if (dest > 52) {
                    dest = dest - 52;
                }

                let ele = document.getElementById(dest);
                let lastChild = ele.lastElementChild;

                if (lastChild == null || lastChild.className == this.color || stopage.includes(ele.id)) {
                    ele.appendChild(this.id[i]);
                } else {
                    let clname = lastChild.className;
                    clname = clname.toString();
                    clname = clname.slice(0, clname.indexOf(' '));
                    if (clname == "props") {
                        ele.appendChild(this.id[i]);
                    } else {
                        if (this.capturePiece(lastChild)) {
                            this.steps[i] -= val; // Réinitialiser les pas si une capture a eu lieu
                            return true; // Indique que le joueur obtient un autre tour
                        } else {
                            ele.appendChild(this.id[i]);
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            this.id[i].classList.remove("btnzoom");
            this.id[i].disabled = true;
        }
        return false; // Aucun tour supplémentaire
    }
}

class AIPlayer extends Player {
    constructor(el, start, end, stripStart) {
        super(el, start, end, stripStart);
    }

    async makeMove() {
        await this.rollDice();
        let movablePieces = this.getMovablePieces();
        if (movablePieces.length > 0) {
            let piece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
            if (this.movePlayer(piece.id, die)) {
                await this.makeMove(); // AI gets another turn if it captured a piece
            }
        }
        deactivateSubPlayer();
        active = "red"; // assuming the human player is always red
        message(active);
        audioMove.play();
        btn.disabled = false;
    }
    async makeMove() {
        await this.rollDice();
        if (die === 6 && !this.hasAnyMovablePiece()) {
            // Sortir un pion si tous les pions sont encore dans la maison
            let unopenedPiece = this.getUnopenedPiece();
            if (unopenedPiece) {
                this.openMove(unopenedPiece.id);
                await this.rollDice(); // Relance le dé après avoir sorti un pion
            }
        }

        // Déplacer un pion si des pions peuvent être déplacés
        let movablePieces = this.getMovablePieces();
        if (movablePieces.length > 0) {
            let piece = movablePieces[Math.floor(Math.random() * movablePieces.length)];
            if (this.movePlayer(piece.id, die)) {
                await this.makeMove(); // L'IA rejoue si elle capture un pion
            }
        }

        deactivateSubPlayer();
        active = "red"; // Supposant que le joueur humain est toujours rouge
        message(active);
        audioMove.play();
        btn.disabled = false;
    }

    getUnopenedPiece() {
        for (let i = 0; i < 4; i++) {
            if (!this.getElementStatus(i)) {
                return this.id[i];
            }
        }
        return null;
    }

    hasAnyMovablePiece() {
        for (let i = 0; i < 4; i++) {
            if (this.getElementStatus(i)) {
                return true;
            }
        }
        return false;
    }
    async rollDice() {
        message("blue");
        let dice = Math.floor(Math.random() * 6) + 1;
        let goti = document.getElementById("goti");
        goti.style.backgroundImage = 'url(' + image.get(7) + ')';
        goti.textContent = "";
        audio.play();
        await adddice(dice);
        await removezoom("blue");

        die = dice;
        console.log(die);
    }

    getMovablePieces() {
        let movablePieces = [];
        for (let i = 0; i < 4; i++) {
            if (this.status[i] == true || (this.steps[i] == 0 && die == 6)) {
                movablePieces.push(this.id[i]);
            }
        }
        return movablePieces;
    }
}

function deactivateSubPlayer() {
    if (deactivate == true) {
        if (declass == "red") {
            red.setsubStatus(parseInt(deid) - 101);
            red.setSteps(parseInt(deid) - 101);
            red.checkStatus();
            deactivate = false;
        } else if (declass == "yellow") {
            yellow.setsubStatus(parseInt(deid) - 201);
            yellow.setSteps(parseInt(deid) - 201);
            yellow.checkStatus();
            deactivate = false;
        } else if (declass == "blue") {
            blue.setsubStatus(parseInt(deid) - 301);
            blue.setSteps(parseInt(deid) - 301);
            blue.checkStatus();
            deactivate = false;
        } else if (declass == "green") {
            green.setsubStatus(parseInt(deid) - 401);
            green.setSteps(parseInt(deid) - 401);
            green.checkStatus();
            deactivate = false;
        }
    } else {
        return;
    }
}

let red = new Player("red", 1, 51, 109);
let ai = new AIPlayer("blue", 27, 25, 309); // AI player as blue
let image = new Map([
    [1, "https://i.postimg.cc/CM60tqym/1.jpg"],
    [2, "https://i.postimg.cc/JhKvkfMP/2.jpg"],
    [3, "https://i.postimg.cc/3NZnspN9/3.jpg"],
    [4, "https://i.postimg.cc/Px7tmpT3/4.jpg"],
    [5, "https://i.postimg.cc/pTCs7zpC/5.jpg"],
    [6, "https://i.postimg.cc/SKD8brfn/6.jpg"],
    [7, "https://i.postimg.cc/90qqTj59/dice.gif"]
]);

function adddice(dice) {
    return new Promise(resolve => {
        setTimeout(() => {
            let goti = document.getElementById("goti");
            goti.style.backgroundImage = 'url(' + image.get(dice) + ')';
            resolve("resolved");
        }, 2000);
    });
}

function removezoom(active) {
    return new Promise(resolve => {
        setTimeout(() => {
            let ani = document.getElementById(active);
            ani.classList.remove("zoom");
            resolve("resolved");
        }, 500);
    });
}

let die = 0;
let active = "red";
let btn = document.getElementById("roll");

async function generaterandom() {
    message(active);

    btn.disabled = true;
    console.log(active);
    let dice = Math.floor(Math.random() * 6) + 1;
    let goti = document.getElementById("goti");
    goti.style.backgroundImage = 'url(' + image.get(7) + ')';
    goti.textContent = "";
    audio.play();
    await adddice(dice);
    await removezoom(active);

    die = dice;
    console.log(die);
    activePlayer(die);

    if (dice === 6) {
        do {
            dice = Math.floor(Math.random() * 6) + 1;
            await adddice(dice);
            die += dice;
            console.log(die);
        } while (dice === 6);
    }
}

function message(msg) {
    let ani = document.getElementById(msg);
    console.log(ani);
    ani.classList.add("zoom");
    let goti = document.getElementById("goti");
    goti.style.backgroundImage = "";
    goti.textContent = "Roll Dice";
    let el = document.getElementById("roll");
    el.value = msg + "'s turn";
}

function activePlayer(dice) {
    if (active === "red") {
        if (dice === 6) {
            red.activatePlayer();
            red.setStatus();
        } else if (red.getStatus() === false) {
            active = "blue";
            message(active);
            setTimeout(() => ai.makeMove(), 1000); // L'IA joue après un délai
        } else {
            red.enableBtn();
        }
        console.log(active);
    } else if (active === "blue") {
        if (dice === 6) {
            ai.activatePlayer();
            ai.setStatus();
            setTimeout(() => ai.makeMove(), 1000); // L'IA joue après un délai
        } else if (ai.getStatus() === false) {
            active = "red";
            message(active);
            btn.disabled = false;
        } else {
            ai.enableBtn();
            setTimeout(() => ai.makeMove(), 1000); // L'IA joue après un délai
        }
        console.log(active);
    }
}


function move(id) {
    console.log("hi");

    switch (active) {
        case 'red':
            if (red.getElementStatus(id - 101) == false) {
                red.openMove(id);
                die = 0;
            } else {
                console.log("red");
                if (red.movePlayer(id, die)) {
                    message("red");
                    btn.disabled = false; // Red gets another turn
                } else {
                    deactivateSubPlayer();
                    active = "blue";
                    message(active);
                    audioMove.play();
                    setTimeout(() => ai.makeMove(), 1000); // AI makes move after a delay
                }
            }
            console.log(active);
            break;
        case 'blue':
            if (ai.getElementStatus(id - 301) == false) {
                ai.openMove(id);
                die = 0;
            } else {
                console.log("blu");
                if (ai.movePlayer(id, die)) {
                    message("blue");
                    setTimeout(() => ai.makeMove(), 1000); // AI gets another turn
                } else {
                    deactivateSubPlayer();
                    active = "red";
                    message(active);
                    audioMove.play();
                    btn.disabled = false;
                }
            }
            console.log(active);
            break;
    }
    btn.disabled = false;
}
