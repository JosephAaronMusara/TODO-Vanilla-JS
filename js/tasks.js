document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const dueDateInput = document.getElementById('task-input-due-date');
    const editTaskForm = document.getElementById('edit-task-form');
    const editTaskText = document.getElementById('edit-task-text');
    const editTaskDueDate = document.getElementById('edit-task-due-date');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const cancelTaskBtn = document.getElementById('cancel-task-btn');

    const logoutBtn = document.getElementById('logout-btn-user');

    logoutBtn.addEventListener('click', () => {
        const isConfirmed = confirm('Are you sure you want to log out?');
        
        if (isConfirmed) {
            localStorage.removeItem('currentUserId');
            window.location.href = 'login.html';
        }
    });

    let editingTaskId = null;

    const currentUserId = localStorage.getItem('currentUserId');

    if (!currentUserId) {
        alert('No user is logged in. Redirecting to login page.');
        window.location.href = 'login.html';
        return;
    }

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('userTasks')) || [];
        return tasks.filter(task => task.userId === currentUserId);
    };

    const loadAdminAssignedTasks = () => {
        const createdTasks = JSON.parse(localStorage.getItem('createdTasks')) || [];
        return createdTasks.filter(task => String(task.assignedTo).trim() === String(currentUserId).trim());
    };

    const saveTasks = (tasks) => {
        const allTasks = JSON.parse(localStorage.getItem('userTasks')) || [];
        const filteredTasks = allTasks.filter(task => task.userId !== currentUserId);
        const updatedTasks = [...filteredTasks, ...tasks];
        localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
    };

    const renderTasks = () => {
        taskList.innerHTML = '';

        const tasks = loadTasks();
        if (tasks.length > 0) {
            const userTasksHeading = document.createElement('h3');
            userTasksHeading.textContent = 'Your Tasks';
            taskList.appendChild(userTasksHeading);
            tasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('task-item');
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                taskItem.dataset.id = task.id;
                taskItem.innerHTML = `
                    <span>${task.text} (Added: ${task.dateAdded}, Due Date: ${task.dueDate}, Completed: ${task.dateCompleted || 'Not completed'})</span>
                    <div class="task-actions">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="complete-task">
                        <button class="edit-task-btn">Edit</button>
                        <button class="delete-task-btn">Delete</button>
                        <input type="text" placeholder="Reason for not completing" class="incomplete-reason" value="${task.reason || ''}" ${task.completed ? 'disabled' : ''}>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        }

        const adminAssignedTasks = loadAdminAssignedTasks();
        if (adminAssignedTasks.length > 0) {
            const adminTasksHeading = document.createElement('h3');
            adminTasksHeading.textContent = 'Admin Assigned Tasks';
            taskList.appendChild(adminTasksHeading);
            adminAssignedTasks.forEach(task => {
                const taskItem = document.createElement('li');
                taskItem.classList.add('task-item');
                if (task.completed) {
                    taskItem.classList.add('completed');
                }
                taskItem.dataset.id = task.id;
                taskItem.innerHTML = `
                    <span>${task.text} (Assigned: ${task.dateAdded}, Due Date: ${task.dueDate})</span>
                    <div class="task-actions">
                        <input type="checkbox" ${task.completed ? 'checked' : ''} class="complete-task">
                        <input type="text" placeholder="Reason for not completing" class="incomplete-reason" value="${task.reason || ''}" ${task.completed ? 'disabled' : ''}>
                    </div>
                `;
                taskList.appendChild(taskItem);
            });
        }
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
            dueDateInput.value= '';
            alert("Task added Successfully!");
        }
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-task-btn')) {
            const taskItem = e.target.closest('.task-item');
            editingTaskId = taskItem.dataset.id;
            const task = loadTasks().find(t => t.id == editingTaskId);
            editTaskText.value = task.text;
            editTaskDueDate.value = task.dueDate;
            editTaskForm.classList.remove('hidden');
        }
        if (e.target.classList.contains('delete-task-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            let tasks = loadTasks();
            tasks = tasks.filter(task => task.id != taskId);
            saveTasks(tasks);
            renderTasks();
        }
    });

    saveTaskBtn.addEventListener('click', () => {
        if (editingTaskId) {
            const task = loadTasks().find(t => t.id == editingTaskId);
            if (task) {
                task.text = editTaskText.value;
                task.dueDate = editTaskDueDate.value;
                saveTasks(loadTasks());
                renderTasks();
                editTaskForm.classList.add('hidden');
                editingTaskId = null;
            }
        }
    });

    cancelTaskBtn.addEventListener('click', () => {
        editTaskForm.classList.add('hidden');
        editingTaskId = null;
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('complete-task')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            const tasks = loadTasks();
            const task = tasks.find(t => t.id == taskId);
            task.completed = e.target.checked;
            task.dateCompleted = task.completed ? new Date().toLocaleString() : null;
            task.reason = task.completed ? '' : taskItem.querySelector('.incomplete-reason').value;
            saveTasks(tasks);
            renderTasks();
        }
    });

    taskList.addEventListener('input', (e) => {
        if (e.target.classList.contains('incomplete-reason')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            const tasks = loadTasks();
            const task = tasks.find(t => t.id == taskId);
            task.reason = e.target.value;
            saveTasks(tasks);
        }
    });

    renderTasks();
});
