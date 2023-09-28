let objQuestions = null;
let correctAns = null;
let currentPlayer = null;
let currentScore = null;
let players = null;
function removeChilds() {
    const container = document.getElementById("content");
    while (container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
}

function getNextQuestion() {
    let nextPosition = 0;
    let next = document.getElementById("questionNumber");
    if (next !== null) {
        nextPosition = parseInt(next.innerHTML);
    }
    if (parseInt(nextPosition) < 2) {
        removeChilds();
        createQuestion(objQuestions[nextPosition], nextPosition);
    } else {
        msjCongrats();
    }
}

function msjCongrats() {
    removeChilds();
    const container = document.getElementById("content");
    const h1 = document.createElement("h1");
    h1.innerHTML = "Congratulation, you got 50 points";
    h1.classList.add("text-4xl");
    h1.classList.add("font-extrabold");
    h1.classList.add("text-orange-600");
    h1.id = "msjInitial";
    const button = document.createElement("button");
    button.classList.add("bg-blue-900");
    button.classList.add("px-5");
    button.classList.add("rounded-md");
    button.classList.add("text-white");
    button.innerHTML = "New Game";
    button.id = "buttonInitial";
    button.addEventListener("click", getQuestions);
    container.appendChild(h1);
    container.appendChild(button);
    currentScore += 50;
    document.getElementById("score").innerHTML = currentScore;
}

function msjYouLost() {
    removeChilds();
    const container = document.getElementById("content");
    const h1 = document.createElement("h1");
    h1.innerHTML = "Game Over, you lost";
    h1.classList.add("text-4xl");
    h1.classList.add("font-extrabold");
    h1.classList.add("text-orange-600");
    h1.id = "msjInitial";
    const button = document.createElement("button");
    button.classList.add("bg-blue-900");
    button.classList.add("px-5");
    button.classList.add("rounded-md");
    button.classList.add("text-white");
    button.innerHTML = "New Game";
    button.id = "buttonInitial";
    button.addEventListener("click", getQuestions);
    container.appendChild(h1);
    container.appendChild(button);
}

function compareAnswers(answ) {
    let button = document.getElementById("nextButton");
    if (answ == correctAns) {
        button.removeAttribute("disabled");
        button.style.opacity = 1;
    } else {
        msjYouLost();
    }
}

function createQuestion(arr, nextPosition) {
    correctAns = arr.correct_answer;
    console.log(arr);
    const container = document.getElementById("content");
    const question = document.createElement("div");
    question.classList.add("question");
    question.innerHTML =
        '<span id="questionNumber">' +
        (parseInt(nextPosition) + 1) +
        "</span> - " +
        arr.question;
    const answersContainer = document.createElement("div");
    answersContainer.classList.add("answerContainer");

    for (const key in arr.answers) {
        if (arr.answers[key] !== null) {
            let answer = document.createElement("button");
            answer.classList.add("question");
            answer.classList.add("answer");
            answer.addEventListener("click", () => {
                compareAnswers(key);
            });
            answer.id = key;
            if (arr.answers[key].includes("<")) {
                answer.innerHTML = arr.answers[key].replace(/</gi, "&lt;");
            } else {
                answer.innerHTML = arr.answers[key];
            }
            answersContainer.appendChild(answer);
        }
    }
    container.appendChild(question);
    container.appendChild(answersContainer);
    const button = document.createElement("button");
    button.classList.add("bg-blue-900");
    button.classList.add("px-5");
    button.classList.add("rounded-md");
    button.classList.add("text-white");
    button.classList.add("opacity-50");
    button.id = "nextButton";
    button.innerHTML = "Next";
    button.addEventListener("click", getNextQuestion);
    button.setAttribute("disabled", "true");
    container.appendChild(button);
}

function getQuestions() {
    fetch(
        "https://quizapi.io/api/v1/questions?apiKey=tpta2uknvjhg2oFuh2z3pqM0pIAStFUmQN6gL8kO&limit=10"
    )
        .then((response) => response.json())
        .then((data) => {
            objQuestions = data;
            getNextQuestion();
        });
}

function openAuxmenu() {
    document.getElementById("blob").classList.toggle("grownSpin");
    document.getElementById("menuAux1").classList.toggle("grownShow1");
    document.getElementById("menuAux2").classList.toggle("grownShow2");
    document.getElementById("backMenu").classList.toggle("backSmoke");
}

function changePlayerModal() {
    document.getElementById("players").showModal();
    openAuxmenu();
}

function pickPlayer(name) {
    if (currentPlayer !== null) {
        let savePlayers = {
            ...players,
            [currentPlayer]: { score: currentScore },
        };
        savePlayers = JSON.stringify(savePlayers);
        localStorage.setItem("players", savePlayers);
    }
    players = localStorage.getItem("players");
    players = JSON.parse(players);
    currentPlayer = name;
    currentScore = players[name].score;
    console.log(name);
    console.log(players);
    document.getElementById("player").innerHTML = currentPlayer;
    document.getElementById("score").innerHTML = currentScore;
    document.getElementById("players").close();
    document.getElementById("msjInitial").innerHTML = "Now you can Play";
    document.getElementById("buttonInitial").style.opacity = 1;
    document.getElementById("buttonInitial").removeAttribute("disabled");
}

window.addEventListener("load", () => {
    if (!localStorage.getItem("players")) {
        localStorage.setItem(
            "players",
            '{"Carlos":{"score":50},"Zalpa":{"score":0},"Nedhel":{"score":0}}'
        );
    }
});
