export   function filterTable(searchInputId, tableId) {
    const searchInput = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.toLowerCase();
        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const rowText = cells.map(cell => cell.textContent.toLowerCase()).join(' ');
            if (rowText.includes(searchValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
    const searchassignedtasks = document.getElementById('search-assign-tasks');
    const searchtaskList = document.getElementById('search-taskListTable');
    const searchuserTasks = document.getElementById('search-userTasks');
    searchassignedtasks.style.display = 'block';
  
    document.getElementById('assignedTasksBtnTab').addEventListener('click',()=>{
      searchassignedtasks.style.display = 'block';
      searchtaskList.style.display = 'none';
      searchuserTasks.style.display = 'none';
    });
    document.getElementById('createdTasksBtnTab').addEventListener('click',()=>{
      searchassignedtasks.style.display = 'none';
      searchtaskList.style.display = 'block';
      searchuserTasks.style.display = 'none';
    });
    document.getElementById('userTasksBtnTab').addEventListener('click',()=>{
      searchassignedtasks.style.display = 'none';
      searchtaskList.style.display = 'none';
      searchuserTasks.style.display = 'block';
    });
}