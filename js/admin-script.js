import * as memberRankModule from "../js/memberRank.js";
import * as assignedTasksAdmin from "../js/assignedTasksRender.js";
import * as overviewDash from "../js/overview.js";
import * as userManagement from "../js/renderusers.js";
import * as taskList from "../js/taskListRender.js";

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("logout-btn").addEventListener("click", function () {
    const isConfirmed = confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    }
  });

  // Handle navigation
  const navLinks = document.querySelectorAll("#side-nav nav ul li a");
  const sections = document.querySelectorAll(".content-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetSection = this.getAttribute("data-section");

      sections.forEach((section) => {
        if (section.id === targetSection) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    });
  });

  const usersKey = "users";
  const tasksKey = "userTasks";
  const createdTasksKey = "createdTasks";
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];
  const createdTasks = JSON.parse(localStorage.getItem(createdTasksKey)) || [];

  const allTasksTable = document
    .getElementById("allTasksTable")
    .querySelector("tbody");

  const createTaskModal = document.getElementById("createTaskModal");
  const createTaskBtn = document.getElementById("createTaskBtn");
  const closeModal = document.querySelector(".close");

  createTaskBtn.addEventListener("click", function () {
    createTaskModal.style.display = "block";
  });

  closeModal.addEventListener("click", function () {
    createTaskModal.style.display = "none";
  });

  // Hide modal if we click outsd of it
  window.addEventListener("click", function (event) {
    if (event.target === createTaskModal) {
      createTaskModal.style.display = "none";
    }
  });

  const createTaskForm = document.getElementById("createTaskForm");
  createTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const taskText = taskInput.value;
    const dueDate = new Date(dueDateInput.value);

    if (dueDate < new Date()) {
      alert("Due date cannot be in the past.");
      return;
    }

    createdTasks.push({
      id: Date.now(),
      text: taskText,
      dueDate: dueDate.toISOString(),
      assignedTo: null,
      completed: false,
    });

    localStorage.setItem(createdTasksKey, JSON.stringify(createdTasks));
    taskInput.value = "";
    dueDateInput.value = "";

    taskList.renderTaskList();
    alert("Task created successfully.");
  });

  // Initial rendering
  overviewDash.overView();
  taskList.renderTaskList();
  assignedTasksAdmin.renderAssignedTasks();
  memberRankModule.rankMembers();
  userManagement.renderUsers();

  // Update assigned tasks every 10 minutes to reflect time remaining
  setInterval(assignedTasksAdmin.renderAssignedTasks, 600000);

  //Admin view all tasks
  const renderAllTasks = (tasks, tableName) => {
    tableName.innerHTML = "";
    tasks.forEach((task) => {
      const row = document.createElement("tr");

      const taskCell = document.createElement("td");
      taskCell.textContent = task.text;
      row.appendChild(taskCell);

      const taskForCell = document.createElement("td");
      const assignedUser = users.find((user) => {
        return String(user.id).trim() === String(task.userId).trim();
      });

      taskForCell.textContent = assignedUser ? assignedUser.fullName : "N/A";
      row.appendChild(taskForCell);

      const addedDateCell = document.createElement("td");
      addedDateCell.textContent = new Date(task.dateAdded).toLocaleString();
      row.appendChild(addedDateCell);

      const dueDateCell = document.createElement("td");
      dueDateCell.textContent = new Date(task.dueDate).toLocaleString();
      row.appendChild(dueDateCell);

      const isCompletedCell = document.createElement("td");
      isCompletedCell.textContent = task.completed
        ? "Completed"
        : "Not Completed";
      row.appendChild(isCompletedCell);

      const reasonCell = document.createElement("td");
      reasonCell.textContent = task.reason;
      row.appendChild(reasonCell);

      tableName.appendChild(row);
    });
  };
  renderAllTasks(tasks, allTasksTable);
  //filter tasks
  // const taskSearchInput = document.getElementById("taskSearchInput");
  // taskSearchInput.addEventListener("input", (e) => {
  //   e.preventDefault();
  //   const searchValue = e.target.value.toLowerCase();
  //   const filteredTasks = tasks.filter((task) =>
  //     String(task.text).toLowerCase().includes(searchValue)
  //   );
  //   renderAllTasks(filteredTasks);
  // });
  // renderAllTasks(tasks);
});
