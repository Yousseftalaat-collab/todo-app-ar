export const initDragAndDrop = () => {
  console.log("initDragAndDrop called");
  const list = document.querySelector(".TaskList__list");
  if (!list) {
    console.log("No .TaskList__list found");
    return;
  }
  let draggedItem = null;
  const requireHandle = false;

  const attach = () => {
    const items = [...list.querySelectorAll("li")];
    console.log("dragDrop attach - items:", items.length);
    items.forEach((item, index) => {
      item.dataset.index = index;
      item.setAttribute("draggable", "true");

      item.removeEventListener("dragstart", handleDragStart);
      item.removeEventListener("dragend", handleDragEnd);

      item.addEventListener("dragstart", handleDragStart);
      item.addEventListener("dragend", handleDragEnd);
    });
  };

  function handleDragStart(e) {
    if (requireHandle && !e.target.closest(".TaskList__dragHandle")) {
      try {
        e.dataTransfer.setData("text/plain", "");
      } catch (err) {}
      return;
    }

    draggedItem = this;
    this.classList.add("dragging");
    console.log(
      "dragstart index:",
      this.dataset.index,
      "text:",
      this.querySelector(".TaskList__value")?.innerText
    );

    try {
      e.dataTransfer.setData("text/plain", "drag");
    } catch (err) {}
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragEnd() {
    if (!draggedItem) return;
    console.log("dragend");
    draggedItem.classList.remove("dragging");
    draggedItem = null;

    updateTasksOrder();
  }

  list.addEventListener("dragover", (e) => {
    e.preventDefault();
    if (!draggedItem) return;
    const afterElement = getDragAfterElement(list, e.clientY);
    if (afterElement == null) {
      list.appendChild(draggedItem);
    } else {
      list.insertBefore(draggedItem, afterElement);
    }
  });

  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll("li:not(.dragging)"),
    ];
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    for (const child of draggableElements) {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        closest = { offset, element: child };
      }
    }
    return closest.element;
  }

  function updateTasksOrder() {
    const listItems = [...list.querySelectorAll("li")];
    const tasks = listItems.map((li) => {
      const text =
        li.querySelector(".TaskList__value")?.innerText?.trim() ?? "";
      const isCompleted = li.classList.contains(
        "TaskList__taskContent--isActive"
      );
      return { value: text, isCompleted };
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.dispatchEvent(
      new CustomEvent("tasksOrderChanged", { detail: tasks })
    );
  }

  attach();
};
