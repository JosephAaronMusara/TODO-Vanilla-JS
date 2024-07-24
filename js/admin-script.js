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

    // Dummy data for pending registrations, organizations, and members
    const pendingRegistrations = [
        { id: 1, name: 'Uncle Joe', email: 'uncle@asap.com' },
        { id: 2, name: 'Joe Aaron', email: 'jose@aaron.com' }
    ];

    const memberProgress = [
        { id: 1, name: 'Uncle Joe', progress: '75%' },
        { id: 2, name: 'Joe Aaron', progress: '50%' }
    ];

    const members = [
        { id: 1, name: 'Uncle Joe' },
        { id: 2, name: 'Joe Aaron' }
    ];

    const pendingRegistrationsList = document.getElementById('pending-registrations');
    const memberProgressList = document.getElementById('member-progress');
    const deleteMembersList = document.getElementById('delete-members-list');

    // Populate pending registrations
    pendingRegistrations.forEach(registration => {
        const listItem = document.createElement('li');
        listItem.textContent = `${registration.name} (${registration.email})`;
        const approveBtn = document.createElement('button');
        approveBtn.textContent = 'Approve';
        approveBtn.addEventListener('click', function () {
            // Handle approval logic here
            listItem.remove();
        });
        listItem.appendChild(approveBtn);
        pendingRegistrationsList.appendChild(listItem);
    });

    // Populate member progress
    memberProgress.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = `${member.name} - Progress: ${member.progress}`;
        memberProgressList.appendChild(listItem);
    });

    // Populate delete members
    members.forEach(member => {
        const listItem = document.createElement('li');
        listItem.textContent = member.name;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function () {
            // Handle delete logic here
            listItem.remove();
        });
        listItem.appendChild(deleteBtn);
        deleteMembersList.appendChild(listItem);
    });

    // Handle adding a new organization
    document.getElementById('addOrganizationForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const newOrganizationName = document.getElementById('newOrganization').value.trim();
        if (newOrganizationName) {
            // Handle adding organization logic here
            alert(`Organization "${newOrganizationName}" added!`);
            document.getElementById('newOrganization').value = '';
        }
    });

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
