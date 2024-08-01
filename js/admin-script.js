document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", function () {
      // Handle logout logic here
      localStorage.removeItem("loggedInUser");
      window.location.href = "index.html";
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
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const task = JSON.parse(localStorage.getItem(tasksKey)) || [];
  const tasks = Object.values(task).flat();

  const pendingRegistrationsTable = document.getElementById("pending-registrations").querySelector("tbody");
  const assignTasksTable = document.getElementById("assign-tasks").querySelector("tbody");
  const deleteMembersTable = document.getElementById("delete-members-list").querySelector("tbody");
  const rankedMembersTable = document.getElementById("ranked-members").querySelector("tbody");
  const assignTaskForm = document.getElementById("assignTaskForm");

  // Handle pending registrations
  users
      .filter((user) => user.type === "organization" && !user.approved)
      .forEach((user) => {
          const row = document.createElement("tr");

          const emailCell = document.createElement("td");
          emailCell.textContent = user.email;
          row.appendChild(emailCell);

          const actionCell = document.createElement("td");
          const approveBtn = document.createElement("button");
          approveBtn.textContent = "Approve";
          approveBtn.addEventListener("click", function () {
              user.approved = true;
              localStorage.setItem(usersKey, JSON.stringify(users));
              row.remove();
          });
          actionCell.appendChild(approveBtn);
          row.appendChild(actionCell);

          pendingRegistrationsTable.appendChild(row);
      });

  // Render tasks for a specific user
  function renderUserTasks(email) {
      const userTasks = tasks.filter((t) => t.assignedTo === email);
      const taskList = document.createElement("ul");
      taskList.innerHTML = "";
      userTasks.forEach((task) => {
          const listItem = document.createElement("li");
          listItem.textContent = `${task.task} - ${
              task.completed ? "Completed" : "Pending"
          }`;
          taskList.appendChild(listItem);
      });
      memberProgressList.appendChild(taskList);
  }

  // Assign tasks
  users
      .filter(
          (user) =>
              user.approved && user.role == "regular" && user.type == "organization"
      )
      .forEach((user) => {
          const row = document.createElement("tr");

          const fullNameCell = document.createElement("td");
          fullNameCell.textContent = user.fullName;
          row.appendChild(fullNameCell);

          const emailCell = document.createElement("td");
          emailCell.textContent = user.email;
          row.appendChild(emailCell);

          const actionCell = document.createElement("td");
          const assignBtn = document.createElement("button");
          assignBtn.textContent = "Assign Task";
          assignBtn.addEventListener("click", function () {
              assignTaskForm.style.display = "block";
              document
                  .getElementById("assignTaskInput")
                  .setAttribute("data-email", user.fullName);
              renderUserTasks(user.email);
          });
          actionCell.appendChild(assignBtn);
          row.appendChild(actionCell);

          assignTasksTable.appendChild(row);
      });

  // Assigning a task to a user
  assignTaskForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const taskInput = document.getElementById("assignTaskInput");
      const email = taskInput.getAttribute("data-email");
      const task = taskInput.value;

      tasks.push({
          task,
          addedBy: "admin",
          assignedTo: email,
          dateAdded: new Date().toISOString(),
          completed: false,
          dateCompleted: null,
      });
      localStorage.setItem(tasksKey, JSON.stringify(tasks));
      taskInput.value = "";
      renderUserTasks(email);
  });

  // Delete members
  users
      .filter((user) => user.type === "organization" && user.role === "regular")
      .forEach((user) => {
          const row = document.createElement("tr");

          const nameCell = document.createElement("td");
          nameCell.textContent = user.fullName;
          row.appendChild(nameCell);

          const emailCell = document.createElement("td");
          emailCell.textContent = user.email;
          row.appendChild(emailCell);

          const actionsCell = document.createElement("td");
          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.addEventListener("click", function () {
              users.splice(users.indexOf(user), 1);
              localStorage.setItem(usersKey, JSON.stringify(users));
              row.remove();
          });
          actionsCell.appendChild(deleteBtn);
          row.appendChild(actionsCell);

          deleteMembersTable.appendChild(row);
      });

  // Rank members based on completed tasks %
  function rankMembers() {
      const memberRanks = users
          .filter(
              (user) =>
                  user.approved &&
                  user.role === "regular" &&
                  user.type === "organization"
          )
          .map((user) => {
              const userTasks = tasks.filter((t) => t.userId === user.id);
              const completedTasks = userTasks.filter((t) => t.completed).length;
              const taskCompletionPercentage =
                  userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0;
              return { fullName: user.fullName, taskCompletionPercentage };
          });

      memberRanks.sort(
          (a, b) => b.taskCompletionPercentage - a.taskCompletionPercentage
      );

      rankedMembersTable.innerHTML = "";

      memberRanks.forEach((member) => {
          const row = document.createElement("tr");

          const fullNameCell = document.createElement("td");
          fullNameCell.textContent = member.fullName;
          row.appendChild(fullNameCell);

          const taskCompletionCell = document.createElement("td");
          taskCompletionCell.textContent = `${member.taskCompletionPercentage.toFixed(2)}%`;
          row.appendChild(taskCompletionCell);

          rankedMembersTable.appendChild(row);
      });
  }
  rankMembers();

  // Dummy data for charts
  const tasksData = {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [
          {
              data: [10, 5, 3],
              backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
          },
      ],
  };

  const membersData = {
      labels: ["Active", "Inactive"],
      datasets: [
          {
              data: [8, 2],
              backgroundColor: ["#007bff", "#6c757d"],
          },
      ],
  };

  // Initialize charts
  const tasksChartCtx = document.getElementById("tasksChart").getContext("2d");
  new Chart(tasksChartCtx, {
      type: "doughnut",
      data: tasksData,
  });

  const membersChartCtx = document.getElementById("membersChart").getContext("2d");
  new Chart(membersChartCtx, {
      type: "doughnut",
      data: membersData,
  });
});
