document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const tasksDiv = document.getElementById('tasks');
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    const authDiv = document.getElementById('auth');
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    const registrationTypeSelect = document.getElementById('registrationType');
    const organizationFields = document.getElementById('organizationFields');

    registrationTypeSelect.addEventListener('change', function () {
        if (registrationTypeSelect.value === 'organization') {
            organizationFields.style.display = 'block';
        } else {
            organizationFields.style.display = 'none';
        }
    });

    // Dummy authentication
    let isAuthenticated = false;

    loginBtn.addEventListener('click', function () {
        showLoginForm();
    });

    registerBtn.addEventListener('click', function () {
        showRegisterForm();
    });

    document.getElementById('registerForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // Handle registration logic here
        isAuthenticated = true;
        toggleAuthState();
    });

    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        // Handle login logic here
        isAuthenticated = true;
        toggleAuthState();
    });

    function showRegisterForm() {
        registrationForm.style.display = 'block';
        loginForm.style.display = 'none';
        authDiv.style.display = 'none';
    }

    function showLoginForm() {
        loginForm.style.display = 'block';
        registrationForm.style.display = 'none';
        authDiv.style.display = 'none';
    }

    function toggleAuthState() {
        if (isAuthenticated) {
            tasksDiv.style.display = 'block';
            registrationForm.style.display = 'none';
            loginForm.style.display = 'none';
        } else {
            tasksDiv.style.display = 'none';
            authDiv.style.display = 'block';
        }
    }

    addTaskBtn.addEventListener('click', function () {
        const taskText = newTaskInput.value.trim();
        if (taskText !== "") {
            const listItem = document.createElement('li');
            listItem.textContent = taskText;
            taskList.appendChild(listItem);
            newTaskInput.value = '';
        }
    });
});
