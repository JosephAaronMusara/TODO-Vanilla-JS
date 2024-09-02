import * as tablePaginator from "../js/tablePagination.js"
export function renderUsers() {
  const usersKey = "users";
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const userManagementTable = document
    .getElementById("member-management")
    .querySelector("tbody");

  users
    .filter((user) => user.type === "organization" && user.role === "regular")
    .forEach((user) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = user.fullName;
      row.appendChild(nameCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = user.email;
      row.appendChild(emailCell);

      const isApprovedCell = document.createElement("td");
      isApprovedCell.textContent = user.approved ? "YES" : "NO";
      row.appendChild(isApprovedCell);

      const actionsCell = document.createElement("td");

      const approveBtn = document.createElement("button");
      approveBtn.textContent = user.approved ? "Deactivate" : "Activate";
      approveBtn.style.backgroundColor =
        approveBtn.textContent == "Deactivate" ? "orange" : "green";
      approveBtn.addEventListener("click", function () {
        if (!user.approved) {
          user.approved = true;
          localStorage.setItem(usersKey, JSON.stringify(users));
          approveBtn.textContent = "Deactivate";
          alert(`Account for ${user.fullName} successfully activated!`);
          userManagementTable.innerHTML='';
          tablePaginator.paginateTable('member-management', 5);
          renderUsers();
        } else {
          user.approved = false;
          localStorage.setItem(usersKey, JSON.stringify(users));
          approveBtn.textContent = "Activate";
          alert(`Account for ${user.fullName} successfully deactivated!`);
          userManagementTable.innerHTML='';
          renderUsers();
        }
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", function () {
        //Edit logic heeeeeeeeee
        alert("User editing will be implemented in the next update!");
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.style.backgroundColor = "red";
      deleteBtn.addEventListener("click", function () {
        const confirmed = confirm(
          `Are you sure you want to delete ${user.fullName}?`
        );
        if (confirmed) {
          const userIndex = users.findIndex((u) => u.id === user.id);
          users.splice(userIndex, 1);
          localStorage.setItem(usersKey, JSON.stringify(users));
          row.remove();
          alert("User deleted successfully.");
        }
      });
      actionsCell.appendChild(deleteBtn);
      actionsCell.appendChild(approveBtn);
      actionsCell.appendChild(editBtn);
      row.appendChild(actionsCell);

      userManagementTable.appendChild(row);
    });
}
