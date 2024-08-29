export function renderAssignedTasks() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tasks = JSON.parse(localStorage.getItem('userTasks')) || [];
    const createdTasks = JSON.parse(localStorage.getItem('createdTasks')) || [];  
    const assignTasksTable = document.getElementById("assign-tasks").querySelector("tbody");
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
          alert("Task marked as completed.");
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