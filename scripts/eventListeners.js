import {
  darkThemeToggleElement,
  getCheckBoxElements,
  getDeleteIcons,
  taskListElement,
  taskListLink,
  taskSearchBarButton,
} from "./elements.js";
import { addTask, deleteTask, toggleDarkMode, toggleTask } from "./utils.js";

export const initTaskListeners = () => {
  getDeleteIcons().forEach((icon, index) => {
    icon.addEventListener("click", (e) => deleteTask(e, index));
  });
  getCheckBoxElements().forEach((box, index) => {
    box.addEventListener("click", (e) => toggleTask(e, index));
    box.addEventListener("keydown", (e) => {
      e.key === "Enter" && toggleTask(e, index);
    });
  });
};

export const initListeners = () => {
  darkThemeToggleElement.addEventListener("click", toggleDarkMode);
  taskSearchBarButton.addEventListener("click", addTask);
  taskListLink.addEventListener("click", () => {
    taskListElement.classList.toggle("TaskList__list--hideCompleted");
    taskListLink.classList.toggle("TaskList__link--isActive");
  });
};
