document.addEventListener('DOMContentLoaded', () => {
    // Registration and Login Form Elements
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const regRole = document.getElementById('reg-role');
    const regType = document.getElementById('reg-type');
    const authButtons = document.getElementById('auth-buttons');
    const showLoginButton = document.getElementById('show-login');
    const showRegisterButton = document.getElementById('show-register');
    
    // Task Form Elements
    const taskSection = document.getElementById('task-section');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const dueDateInput = document.getElementById("task-input-due-date");



    let currentUserId = null;
    let loggedInUser = null;

    // Load tasks from local storage

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('userTasks')) || [];
        return tasks.filter(task => task.userId === currentUserId);
    };

    // Load tasks assigned by the admin
    const loadAdminAssignedTasks = () => {
        const createdTasks = JSON.parse(localStorage.getItem('createdTasks')) || [];
        console.log(createdTasks);
        return createdTasks.filter(task => String(task.assignedTo).trim() === String(currentUserId).trim());
    };


    // Save tasks to local storage taraaaaaaaaaaaaa
    const saveTasks = (tasks) => {
        const allTasks = JSON.parse(localStorage.getItem('userTasks')) || [];
        const filteredTasks = allTasks.filter(task => task.userId !== currentUserId);
        const updatedTasks = [...filteredTasks, ...tasks];
        localStorage.setItem('userTasks', JSON.stringify(updatedTasks));
    };
    
      
// Render tasks
const renderTasks = () => {
    taskList.innerHTML = '';

    // Render user-added tasks
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
                <span>${task.text} (Added: ${task.dateAdded}, Due Date: ${task.dueDate} Completed: ${task.dateCompleted || 'Not completed'})</span>
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

    // Render admin-assigned tasks
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

    // // Render tasks
    // const renderTasks = () => {
    //     taskList.innerHTML = '';
    //     const tasks = loadTasks();
    //     tasks.forEach(task => {
    //         const taskItem = document.createElement('li');
    //         taskItem.classList.add('task-item');
    //         if (task.completed) {
    //             taskItem.classList.add('completed');
    //         }
    //         taskItem.dataset.id = task.id;
    //         taskItem.innerHTML = `
    //             <span>${task.text} (Added: ${task.dateAdded}, Due Date: ${task.dueDate} Completed: ${task.dateCompleted || 'Not completed'})</span>
    //             <div class="task-actions">
    //                 <input type="checkbox" ${task.completed ? 'checked' : ''} class="complete-task">
    //                 <button class="edit-task-btn">Edit</button>
    //                 <button class="delete-task-btn">Delete</button>
    //                 <input type="text" placeholder="Reason for not completing" class="incomplete-reason" value="${task.reason || ''}" ${task.completed ? 'disabled' : ''}>
    //             </div>
    //         `;
    //         taskList.appendChild(taskItem);
    //     });
    // };

    // Handle registration form submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('reg-fullname').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const contact = document.getElementById('reg-contact').value.trim();
        const type = document.getElementById('reg-type').value;
        const role = type === 'organization' ? document.getElementById('reg-role').value : 'regular';
        const approved = (type === 'organization' && role ==='regular') ? false : true;

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // Save user data in local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ fullName, email, password, contact, type, role,approved, id: Date.now() });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful! Proceed to login or wait for approval if you are an organization member');
        registrationForm.reset();
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Check user credentials
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user && (user.role === 'regular') && user.approved) {
            currentUserId = user.id;
            alert('Login successful');
            authButtons.style.display = 'none';
            loginForm.style.display = 'none';
            registrationForm.style.display = 'none';
            taskSection.style.display = 'block';
            renderTasks();
        }else if (user && (user.type === 'individual')) {
            currentUserId = user.id;
            alert('Login successful');
            authButtons.style.display = 'none';
            loginForm.style.display = 'none';
            registrationForm.style.display = 'none';
            taskSection.style.display = 'block';
            renderTasks();
        }else if (user && (user.role === 'admin')) {
            currentUserId = user.id;
            localStorage.setItem('loggedInUser', JSON.stringify('admin'));//auth feedback
            alert('Login successful');
            authButtons.style.display = 'none';
            loginForm.style.display = 'none';
            registrationForm.style.display = 'none';
            window.location.href = 'admin-dashboard.html';
        } else {
            alert('Invalid credentials or account not approved yet');
        }
    });

    // Handle type change for registration form
    regType.addEventListener('change', () => {
        if (regType.value === 'organization') {
            regRole.style.display = 'block';
        } else {
            regRole.style.display = 'none';
        }
    });

    // Show login form
    showLoginButton.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registrationForm.style.display = 'none';
        showLoginButton.style.display = 'none'; 
        showRegisterButton.style.display = 'block';
    });

    // Show registration form
    showRegisterButton.addEventListener('click', () => {
        registrationForm.style.display = 'block';
        loginForm.style.display = 'none';
        showRegisterButton.style.display = 'none';
        showLoginButton.style.display = 'block';
    });


    // Add new task
    addTaskBtn.addEventListener("click", () => {
      const taskText = taskInput.value.trim();
      if (taskText !== "") {
        const dueDate = dueDateInput.value;
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
      }
    });

    // Edit task
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-task-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            const newText = prompt('Edit your task:', taskItem.querySelector('span').textContent.split(' (')[0]);
            const newDueDate = prompt('Date: ', taskItem.querySelector('span').textContent.split(' (')[0]);//pane nyaya apa

            if (newText !== null) {
                const tasks = loadTasks();
                const task = tasks.find(t => t.id == taskId);
                task.text = newText;
                task.dueDate=newDueDate;//nepanapa
                saveTasks(tasks);
                renderTasks();
            }
        }
    });

    // Delete task
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-task-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            let tasks = loadTasks();
            tasks = tasks.filter(task => task.id != taskId);
            saveTasks(tasks);
            renderTasks();
        }
    });

    // Complete or incomplete task
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

    // Handle reason for incomplete tasks
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
});
