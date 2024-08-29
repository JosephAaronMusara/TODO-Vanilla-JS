document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const dueDateInput = document.getElementById("task-input-due-date");
  const editTaskForm = document.getElementById("edit-task-form");
  const editTaskText = document.getElementById("edit-task-text");
  const editTaskDueDate = document.getElementById("edit-task-due-date");
  const saveTaskBtn = document.getElementById("save-task-btn");
  const cancelTaskBtn = document.getElementById("cancel-task-btn");
  const userTasksTable = document
    .getElementById("userTasksTable")
    .querySelector("tbody");

  const logoutBtn = document.getElementById("logout-btn-user");
  const currentUserId = JSON.parse(localStorage.getItem("currentUserId"));

  logoutBtn.addEventListener("click", () => {
    const isConfirmed = confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("currentUserId");
      window.location.href = "login.html";
    }
  });

  const loadTasks = () => {
    const tasks = JSON.parse(localStorage.getItem("userTasks")) || [];
    return tasks.filter((task) => task.userId === currentUserId);
  };

  const loadAdminAssignedTasks = () => {
    const createdTasks = JSON.parse(localStorage.getItem("createdTasks")) || [];
    return createdTasks.filter(
      (task) => String(task.assignedTo).trim() === String(currentUserId).trim()
    );
  };

  const saveTasks = (tasks) => {
    const allTasks = JSON.parse(localStorage.getItem("userTasks")) || [];
    const filteredTasks = allTasks.filter(
      (task) => task.userId !== currentUserId
    );
    const updatedTasks = [...filteredTasks, ...tasks];
    localStorage.setItem("userTasks", JSON.stringify(updatedTasks));
  };

  const renderTasks = () => {
    userTasksTable.innerHTML = "";

    const tasks = loadTasks();
    const adminAssignedTasks = loadAdminAssignedTasks();
    const allTasks = [...tasks, ...adminAssignedTasks];

    allTasks.forEach((task) => {
      const row = document.createElement("tr");

      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = task.text;
      row.appendChild(descriptionCell);

      const dateAddedCell = document.createElement("td");
      dateAddedCell.textContent = task.dateAdded;
      row.appendChild(dateAddedCell);

      const dueDateCell = document.createElement("td");
      dueDateCell.textContent = task.dueDate;
      row.appendChild(dueDateCell);

      const dateCompletedCell = document.createElement("td");
      dateCompletedCell.textContent = task.completed
        ? task.dateCompleted
        : "Not Completed";
      row.appendChild(dateCompletedCell);

      const reasonCell = document.createElement("td");
      const reasonInput = document.createElement("input");
      reasonInput.type = "text";
      reasonInput.classList = "incomplete-reason";
      reasonInput.placeholder = "Reason for not completing";
      reasonInput.disabled = task.completed;
      reasonInput.value = task.reason || "";
      reasonCell.appendChild(reasonInput);
      row.appendChild(reasonCell);

      const actionsCell = document.createElement("td");

      const completedChk = document.createElement("input");
      completedChk.type = "checkbox";
      completedChk.className = "complete-task";
      completedChk.checked = task.completed;
      completedChk.style.marginRight = "15px";
      actionsCell.appendChild(completedChk);

      const editTskBtn = document.createElement("button");
      editTskBtn.textContent = "Edit";
      actionsCell.appendChild(editTskBtn);

      const deleteTskBtn = document.createElement("button");
      deleteTskBtn.textContent = "Delete";
      (deleteTskBtn.style.backgroundColor = "red"),
        actionsCell.appendChild(deleteTskBtn);

      if (task.addedBy !== "self") {
        editTskBtn.disabled = true;
        deleteTskBtn.disabled = true;
        editTskBtn.classList.add("hidden");
        deleteTskBtn.classList.add("hidden");
      }

      row.appendChild(actionsCell);
      userTasksTable.appendChild(row);

      completedChk.addEventListener("change", () => {
        task.completed = completedChk.checked;
        task.dateCompleted = task.completed
          ? new Date().toLocaleString()
          : null;
        task.reason = task.completed ? "" : reasonInput.value;

        let tasks = loadTasks();
        const taskIndex = tasks.findIndex((t) => t.id === task.id);
        if (taskIndex > -1) {
          tasks[taskIndex] = task;
        }
        saveTasks(tasks);

        renderTasks();
      });

      editTskBtn.addEventListener("click", () => {
        editingTaskId = task.id;
        editTaskText.value = task.text;
        editTaskDueDate.value = task.dueDate;
        editTaskForm.classList.remove("hidden");
      });

      deleteTskBtn.addEventListener("click", () => {
        const confirmed = confirm("Are you sure you want to delete this task?");
        if (confirmed) {
          let tasks = loadTasks();
          tasks = tasks.filter((t) => t.id !== task.id);
          saveTasks(tasks);
          renderTasks();
        }
      });

      reasonInput.addEventListener("input", () => {
        task.reason = reasonInput.value;
        saveTasks(loadTasks());
      });
    });
  };

  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (taskText !== "") {
      const today = new Date();
      const selectedDate = new Date(dueDate);

      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        alert("Due date cannot be in the past.");
        return;
      }

      const tasks = loadTasks();
      const newTask = {
        id: Date.now(),
        text: taskText,
        dateAdded: new Date().toLocaleString(),
        dueDate: dueDate,
        addedBy: "self",
        dateCompleted: null,
        completed: false,
        reason: "",
        userId: currentUserId,
      };
      tasks.push(newTask);
      saveTasks(tasks);
      renderTasks();
      taskInput.value = "";
      dueDateInput.value = "";
      alert("Task added successfully!");
    }
  });

  let editingTaskId = null;

  saveTaskBtn.addEventListener("click", () => {
    if (editingTaskId) {
      const tasks = loadTasks();
      const task = tasks.find((t) => t.id === editingTaskId);
      if (task) {
        task.text = editTaskText.value;
        task.dueDate = editTaskDueDate.value;
        saveTasks(tasks);
        renderTasks();
        editTaskForm.classList.add("hidden");
        editingTaskId = null;
      }
    }
  });

  cancelTaskBtn.addEventListener("click", () => {
    editTaskForm.classList.add("hidden");
    editingTaskId = null;
  });

  renderTasks();
});
