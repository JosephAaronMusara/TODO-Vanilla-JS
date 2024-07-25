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

    // Dummy User ID, replace with actual user ID from backend after login
    let currentUserId = null;

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        return tasks.filter(task => task.userId === currentUserId);
    };

    // Save tasks to local storage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Render tasks
    const renderTasks = () => {
        taskList.innerHTML = '';
        const tasks = loadTasks();
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskItem.dataset.id = task.id;
            taskItem.innerHTML = `
                <span>${task.text} (Added: ${task.dateAdded}, Completed: ${task.dateCompleted || 'Not completed'})</span>
                <div class="task-actions">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="complete-task">
                    <button class="edit-task-btn">Edit</button>
                    <button class="delete-task-btn">Delete</button>
                    <input type="text" placeholder="Reason for not completing" class="incomplete-reason" value="${task.reason || ''}" ${task.completed ? 'disabled' : ''}>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    };

    // Handle registration form submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullName = document.getElementById('reg-fullname').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
        const contact = document.getElementById('reg-contact').value.trim();
        const type = document.getElementById('reg-type').value;
        const role = type === 'organization' ? document.getElementById('reg-role').value : 'regular';

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Save user data in local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ fullName, email, password, contact, type, role, id: Date.now() });
        localStorage.setItem('users', JSON.stringify(users));

        alert('Registration successful');
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

        if (user) {
            currentUserId = user.id;
            alert('Login successful');
            authButtons.style.display = 'none';
            loginForm.style.display = 'none';
            registrationForm.style.display = 'none';
            taskSection.style.display = 'block';
            renderTasks();
        } else {
            alert('Invalid credentials');
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
    });

    // Show registration form
    showRegisterButton.addEventListener('click', () => {
        registrationForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    // Add new task
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const tasks = loadTasks();
            const newTask = {
                id: Date.now(),
                text: taskText,
                dateAdded: new Date().toLocaleString(),
                dateCompleted: null,
                completed: false,
                reason: '',
                userId: currentUserId
            };
            tasks.push(newTask);
            saveTasks(tasks);
            renderTasks();
            taskInput.value = '';
        }
    });

    // Edit task
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-task-btn')) {
            const taskItem = e.target.closest('.task-item');
            const taskId = taskItem.dataset.id;
            const newText = prompt('Edit your task:', taskItem.querySelector('span').textContent.split(' (')[0]);
            if (newText !== null) {
                const tasks = loadTasks();
                const task = tasks.find(t => t.id == taskId);
                task.text = newText;
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
