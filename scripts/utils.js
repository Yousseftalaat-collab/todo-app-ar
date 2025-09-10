import { AppElement, inputElement, taskListElement } from "./elements.js";
import { initTaskListeners } from "./eventListeners.js";
import { initDragAndDrop } from "./dragDrop.js";

export const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

export const toggleDarkMode = () => {
  AppElement.classList.toggle("App--isDark");
  saveToDB("darkModeFlag", AppElement.classList.contains("App--isDark"));
};

export const renderTaskList = (tasks) => {
  let taskList = "";
  tasks.forEach((task, index) => {
    taskList += `<li class="TaskList__taskContent${
      task.isCompleted ? " TaskList__taskContent--isActive" : ""
    }" draggable="true" data-index="${index}"> 
    <div class="TaskList__dragHandle" title="سحب لإعادة الترتيب">☰</div>


  <div class="TaskList__checkbox" tabindex="0" role="button">
  <img class="TaskList__checkboxImg" src="./assets/icon-checkmark.svg" alt="checkmark" />
  </div>
    
  <div class="TaskList__valueContent">
  <p class="TaskList__value">
   ${task.value}
  </P>

  <img src="./assets/icon-basket.svg"
  class ="TaskList__deleteIcon"
  alt="basket icon"
  />
  </div>
  </li>`;
  });

  taskListElement.innerHTML = taskList;
  inputElement.value = "";
};

export const deleteTask = (e, index) => {
  const answer = confirm("هل انت متاكد من حذف المهمة ؟ ");
  if (answer === false) return;

  const tasks = fetchData("tasks");
  tasks.splice(index, 1);
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

export const addTask = (e) => {
  e.preventDefault();
  const taskValue = inputElement.value;

  if (!taskValue) return;

  const task = {
    value: taskValue,
    isCompleted: false,
  };

  const tasks = fetchData("tasks") || [];

  tasks.unshift(task);
  saveToDB("tasks", tasks);

  initTaskList(tasks);
};

export const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initDataOnStartup = () => {
  fetchData("darkModeFlag") && toggleDarkMode();
  initTaskList(fetchData("tasks"));
};

export const renderEmptyState = () => {
  taskListElement.innerHTML = ` <li class = "EmptyList"> 
  <img class = "EmptyList__img" src="./assets/icon-empty.svg" alt="list is empty" /> 
  <p> قائمة المهام فارغة </p>
  </li>`;
};

export const initTaskList = (tasks) => {
  if (tasks?.length) {
    renderTaskList(tasks);
    initTaskListeners();
    initDragAndDrop();
  } else {
    renderEmptyState();
  }
};

export const toggleTask = (e, index) => {
  const tasks = fetchData("tasks");
  e.currentTarget.parentElement.classList.toggle(
    "TaskList__taskContent--isActive"
  );
  tasks[index].isCompleted = !tasks[index].isCompleted;
  if (tasks[index].isCompleted) {
    const [task] = tasks.splice(index, 1);
    tasks.push(task);
  }
  saveToDB("tasks", tasks);
  initTaskList(tasks);
};

document.addEventListener("tasksOrderChanged", (e) => {
  const tasks = e.detail ?? fetchData("tasks");
  initTaskList(tasks);
});
