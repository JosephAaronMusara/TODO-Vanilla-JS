document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Check user credentials
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if(user && !user.approved){
            alert('Account not approved yet. Contact administrator');

        } else{

            if (user && (user.role === 'regular')) {
                currentUserId = user.id;
                alert('Login successful');
                localStorage.setItem('currentUserId', currentUserId);
                window.location.href = 'tasks.html';
            } else if (user && (user.type === 'individual')) {
                currentUserId = user.id;
                localStorage.setItem('currentUserId', currentUserId);
                alert('Login successful');
                window.location.href = 'tasks.html';
            } else if (user && (user.role === 'admin')) {
                currentUserId = user.id;
                localStorage.setItem('loggedInUser', JSON.stringify('admin'));
                alert('Login successful');
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid credentials');
            }
        }
    });
});
