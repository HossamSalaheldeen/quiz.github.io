let count_span = document.querySelector(".questions-count span");
let bulletsSpanContainer = document.querySelector(".quiz-app .bullets .spans");
let question_area = document.querySelector(".quiz-app .quiz-area");
let answer_area = document.querySelector(".quiz-app .answers-area");
let submit_btn = document.querySelector(".quiz-app .submit-btn");
let bullet = document.querySelector(".quiz-app .bullets");
let resultsContainer = document.querySelector(".quiz-app .results");
let countdown_span = document.querySelector(".quiz-app .bullets .countdown")

let currentIndex = 0;
let rightanswers = 0;
let countdowninterval;


function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let numOfQuestions = questionsObject.length;

      createbullet(numOfQuestions);

      addQuestionData(questionsObject[currentIndex], numOfQuestions);
      countDown(5,numOfQuestions);
      submit_btn.onclick = () => {
        right_ans = questionsObject[currentIndex].right_answer;
        currentIndex++;
        checkAnswer(right_ans, numOfQuestions);

        question_area.innerHTML = "";
        answer_area.innerHTML = "";
        

        addQuestionData(questionsObject[currentIndex], numOfQuestions);

        handleBullets();
        clearInterval(countdowninterval);
        countDown(5,numOfQuestions);
        showResult(numOfQuestions);
      };
    }
    
  };

  myRequest.open("GET", "https://api.npoint.io/a5e78934efc67011e2bd", true);
  myRequest.send();
}

getQuestion();

function createbullet(numOfBullets) {
  count_span.innerHTML = numOfBullets;

  for (let i = 0; i < numOfBullets; i++) {
    let bullet_span = document.createElement("span");

    if (i === 0) {
      bullet_span.className = "on";
    }

    bulletsSpanContainer.appendChild(bullet_span);
  }
}

function addQuestionData(qobj, qcount) {
  if (currentIndex < qcount) {
    let qtitle = document.createElement("h2");
    let qtitletxt = document.createTextNode(qobj["title"]);
    qtitle.appendChild(qtitletxt);
    question_area.appendChild(qtitle);

    for (let i = 1; i <= 4; i++) {
      let answer_div = document.createElement("div");

      answer_div.className = "answer";

      let radio_input = document.createElement("input");
      radio_input.name = "question";
      radio_input.type = "radio";

      radio_input.id = `answer_${i}`;
      radio_input.dataset.answer = qobj[`answer_${i}`];

      if (i === 1) {
        radio_input.checked = true;
      }

      let ans_label = document.createElement("label");
      ans_label.htmlFor = `answer_${i}`;
      let anslabeltxt = document.createTextNode(qobj[`answer_${i}`]);

      ans_label.appendChild(anslabeltxt);

      answer_div.appendChild(radio_input);
      answer_div.appendChild(ans_label);

      answer_area.appendChild(answer_div);
    }
  }
}

function checkAnswer(right_answer, qcount) {
  let answers = document.getElementsByName("question");

  let chosen_ans;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosen_ans = answers[i].dataset.answer;
    }
  }

  if (right_answer === chosen_ans) {
    rightanswers++;
  }
}

function handleBullets() {
  let bullet_spans = document.querySelectorAll(
    ".quiz-app .bullets .spans span"
  );
  let arrayOfSpans = Array.from(bullet_spans);

  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResult(qcount) {

    let result;
    if(currentIndex === qcount) {
        question_area.remove();
        answer_area.remove();
        submit_btn.remove();
        bullet.remove();

        if(rightanswers > (qcount / 2) && rightanswers < qcount)
        {
            result = `<span class="good">Good</span>, ${rightanswers} From ${qcount}`;
        }
        else if(rightanswers === qcount) {
            result = `<span class="perfect">Perfect</span>, All Answers Is Good`;
        }
        else {
            result = `<span class="bad">Bad</span>, ${rightanswers} From ${qcount}`;
        }

        resultsContainer.innerHTML = result;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.backgroundColor = "white";
        resultsContainer.style.marginTop = "10px";
    }

    
}


function countDown(duration,qcount) {
  let mins , secs;
  countdowninterval = setInterval(function() {
    mins = parseInt(duration / 60);
    secs = parseInt(duration % 60);

    mins = mins < 10 ? `0${mins}`: mins;
    secs = secs < 10 ? `0${secs}`: secs;

    countdown_span.innerHTML = `${mins}:${secs}`

  if(--duration < 0) {
    clearInterval(countdowninterval);
    submit_btn.click();
  }
  },1000);


  
}
