document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", function () {
    // Handle logout logic here
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
  });

  // Handle navigation --working
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

  //table variables:
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const tbody = document.createElement("tbody");
  const tbodyDel = document.createElement("tbody");

  // data for pending registrations, organizations, and members from rocal storage --working
  const usersKey = "users";
  const tasksKey = "userTasks";
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const task = JSON.parse(localStorage.getItem(tasksKey)) || [];
  const tasks = Object.values(task).flat();

  const pendingRegistrationsList = document.getElementById(
    "pending-registrations"
  );
  const adminAssignTask = document.getElementById("assign-tasks");
  const deleteMembersList = document.getElementById("delete-members-list");
  const rankedMembersList = document.getElementById("ranked-members");
  const assignTaskForm = document.getElementById("assignTaskForm");

  // Handle pending registrations --working
  users
    .filter((user) => user.type === "organization" && !user.approved)
    .forEach((user) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${user.email}`;
      const approveBtn = document.createElement("button");
      approveBtn.textContent = "Approve";
      approveBtn.addEventListener("click", function () {
        user.approved = true;
        localStorage.setItem(usersKey, JSON.stringify(users));
        listItem.remove();
      });
      listItem.appendChild(approveBtn);
      pendingRegistrationsList.appendChild(listItem);
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

  //Assign tasks
  users
    .filter(
      (user) =>
        user.approved && user.role == "regular" && user.type == "organization"
    )
    .forEach((user) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${user.fullName} - ${user.email}`;
      listItem.addEventListener("click", function () {
        assignTaskForm.style.display = "block";
        document
          .getElementById("assignTaskInput")
          .setAttribute("data-email", user.fullName);
        renderUserTasks(user.email);
      });
      adminAssignTask.appendChild(listItem);
    });

  //assigning a task to a user --logic to be reviewed again
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

  //delete members --working
  thead.appendChild(headerRow);
  deleteMembersList.appendChild(thead);
  deleteMembersList.appendChild(tbodyDel);

  users
    .filter((user) => user.type === "organization" && user.role === "regular")
    .forEach((user) => {
      const row = document.createElement("tr");

      // Full Name
      const nameCell = document.createElement("td");
      nameCell.textContent = user.fullName;
      row.appendChild(nameCell);

      // Email
      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      row.appendChild(emailCell);

      // Actions
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

      tbodyDel.appendChild(row);
    });

  // rank members based on completed tasks % -- working partially
  function rankMembers() {
    //filter--------- tested and works well lol
    const memberRanks = users
      .filter(
        (user) =>
          user.approved &&
          user.role === "regular" &&
          user.type === "organization"
      )
      //Now checking the map
      .map((user) => {
        const userTasks = tasks.filter((t) => t.userId === user.id);//returnig empty array, array with 2 objects, empty array
        console.log(userTasks);//////////
        const completedTasks = userTasks.filter((t) => t.completed).length;
        const taskCompletionPercentage =
          userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 10;
        return { fullName: user.fullName, taskCompletionPercentage };
      });

    memberRanks.sort(
      (a, b) => b.taskCompletionPercentage - a.taskCompletionPercentage
    );
    // tbl data
    memberRanks.forEach((member) => {
      const row = document.createElement("tr");
      const fullNameCell = document.createElement("td");
      fullNameCell.textContent = member.fullName;
      const taskCompletionCell = document.createElement("td");
      taskCompletionCell.textContent = `${member.taskCompletionPercentage.toFixed(
        2
      )}%`;

      row.appendChild(fullNameCell);
      row.appendChild(taskCompletionCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    rankedMembersList.appendChild(table);
  }
  rankMembers();

  //To use real data soon -- working
  // Dummy data 4 charts
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

  const membersChartCtx = document
    .getElementById("membersChart")
    .getContext("2d");
  new Chart(membersChartCtx, {
    type: "doughnut",
    data: membersData,
  });
});
