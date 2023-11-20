let countSpan = document.querySelector (".quiz-container .quiz-info .questions-count span");
let SpanCountainer = document.querySelector (".quiz-container .bullets .span-container");
let questionContainer = document.querySelector (".quiz-container .questions-area .question");
let answerContainer = document.querySelector (".quiz-container .answers-area");
let submitButton = document.querySelector (".submit-question");
let resultsContainer = document.querySelector (".results");
let bullets = document.querySelector (".quiz-container .bullets");
let counterContainer = document.querySelector (".bullets .time-counter");

let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;

function getQuestions () {
  let myRequest = new XMLHttpRequest ();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse (myRequest.responseText);
      let questionLength = questionObject.length;
      questionCount(questionLength);
      addQuestion (questionObject[currentIndex], questionLength);
      
      countdown(5,questionLength);
      submitButton.onclick = function () {
        let theRightAnswer = questionObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer (theRightAnswer , questionLength);
        questionContainer.innerHTML = " ";
        answerContainer.innerHTML = " ";
        addQuestion (questionObject[currentIndex], questionLength);
        handleBullets ();
        clearInterval(countDownInterval);
        countdown(5,questionLength);
        showResults (questionLength);
      }

    }


  }
  myRequest.open ("GET", "questions.json", true);
  myRequest.send();
}


getQuestions();


function questionCount (questionLength) {
  countSpan.innerHTML = questionLength;
  for (let i = 0; i<questionLength ;i++) {
    let span = document.createElement ("span");
    SpanCountainer.appendChild (span);
    if (i === 0) {
      span.className = "on";
    }
  }
}

function addQuestion (obj, count ) {
  if (currentIndex < count) {
  let questionTitle = document.createElement ("h3");
  let questionTitleText = document.createTextNode (obj["title"]);
  questionTitle.appendChild (questionTitleText);
  questionContainer.appendChild (questionTitle);
  for (let i = 0; i < 4 ; i++) {
    let answerDiv = document.createElement ("div");
    answerDiv.className = "answer";
    let answerInput = document.createElement ("input");
    answerInput.setAttribute ("type", "radio");
    answerInput.setAttribute ("id", `answer_${i+1}`);
    answerInput.setAttribute ("name", "questions");
    answerInput.dataset.answer = obj[`answer_${i+1}`];
    let answerLabel = document.createElement ("label");
    answerLabel.setAttribute ("for", `answer_${i+1}`);
    let labelText = document.createTextNode (obj[`answer_${i+1}`]);
    answerLabel.appendChild (labelText);
    answerDiv.appendChild(answerInput);
    answerDiv.appendChild (answerLabel);
    answerContainer.appendChild (answerDiv);
    if (answerInput.id === "answer_1") {
      answerInput.setAttribute ("checked", "");
    }
  }
  }

}

function checkAnswer (theRightAnswer, count) {
  let answers = document.getElementsByName ("questions");
  let chosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosenAnswer = answers[i].dataset.answer;
    }
  }

  if (chosenAnswer === theRightAnswer) {
    rightAnswer++;
    console.log ("good");
  }



}

function handleBullets () {
  let spans = document.querySelectorAll (".quiz-container .bullets .span-container span");
  let ArraySpans = Array.from (spans);
  ArraySpans.forEach (function (span, index) {
    if (currentIndex === index ) {
      span.className = "on";
    }
  }) 
}


function showResults (questionLength) {
  if (currentIndex === questionLength) {
    submitButton.remove ();
    questionContainer.remove();
    answerContainer.remove();
    bullets.remove (); 
    if (rightAnswer === questionLength) {
      resultsContainer.innerHTML = `<span class="perfect">Perfect</span> You Answered ${rightAnswer} of ${questionLength} Questions.`
    } else if (rightAnswer < questionLength && rightAnswer > (questionLength / 2)) {
      resultsContainer.innerHTML = `<span class="good">Good</span> You Answered ${rightAnswer} of ${questionLength} Questions.`
    } else {
      resultsContainer.innerHTML = `<span class="bad">Bad</span> You Answered ${rightAnswer} of ${questionLength} Questions.`
    }
  }

}

function countdown (duration, questionLength) {
  if (currentIndex < questionLength) {

    countDownInterval = setInterval (function () {
      let minutes = parseInt (duration / 60);
      let seconds = parseInt (duration % 60);
      minutes < 10 ? `0${minutes}`: `${minutes}`;
      seconds < 10 ? `0${seconds}`: `${seconds}`;
      counterContainer.innerHTML = `${minutes}:${seconds}`
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }


    }, 1000)

  }


}