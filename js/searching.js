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
}