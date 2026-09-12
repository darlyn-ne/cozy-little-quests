console.log(localStorage.getItem('todoList'));
const savedTodoList = localStorage.getItem('todoList');

const todoList = savedTodoList
  ? JSON.parse(savedTodoList)
  : [];

renderTodoList();

function renderTodoList() {
  let todoListHTML = '';

  for (let i = 0; i < todoList.length; i++) {
    const todoObject = todoList[i];
    //const name = todoObject.name;
    //const dueDate = todoObject.dueDate;
    const { name, dueDate } = todoObject;
    const html = `
      <div class="${todoObject.completed ? 'completed' : ''}">
        ${name}
      </div>

      <div class="todo-date">${dueDate}</div>

      <button onclick="
        todoList[${i}].completed = !todoList[${i}].completed;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        renderTodoList();
      " class="complete-todo-button">
        ${todoObject.completed ? 'Undo' : 'Complete'}
      </button>

      <button onclick="
        todoList.splice(${i}, 1);
        localStorage.setItem('todoList', JSON.stringify(todoList));
        renderTodoList();
      " class="delete-todo-button">
        Delete
      </button>
    `;
    todoListHTML += html;
  }

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;
}

function addTodo() {
  const inputElement = document.querySelector('.js-name-input');
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-date-input');
  const dueDate = dateInputElement.value;

  todoList.push({
    //name: name,
    //dueDate: dueDate
    name,
    dueDate,
    completed: false
  });

  localStorage.setItem('todoList', JSON.stringify(todoList));

  inputElement.value = '';

  renderTodoList();
}


// Timer functionality


let timer;
let timeLeft = 5; // 30 minutes in seconds

const timerSound = document.querySelector('.js-timer-sound');

function updateTimer() {
  const timerElement = document.querySelector('.js-timer-value');

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerElement.innerHTML = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
  if (timer) {
    return;
  }

  timer = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(timer);
      timer = null;
      timerSound.play();
      fadeOutRadio();
    }
  }, 1000);
}


function stopTimer() {
  clearInterval(timer);
  timer = null;
}

/*
function resetTimer() {
  clearInterval(timer);
  timeLeft = 60;
  updateTimer();
}
*/

function setTimer(minutes) {
  clearInterval(timer);
  timeLeft = minutes * 60;
  updateTimer();
}

updateTimer();

// Radio functionality

const radioSound = document.querySelector('.js-radio-sound');

let fadeInterval;
const normalVolume = 1;

function playRadio() {
  clearInterval(fadeInterval);
  fadeInterval = null;

  radioSound.play();
  fadeInRadio();
}

function pauseRadio() {
  radioSound.pause();
}

function stopRadio() {
  radioSound.pause();
  radioSound.currentTime = 0;
}

function fadeOutRadio() {
  clearInterval(fadeInterval);

  const fadeDuration = 3000;
  const fadeStep = 50;
  const volumeStep = normalVolume / (fadeDuration / fadeStep);

  fadeInterval = setInterval(() => {
    radioSound.volume -= volumeStep;

    if (radioSound.volume <= 0) {
      radioSound.volume = 0;
      radioSound.pause();

      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }, fadeStep);
}

function fadeInRadio() {
  clearInterval(fadeInterval);

  const fadeDuration = 3000;
  const fadeStep = 50;
  const volumeStep = normalVolume / (fadeDuration / fadeStep);

  fadeInterval = setInterval(() => {
    radioSound.volume += volumeStep;

    if (radioSound.volume >= normalVolume) {
      radioSound.volume = normalVolume;

      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }, fadeStep);
}