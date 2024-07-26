document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logout-btn');

    logoutBtn.addEventListener('click', function () {
        // Handle logout logic here
        window.location.href = 'index.html';
    });

    // Handle navigation
    const navLinks = document.querySelectorAll('#side-nav nav ul li a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSection = this.getAttribute('data-section');

            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // data for pending registrations, organizations, and members from rocal storage
    const usersKey = 'users';
    const tasksKey = 'tasks';
    const users = JSON.parse(localStorage.getItem(usersKey)) || [];
    const tasks = JSON.parse(localStorage.getItem(tasksKey)) || [];

    const pendingRegistrationsList = document.getElementById('pending-registrations');
    const memberProgressList = document.getElementById('member-progress');
    const deleteMembersList = document.getElementById('delete-members-list');
    const rankedMembersList = document.getElementById('ranked-members');
    const assignTaskForm = document.getElementById('assignTaskForm');

    // Populate pending registrations
    users.filter(user => user.type === 'organization' && !user.approved).forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = `${user.email}`;
        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Approve';
        approveBtn.addEventListener('click', function () {
            user.approved = true;
            localStorage.setItem(usersKey, JSON.stringify(users));
            listItem.remove();
        });
        listItem.appendChild(approveBtn);
        pendingRegistrationsList.appendChild(listItem);
    });

    // Populate member progress
    users.filter(user => user.approved).forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.email;
        listItem.addEventListener('click', function () {
            assignTaskForm.style.display = 'block';
            document.getElementById('assignTaskInput').setAttribute('data-email', user.fullname);
            renderUserTasks(user.email);
        });
        memberProgressList.appendChild(listItem);
    });

    // Populate delete members
    users.filter(user => user.type === 'organization' && user.role === 'regular').forEach(user => {
        const listItem = document.createElement('li');
        listItem.textContent = user.email;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            users.splice(users.indexOf(user), 1);
            localStorage.setItem(usersKey, JSON.stringify(users));
            listItem.remove();
        });
        listItem.appendChild(deleteBtn);
        deleteMembersList.appendChild(listItem);
    });

        // Handle assigning a task to a user
    assignTaskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskInput = document.getElementById('assignTaskInput');
        const email = taskInput.getAttribute('data-email');
        const task = taskInput.value;
    
        tasks.push({ task, addedBy: 'admin', assignedTo: email, dateAdded: new Date().toISOString(), completed: false, dateCompleted: null });
        localStorage.setItem(tasksKey, JSON.stringify(tasks));
        taskInput.value = '';
        renderUserTasks(email);
    });
    
        // Render tasks for a specific user
        function renderUserTasks(email) {
            const userTasks = tasks.filter(t => t.assignedTo === email);
            const taskList = document.createElement('ul');
            taskList.innerHTML = '';
            userTasks.forEach(task => {
                const listItem = document.createElement('li');
                listItem.textContent = `${task.task} - ${task.completed ? 'Completed' : 'Pending'}`;
                taskList.appendChild(listItem);
            });
            memberProgressList.appendChild(taskList);
        }
    
        // Populate ranked members based on completed tasks percentage
        function rankMembers() {
            const memberRanks = users.filter(user => user.approved).map(user => {
                const userTasks = tasks.filter(t => t.assignedTo === user.email);
                const completedTasks = userTasks.filter(t => t.completed).length;
                const taskCompletionPercentage = userTasks.length > 0 ? (completedTasks / userTasks.length) * 100 : 0;
                return { email: user.email, taskCompletionPercentage };
            });
    
            memberRanks.sort((a, b) => b.taskCompletionPercentage - a.taskCompletionPercentage);
            memberRanks.forEach(member => {
                const listItem = document.createElement('li');
                listItem.textContent = `${member.email} - ${member.taskCompletionPercentage.toFixed(2)}% completed tasks`;
                rankedMembersList.appendChild(listItem);
            });
        }
        rankMembers();
    
        // Populate delete members
        users.filter(user => user.type === 'organization' && user.role === 'regular').forEach(user => {
            const listItem = document.createElement('li');
            listItem.textContent = user.email;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function () {
                users.splice(users.indexOf(user), 1);
                localStorage.setItem(usersKey, JSON.stringify(users));
                listItem.remove();
            });
            listItem.appendChild(deleteBtn);
            deleteMembersList.appendChild(listItem);
        });

    //To be removed: Told not to use libraries
    // Dummy data for charts
    const tasksData = {
        labels: ['Completed', 'Pending', 'Overdue'],
        datasets: [{
            data: [10, 5, 3],
            backgroundColor: ['#28a745', '#ffc107', '#dc3545']
        }]
    };

    const membersData = {
        labels: ['Active', 'Inactive'],
        datasets: [{
            data: [8, 2],
            backgroundColor: ['#007bff', '#6c757d']
        }]
    };

    // Initialize charts
    const tasksChartCtx = document.getElementById('tasksChart').getContext('2d');
    new Chart(tasksChartCtx, {
        type: 'doughnut',
        data: tasksData
    });

    const membersChartCtx = document.getElementById('membersChart').getContext('2d');
    new Chart(membersChartCtx, {
        type: 'doughnut',
        data: membersData
    });
});
