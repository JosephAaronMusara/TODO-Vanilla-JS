document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logout-btn");

  logoutBtn.addEventListener("click", function () {
    const isConfirmed = confirm('Are you sure you want to log out?');
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

  const assignTasksTable = document.getElementById("assign-tasks").querySelector("tbody");
  const rankedMembersTable = document.getElementById("ranked-members").querySelector("tbody");
  const taskListTable = document.getElementById("taskListTable").querySelector("tbody");
  const allTasksTable = document.getElementById("allTasksTable").querySelector("tbody");
  const userManagementTable = document.getElementById("member-management").querySelector("tbody");

  //notifications
  function showNotification(message) {
    alert(message);
  }

  // Create tasks ----------- with date validation
  const createTaskForm = document.getElementById("createTaskForm");
  createTaskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDateInput");

    const taskText = taskInput.value;
    const dueDate = new Date(dueDateInput.value);

    // Validate that the due date is not in the past
    if (dueDate < new Date()) {
      showNotification("Due date cannot be in the past.");
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

    renderTaskList();
    showNotification("Task created successfully.");
    createTaskForm.classList.add('hidden');
    document.getElementById('AssignedTasks').classList.add("active");
  });

  function renderTaskList() {
    taskListTable.innerHTML = "";

    createdTasks.forEach((task) => {
      const row = document.createElement("tr");

      const taskCell = document.createElement("td");
      taskCell.textContent = task.text;
      row.appendChild(taskCell);

      const dueDateCell = document.createElement("td");
      dueDateCell.textContent = new Date(task.dueDate).toLocaleString();
      row.appendChild(dueDateCell);

      const actionCell = document.createElement("td");
      const assignBtn = document.createElement("button");
      assignBtn.textContent = "Assign to";
      assignBtn.addEventListener("click", function () {
        const select = document.createElement("select");
        users.forEach((user) => {
          if (
            user.approved &&
            user.role === "regular" &&
            user.type === "organization"
          ) {
            const option = document.createElement("option");
            option.value = user.id;
            option.textContent = user.fullName;
            select.appendChild(option);
          }
        });
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = "Confirm";
        confirmBtn.addEventListener("click", function () {
          task.assignedTo = select.value;
          task.dateAdded = new Date().toLocaleString();
          task.completed = false;
          localStorage.setItem(createdTasksKey, JSON.stringify(createdTasks));

          renderTaskList();
          renderAssignedTasks();
          showNotification("Task assigned successfully.");
        });

        actionCell.innerHTML = "";
        actionCell.appendChild(select);
        actionCell.appendChild(confirmBtn);
        actionCell.appendChild(editTaskBtn);
      });

      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.classList.add("edit-btn");
      editButton.dataset.taskId = task.id;

      editButton.addEventListener("click", function () {
        const editTaskForm = document.getElementById("edit-task-form");
        const taskId = this.dataset.taskId;
        const taskToEdit = createdTasks.find((t) => t.id === parseInt(taskId));

        document.getElementById("admin-edit-task-text").value = taskToEdit.text;
        document.getElementById("admin-edit-task-due-date").value = taskToEdit.dueDate.split("T")[0];

        editTaskForm.classList.remove("hidden");

        document.getElementById("save-task-btn").onclick = function () {
          const newTaskText = document.getElementById("admin-edit-task-text").value;
          const newDueDate = new Date(document.getElementById("admin-edit-task-due-date").value);

          if (newDueDate < new Date()) {
            showNotification("Due date cannot be in the past.");
            return;
          }

          taskToEdit.text = newTaskText;
          taskToEdit.dueDate = newDueDate.toISOString();

          localStorage.setItem(createdTasksKey, JSON.stringify(createdTasks));
          editTaskForm.classList.add("hidden");

          renderTaskList();
          showNotification("Task updated successfully.");
        };

        document.getElementById("cancel-task-btn").onclick = function () {
          editTaskForm.classList.add("hidden");
        };
      });
      
      // const editTaskBtn = document.createElement("button");
      // editTaskBtn.textContent = "Edit";
      // editTaskBtn.addEventListener('click',()=>{
      //   document.getElementById('edit-task-form').classList.remove('hidden');
      //   document.getElementById('admin-edit-task-text').value = task.text;
      //   document.getElementById('admin-edit-task-due-date').value = task.dueDate;
      // });
      actionCell.appendChild(assignBtn);
      actionCell.appendChild(editButton);
      row.appendChild(actionCell);

      taskListTable.appendChild(row);
    });
  }
  // const cancelTastEdit = document.getElementById('cancel-task-btn');
  // cancelTastEdit.addEventListener('click',()=>{
  //   document.getElementById('edit-task-form').classList.add('hidden');
  // });

  // const saveTaskEdit = document.getElementById('save-task-btn');
  // saveTaskEdit.addEventListener('click',()=>{
  //   document.getElementById('edit-task-form').classList.add('hidden');
  //   alert('Unable to update tasks at the moment');
  // });

  function renderAssignedTasks() {
    assignTasksTable.innerHTML = "";

    createdTasks
      .filter((task) => task.assignedTo)
      .forEach((task) => {
        const row = document.createElement("tr");

        const taskCell = document.createElement("td");
        taskCell.textContent = task.text;
        row.appendChild(taskCell);

        const assignedToCell = document.createElement("td");
        const assignedUser = users.find((user) => {
          return String(user.id).trim() === String(task.assignedTo).trim();
        });

        assignedToCell.textContent = assignedUser
          ? assignedUser.fullName
          : "N/A";
        row.appendChild(assignedToCell);

        const dueDateCell = document.createElement("td");
        dueDateCell.textContent = new Date(task.dueDate).toLocaleString();
        row.appendChild(dueDateCell);

        const timeRemainingCell = document.createElement("td");
        const remainingTime = calculateTimeRemaining(task.dueDate);
        timeRemainingCell.textContent = remainingTime.text;
        if (remainingTime.overdue) {
          timeRemainingCell.style.color = "red";
        }
        row.appendChild(timeRemainingCell);

        const actionCell = document.createElement("td");
        const completeBtn = document.createElement("button");
        completeBtn.textContent = "Mark as Completed";
        completeBtn.addEventListener("click", function () {
          task.completed = true;
          localStorage.setItem(createdTasksKey, JSON.stringify(createdTasks));
          renderAssignedTasks();
          showNotification("Task marked as completed.");
        });
        if (task.completed) {
          completeBtn.disabled = true;
          completeBtn.textContent = "Completed";
          completeBtn.style.backgroundColor = "green";
        }
        actionCell.appendChild(completeBtn);
        row.appendChild(actionCell);

        assignTasksTable.appendChild(row);
      });
  }

  function calculateTimeRemaining(dueDate) {
    const now = new Date();
    const due = new Date(dueDate);
    const remainingMilliseconds = due - now;

    if (remainingMilliseconds <= 0) {
      return { text: "Overdue", overdue: true };
    }

    const days = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));
    if (days > 0) {
      return { text: `${days}d`, overdue: false };
    }

    const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor(
      (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    return { text: `${hours}h ${minutes}m`, overdue: false };
  }

  // Initial rendering
  overView();
  renderTaskList();
  renderAssignedTasks();
  renderUsers();

  // Update assigned tasks every minute to reflect time remaining
  setInterval(renderAssignedTasks, 60000);

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
        const completedTasks = userTasks.filter((t) => t.completed);
        const completedTasksCount = completedTasks.length;
        const numOfTasks = userTasks.length;//
        const completedOnTime = completedTasks.filter((t)=>{t.dueDate > t.dateCompleted});//
        const completedOnTimeCount = completedOnTime.length;//
        const completedAfterDueDate = completedTasks.filter(t=>t.dueDate < t.dateCompleted);
        const afterDueCount = completedAfterDueDate.length;
        const assignedTasksCount = createdTasks.filter((t) => String(t.assignedTo) ===String(user.id)).length;
        const taskCompletionPercentage = userTasks.length > 0 ? (completedTasksCount / numOfTasks) * 100 : 0;
        return { fullName: user.fullName, taskCompletionPercentage ,completedTasksCount,numOfTasks, completedOnTimeCount, assignedTasksCount, afterDueCount};
      });

    memberRanks.sort(
      (a, b) => b.taskCompletionPercentage - a.taskCompletionPercentage
    );

    rankedMembersTable.innerHTML = "";

    memberRanks.forEach((member) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = member.fullName;
      row.appendChild(nameCell);

      const totalTasksCell = document.createElement("td");
      totalTasksCell.textContent = member.numOfTasks;
      row.appendChild(totalTasksCell);

      const completedTasksCell = document.createElement("td");
      completedTasksCell.textContent = member.completedTasksCount;
      row.appendChild(completedTasksCell);

      const onTimeCell = document.createElement("td");
      onTimeCell.textContent = member.completedOnTimeCount;
      row.appendChild(onTimeCell);

      const afterDueCell = document.createElement("td");
      afterDueCell.textContent = member.afterDueCount;
      row.appendChild(afterDueCell);

      const assignedCountCell = document.createElement("td");
      assignedCountCell.textContent = member.assignedTasksCount;
      row.appendChild(assignedCountCell);

      console.log(member)

      const taskCompletionCell = document.createElement("td");
      taskCompletionCell.textContent = `${member.taskCompletionPercentage.toFixed(2)}%`;
      row.appendChild(taskCompletionCell);

      rankedMembersTable.appendChild(row)
    });
    const rankCriteria = document.getElementById('stats-select');
    rankCriteria.addEventListener('change',()=>{
      const rankCriteriaValue = rankCriteria.value;
      const statsTasksTable = document.getElementById('statsTasksTable');
      
      // switch(rankCriteriaValue){
      //   case('rankMembers'):
      //   rankedMembersTable.style.display = 'block';
      //   break;
      //   case('completedTasks'):
      //   rankedMembersTable.style.display = 'none';
      //   renderAllTasks(completedTasks,statsTasksTable);
      //   break;
      //   case('completedOnTime'):
      //   rankedMembersTable.style.display = 'none';
      //   renderAllTasks(completedOnTime,statsTasksTable);
      //   break;
      //   case('completedAfterTime'):
      //   rankedMembersTable.style.display = 'none';
      //   renderAllTasks(completedAfterDueDate,statsTasksTable);
      //   break;

      // }

    });
  }
  rankMembers();

  //Admin view all tasks ---currently working on this
  const taskSearchInput = document.getElementById("taskSearchInput");
  const renderAllTasks = (tasks,tableName) => {
    allTasksTable.innerHTML = "";
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
  renderAllTasks(tasks,allTasksTable);

  const adminCreateTaskBtn = document.getElementById('createTaskBtn');
  adminCreateTaskBtn.addEventListener('click',()=>{
    document.getElementById('tab').style.display='none';
    document.getElementById('AssignedTasks').classList.remove("active");
    document.getElementById('userTasks').style.display='none';
    document.getElementById('createdTasks').style.display='none';
    createTaskForm.classList.remove('hidden');
  });

  //filter tasks
  // taskSearchInput.addEventListener("input", (e) => {
  //   e.preventDefault();
  //   const searchValue = e.target.value.toLowerCase();
  //   const filteredTasks = tasks.filter((task) =>
  //     String(task.text).toLowerCase().includes(searchValue)
  //   );
  //   renderAllTasks(filteredTasks);
  // });
  // renderAllTasks(tasks);

  function renderUsers(){

  users.filter((user) => user.type === "organization" && user.role === "regular").forEach((user) => {

      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = user.fullName;
      row.appendChild(nameCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      row.appendChild(emailCell);

      const isApprovedCell = document.createElement("td");
      isApprovedCell.textContent = user.approved ? "YES" : "NO";
      row.appendChild(isApprovedCell);

      const actionsCell = document.createElement("td");

      const approveBtn = document.createElement("button");
      approveBtn.textContent = user.approved ? "Deactivate" : "Activate";
      approveBtn.style.backgroundColor = approveBtn.textContent == "Deactivate" ? "orange" : "green";
      approveBtn.addEventListener("click", function () {
        if(!user.approved){
        user.approved = true;
        localStorage.setItem(usersKey, JSON.stringify(users));
        approveBtn.textContent = "Deactivate";
        showNotification(`Account for ${user.fullName} successfully activated!`);
        location.reload();
        }else{
          user.approved = false;
          localStorage.setItem(usersKey, JSON.stringify(users));
          approveBtn.textContent = "Activate";
          showNotification(`Account for ${user.fullName} successfully deactivated!`);
          location.reload();
        }
        
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click",function(){
        //Edit logic heeeeeeeeee
        alert('User editing will be implemented in the next update!');
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.backgroundColor = "red";
      deleteBtn.addEventListener("click", function () {
        const confirmed = confirm(
          `Are you sure you want to delete ${user.fullName}?`
        );
        if (confirmed) {
          const userIndex = users.findIndex((u) => u.id === user.id);
          users.splice(userIndex, 1);
          localStorage.setItem(usersKey, JSON.stringify(users));
          row.remove();
          showNotification("User deleted successfully.");
        }
      });
      actionsCell.appendChild(deleteBtn);
      actionsCell.appendChild(approveBtn);
      actionsCell.appendChild(editBtn);
      row.appendChild(actionsCell);

      userManagementTable.appendChild(row);
    })
  };

function overView(){
  const totalTasks = createdTasks.length;
  const completedTasks = createdTasks.filter((task) => task.completed).length;
  const overdueTasks = createdTasks.filter(
    (task) => new Date(task.dueDate) < new Date() && !task.completed
  ).length;
  const pendingTasks = totalTasks - completedTasks - overdueTasks;

  const tasksData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        data: [completedTasks, pendingTasks, overdueTasks],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  const activeMembers = users.filter(
    (user) =>
      user.approved && user.type === "organization" && user.role === "regular"
  ).length;
  const inactiveMembers = users.length - activeMembers;

  const membersData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [activeMembers, inactiveMembers],
        backgroundColor: ["#007bff", "#6c757d"],
      },
    ],
  };

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
}
});
