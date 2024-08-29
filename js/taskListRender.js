import * as assignedTasksAdmin from '../js/assignedTasksRender.js';
export function renderTaskList() {
    const usersKey = "users";
    const createdTasksKey = "createdTasks";
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const createdTasks = JSON.parse(localStorage.getItem(createdTasksKey)) || [];
    const taskListTable = document.getElementById("taskListTable").querySelector("tbody");
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
          assignedTasksAdmin.renderAssignedTasks();
          alert("Task assigned successfully.");
        });

        actionCell.innerHTML = "";
        actionCell.appendChild(select);
        actionCell.appendChild(confirmBtn);
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
          alert("Task updated successfully.");
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