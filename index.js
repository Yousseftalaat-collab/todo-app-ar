import {
  AppElement,
  darkThemeToggleElement,
  getCheckBoxElements,
  getDeleteIcons,
  inputElement,
  taskListElement,
  taskListLink,
  taskSearchBarButton,
} from "./scripts/elements.js";
import { initListeners } from "./scripts/eventListeners.js";
import { initDataOnStartup } from "./scripts/utils.js";
import { initDragAndDrop } from "./scripts/dragDrop.js";

initDataOnStartup();
initDragAndDrop();
initListeners();
