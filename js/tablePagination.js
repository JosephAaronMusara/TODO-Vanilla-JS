export function paginateTable(tableId, rowsPerPage) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const totalRows = rows.length;
    const pageCount = Math.ceil(totalRows / rowsPerPage);
    let currentPage = 1;

    function displayPage(page) {
      tbody.innerHTML = '';
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      rows.slice(start, end).forEach(row => tbody.appendChild(row));
      currentPage = page;
      updatePaginationControls();
    }

    function createPaginationControls() {
      const pagination = document.createElement('div');
      pagination.className = 'pagination';
      table.parentNode.appendChild(pagination);

      const prevBtn = document.createElement('button');
      prevBtn.textContent = 'Previous';
      prevBtn.onclick = () => {
        if (currentPage > 1) displayPage(currentPage - 1);
      };
      pagination.appendChild(prevBtn);

      for (let i = 1; i <= pageCount; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.onclick = () => displayPage(i);
        pagination.appendChild(pageBtn);
      }

      const nextBtn = document.createElement('button');
      nextBtn.textContent = 'Next';
      nextBtn.onclick = () => {
        if (currentPage < pageCount) displayPage(currentPage + 1);
      };
      pagination.appendChild(nextBtn);
    }

    function updatePaginationControls() {
      const buttons = table.parentNode.querySelectorAll('.pagination button');
      buttons.forEach(button => button.disabled = false);
      if (currentPage === 1) buttons[0].disabled = true;
      if (currentPage === pageCount) buttons[buttons.length - 1].disabled = true;
    }

    createPaginationControls();
    displayPage(currentPage);
  }