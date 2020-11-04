// GLOBAL CONST AND VARIABLES

const boxWrapper = document.getElementById('box-wrapper');

let InitialCounterIsRuning,
    challengeTimeIsRuning,
    challengeIndex;

let outlineCountStage = document.getElementById('outline-count-stage'),
    paintedCountStage = document.getElementById('painted-count-stage'),
    invisibleCountStage = document.getElementById('invisibles-count-stage'),
    stageIndicator = document.getElementById('stage-indicator');

let outlineCountSelected = document.getElementById('outline-count-selected'),
    paintedCountSelected = document.getElementById('painted-count-selected'),
    invisibleCountSelected = document.getElementById('invisibles-count-selected');

const minutesIndicator = document.getElementById('time-minutes'),
    secondsIndicator = document.getElementById('time-seconds');

const mainModalContainer = document.getElementById('mainModalContainer');
const modalContainer = document.getElementById('modalContainer');

// WORKING WITH THE CHALLENGE PROPIETIES
stage = [
    {
        "outline": 6,
        "painted": 6,
        "ghost": 0,
        "time": 59
    },
    {
        "outline": 11,
        "painted": 1,
        "ghost": 0,
        "time": 59
    },
    {
        "outline": 5,
        "painted": 5,
        "ghost": 2,
        "time": 59
    }
];

// ---- UI MANIPULATION ---- //
// CLASS FOR SHOW AND MODIFY UI ELEMENTS
class UI { 
    addBox(box, boxContainer){
        boxContainer.appendChild(box);
    }
    
    //FUNCTION FOR COUNT THE NUMBER OF BOXES DEPENDING HIS CLASS
    stats(){
        paintedCountSelected.textContent = boxWrapper.querySelectorAll('.painted').length;
        let paintedCount = paintedCountSelected.textContent = boxWrapper.querySelectorAll('.painted').length;
        
        invisibleCountSelected.textContent = boxWrapper.querySelectorAll('.ghost').length;
        let invisiblesCount = boxWrapper.querySelectorAll('.ghost').length;
        
        if (boxWrapper.querySelectorAll(".ghost-painted").length >= 1) {
            outlineCountSelected.textContent = ((boxWrapper.querySelectorAll('.box').length - paintedCount) - invisiblesCount) + 1;
        } else {
            outlineCountSelected.textContent = (boxWrapper.querySelectorAll('.box').length - paintedCount) - invisiblesCount;
        }
    }

    statsStage(outline, painted, invisibles, stage) {
        outlineCountStage.textContent = outline;
        paintedCountStage.textContent = painted;
        invisibleCountStage.textContent = invisibles;
        stageIndicator.textContent = stage;
    }

    resetStats() {
        outlineCountSelected.textContent = "0";
        paintedCountSelected.textContent = "0";
        invisibleCountSelected.textContent = "0";

        outlineCountStage.textContent = "0";
        paintedCountStage.textContent = "0";
        invisibleCountStage.textContent = "0";
        stageIndicator.textContent = "00"

        secondsIndicator.textContent = "00";

        document.querySelector('.start-sing').style.display = "none";

        const clearBoxes = () => {
            let element = boxWrapper.querySelectorAll(".box");

            for (let i = 0; i < element.length; i++) {
                element[i].remove();
            }
        }

        clearBoxes();
    }

    // MODALS ===================================================================
    
    /* Estructura basica de un modal
    
    mainModalContainer.innerHTML = `
        <div class="modal" id="** ESPESIFICAR ID **">
            <div class="modal-component" id="** ESPESIFICAR ID **">
                // ** CONTENIDO DEL MODAL **
            </div>
        </div>
    `;

    Animaciones: 
    .hide // Aplicar solo al mainModalContainer
    .fadein 
    .fadeout
        
    */

    // Ventana modal que aparece con un contador de 5 segundos antes de iniciar un nuevo partido
    modalInitialTime() {
        const initialTimeModalStructure = `
            <div class="modal" id="modalContainer">
                <div class="modal-component hide" id="initialTime">
                    <h3>SECONDS REMAINING</h3>
                    <span class="initial-time-indicador">00</span>
                </div>
            </div>
        `;

        mainModalContainer.innerHTML = `${initialTimeModalStructure}`;
        
        const initialTimeModal = document.getElementById('initialTime');

        mainModalContainer.classList.remove('hide');
        initialTimeModal.classList.remove('hide');
        initialTimeModal.classList.add('fadein');

        setTimeout(() => {
            initialTimeModal.classList.add('fadeout');
        }, 5500);
    }

    // Ventana modal que aparece cuando has ganado el juego
    modalWinChallenge() {
        // alert("HAS GANADO EL DESAFIO");

        mainModalContainer.innerHTML = `
            <div class="modal" id="modal_container">
                <div class="modal-component hide" id="winChallengeModal">
                    <h3>YOU WIN THE CHALLENGE!!</h3>
                    <button class="btn" id="try-again-btn-win">NEXT STAGE</button>
                    <button class="btn" id="finish-game-btn-win">FINISH GAME</button>
                </div>
            </div>
        `;

        const winChallengeModal = document.getElementById('winChallengeModal');
        
        mainModalContainer.classList.remove('hide');
        winChallengeModal.classList.remove('hide');
        winChallengeModal.classList.add('fadein');

        // Listeners de los botones del modal

        // Evento que activa la opcion de CONTINUAR
        document.querySelector('#try-again-btn-win').addEventListener('click', () => {
            winChallengeModal.classList.remove('fadein');
            winChallengeModal.classList.add('fadeout');
            
            setTimeout(() => {
                winChallengeModal.classList.add('hide');
            
                principalBtnAction();
            
            }, 500)
        });

        // Evento que activa la opcion de abandonar la partida
        document.querySelector('#finish-game-btn-win').addEventListener('click', () => {
            winChallengeModal.classList.remove('fadein');
            winChallengeModal.classList.add('fadeout');
            
            setTimeout(() => {
                winChallengeModal.classList.add('hide');
                mainModalContainer.classList.add('hide');
            }, 500)
        });
    }

    // Ventana modal que aparece cuando has perdido el juego
    modalLooseChallenge() {
        mainModalContainer.innerHTML = `
            <div class="modal" id="modal_container">
                <div class="modal-component hide" id="looseChallengeModal">
                    <h3>YOU LOOSE THE CHALLENGE</h3>
                    <button class="btn" id="try-again-btn">TRY AGAIN</button>
                    <button class="btn" id="finish-game-btn">FINISH GAME</button>
                </div>
            </div>
        `;

        const looseChallengeModal = document.getElementById('looseChallengeModal');
        
        mainModalContainer.classList.remove('hide');
        looseChallengeModal.classList.remove('hide');
        looseChallengeModal.classList.add('fadein');

        // Listeners de los botones del modal

        // Evento que activa la opcion de intentar nuevamente
        document.querySelector('#try-again-btn').addEventListener('click', () => {
            looseChallengeModal.classList.remove('fadein');
            looseChallengeModal.classList.add('fadeout');
            
            setTimeout(() => {
                looseChallengeModal.classList.add('hide');
            
                principalBtnAction();
            
            }, 500)
        });

        // Evento que activa la opcion de abandonar la partida
        document.querySelector('#finish-game-btn').addEventListener('click', () => {
            looseChallengeModal.classList.remove('fadein');
            looseChallengeModal.classList.add('fadeout');
            
            setTimeout(() => {
                looseChallengeModal.classList.add('hide');
                mainModalContainer.classList.add('hide');
            }, 500)
        });
    }
}

// ---- WORKING WITH THE TIME ----//
// F1- START TIME COUNTER
const timeCounter = (elementInterval) => {
    let startTime = 5;
    let initialCounterIndicator = document.querySelector('.initial-time-indicador');
    InitialCounterIsRuning = true; // Esta variable conprueba si el tiempo ya ha iniciado y la funcion se ha ejecutado

    stopInicialTime = () => {
        clearInterval(elementInterval);
        InitialCounterIsRuning = false;
        console.log("INICIAL TIME IS DEAD");
    }

    elementInterval = setInterval(() => {

        if (startTime <= 0) {
            
            clearInterval(elementInterval);
            InitialCounterIsRuning = false;
            
            // Muestra el modal que contiene el tiempo inicial
            const ui = new UI;
            ui.modalInitialTime();
            mainModalContainer.classList.add('hide');

            // FUNCION PARA PINTAR LOS ELEMENTOS EN PANTALLA
            principalElementsRender();
        }
        
        initialCounterIndicator.textContent = `${startTime--}`;
    }, 1000);
}

// F2- CHALLENGE TIME
const challengeTime = (elementInterval, time) => {
    const ui = new UI;
    
    let startTime = time;
    
    challengeTimeIsRuning = true; // Esta variable conpreuba si el tiempo del desafio ya ha iniciado

    stopChallengeTime = () => {
        clearInterval(elementInterval);
        challengeTimeIsRuning = false;
        ui.resetStats();
        console.log("EL USUARIO HA PARADO EL DESAFIO");
    }

    elementInterval = setInterval(() => {
        if (startTime <= 0) {
            clearInterval(elementInterval);
            
            challengeTimeIsRuning = false;
            
            ui.resetStats();
            ui.modalLooseChallenge();
        } else {
            secondsIndicator.textContent = `${startTime--}`;
        }

    }, 1000);
}

// THIS FUNCTION RENDER THE BOXES IN THE DOM WHEN THE CHALLENGE START 
const principalElementsRender = () => {
    const box = new Box;
    const ui = new UI;
                
    for (let i = 0; i < 12; i++) {
        ui.addBox(box.createBox(), boxWrapper);
    }

    challengeIndex = Math.floor(Math.random() * stage.length);
    
    ui.statsStage(
        stage[challengeIndex].outline,
        stage[challengeIndex].painted,
        stage[challengeIndex].ghost,
        challengeIndex + 1
    );

    document.querySelector('#outline-count-selected').textContent = boxWrapper.querySelectorAll('.box').length;
    
    challengeTime(null, stage[challengeIndex].time);
}

// WORKING WITH THE BOX ELEMENT //
// CLASS FOR CREATE THE BOX ELEMENT AND HIS FEATURES
class Box extends UI {
    createBox(){
        const box = document.createElement('div');
        const btn_color = document.createElement('i');
        const btn_ghost = document.createElement('i');

        btn_color.className = "box-btn fas fa-fill-drip";
        btn_ghost.className = "box-btn fas fa-eye-slash";    

        //EVENTS LISTENER FOR EACH BUTTON
        btn_color.addEventListener("click", () => {
            this.changeColor(box);
            
            this.ghostPaintedState(box);
            this.stats();
            matchChecker();
        });

        btn_ghost.addEventListener("click", () => {
            this.ghostSwitch(box);
            
            this.ghostPaintedState(box);
            this.stats();
            matchChecker();
        }); 

        //ADD BUTTONS TO THE BOX ELEMENT
        box.appendChild(btn_color);
        box.appendChild(btn_ghost);

        box.classList = "box";

        //RETURN THE BOX COMPONENT
        return box;
    }

    //TOGGLE THE BACKGROUND COLOR OF THE ELEMENT (CLASS .PAINTED)
    changeColor(element){
        element.classList.toggle("painted");
    }

    //TOGGLE THE .GHOST CLASS FOR THE ELEMENT
    ghostSwitch(element){
        element.classList.toggle("ghost");
    }

    //THIS FUNCTION CHECK IF THE ELEMENT HAVE THE CLASSES GHOST AND PAINTED, AND ADD THE CLASS GHOST-PAINTED
    ghostPaintedState(element){
        if (element.classList.contains("ghost") && element.classList.contains("painted")) {
            element.classList = "box ghost painted ghost-painted";
        } else {
            element.classList.remove("ghost-painted");
        }
    }
}

// FUNCTION FOR CHECK A MATCH
const matchChecker = () => {
    let outlineMatch, paintedMatch, invisiblesMatch;
    // Comprueba si la cantidad de cajas con el estilo de linea (outline) es igual a la cantidad del reto 
    if (outlineCountSelected.textContent === outlineCountStage.textContent) {
        outlineMatch = true;
    }

    // Comprueba si la cantidad de cajas con el estilo pintadas (painted) es igual a la cantidad del reto
    if (paintedCountSelected.textContent === paintedCountStage.textContent) {
        paintedMatch = true;
    }

    // Comprueba si la cantidad de cajas con el estilo invisible es igual a la cantidad del reto
    if (invisibleCountSelected.textContent === invisibleCountStage.textContent) {
        invisiblesMatch = true;
    }

    // Si las cantidades de las cajas son iguales (la condicion es verdadera) 
    if (outlineMatch && paintedMatch && invisiblesMatch) {
        const ui = new UI; // Se llama la clase UI para mostrar el puntaje y el mensaje de reto completado
        console.table("MATCH! YOU WIN BITCH", `STAGE: ${challengeIndex + 1}`, Math.abs(Number(secondsIndicator.innerText) - stage[challengeIndex].time), "SECONDS");
        stopChallengeTime();
        ui.modalWinChallenge();
    }
}

const principalBtnAction = () => {
    let ui = new UI;
    
    ui.resetStats();
    
    if (InitialCounterIsRuning || challengeTimeIsRuning) {
        if (InitialCounterIsRuning) {
            stopInicialTime();
        } else {
            stopChallengeTime();
        }
    } else {
        ui.modalInitialTime();
        timeCounter();
        console.log(InitialCounterIsRuning);
    }
}

// PRINCIPAL BUTTOM
document.getElementById('btn-principal').addEventListener('click', () => {
    principalBtnAction();
});