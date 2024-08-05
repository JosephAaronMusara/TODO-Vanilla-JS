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
    const createdTasksKey = "createdTasks";
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const tasks = JSON.parse(localStorage.getItem(tasksKey)) || {};
    const createdTasks = JSON.parse(localStorage.getItem(createdTasksKey)) || [];

    const pendingRegistrationsTable = document.getElementById("pending-registrations").querySelector("tbody");
    const assignTasksTable = document.getElementById("assign-tasks").querySelector("tbody");
    const deleteMembersTable = document.getElementById("delete-members-list").querySelector("tbody");
    const rankedMembersTable = document.getElementById("ranked-members").querySelector("tbody");
    const taskListTable = document.getElementById("taskListTable").querySelector("tbody");

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

    // Create tasks
    const createTaskForm = document.getElementById("createTaskForm");
    createTaskForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const taskInput = document.getElementById("taskInput");
        const dueDateInput = document.getElementById("dueDateInput");

        const taskText = taskInput.value;
        const dueDate = dueDateInput.value;

        createdTasks.push({
            id: Date.now(),
            text: taskText,
            dueDate: dueDate,
            assignedTo: null,
            completed: false,
        });

        localStorage.setItem(createdTasksKey, JSON.stringify(createdTasks));
        taskInput.value = "";
        dueDateInput.value = "";

        renderTaskList();
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
                    if (user.approved && user.role === "regular" && user.type === "organization") {
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
                    localStorage.setItem(createdTasksKey, JSON.stringify(createdTasks));
                    renderTaskList();
                    renderAssignedTasks();
                });

                actionCell.innerHTML = "";
                actionCell.appendChild(select);
                actionCell.appendChild(confirmBtn);
            });
            actionCell.appendChild(assignBtn);
            row.appendChild(actionCell);

            taskListTable.appendChild(row);
        });
    }

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
                const assignedUser = users.find((user) => user.id === task.assignedTo);
                assignedToCell.textContent = assignedUser ? assignedUser.fullName : "N/A";
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
                });
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

        const hours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return { text: `${hours}h ${minutes}m`, overdue: false };
    }

    // Initial rendering
    renderTaskList();
    renderAssignedTasks();

    // Update assigned tasks every minute to reflect time remaining
    setInterval(renderAssignedTasks, 60000);

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
