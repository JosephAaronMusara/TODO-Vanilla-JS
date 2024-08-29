export function rankMembers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tasks = JSON.parse(localStorage.getItem('userTasks')) || [];
    const createdTasks = JSON.parse(localStorage.getItem('createdTasks')) || []; 
    const rankedMembersTable = document.getElementById("ranked-members").querySelector("tbody");
    const memberRanks = users
      .filter(
        (user) =>
          user.approved &&
          user.role === "regular" &&
          user.type === "organization"
      )
      .map((user) => {
        const userTasks = tasks.filter((t) => t.userId === user.id);
        const completedTasks = userTasks.filter((t) => t.completed);
        const completedTasksCount = completedTasks.length;
        const numOfTasks = userTasks.length;//
        const completedOnTime = completedTasks.filter((t)=>{t.dueDate > t.dateCompleted});//
        const completedOnTimeCount = completedOnTime.length;//
        const completedAfterDueDate = completedTasks.filter(t=>t.dueDate < t.dateCompleted);
        const afterDueCount = completedAfterDueDate.length;
        const assignedTasksCount = createdTasks.filter((t) => String(t.assignedTo) ===String(user.id)).length;
        const taskCompletionPercentage = userTasks.length > 0 ? (completedTasksCount / numOfTasks) * 100 : 0;
        return { fullName: user.fullName, taskCompletionPercentage ,completedTasksCount,numOfTasks, completedOnTimeCount, assignedTasksCount, afterDueCount,completedTasks,completedOnTime,completedAfterDueDate};
      });

    memberRanks.sort(
      (a, b) => b.taskCompletionPercentage - a.taskCompletionPercentage
    );

    rankedMembersTable.innerHTML = "";

    memberRanks.forEach((member) => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = member.fullName;
      row.appendChild(nameCell);

      const totalTasksCell = document.createElement("td");
      totalTasksCell.textContent = member.numOfTasks;
      row.appendChild(totalTasksCell);

      const completedTasksCell = document.createElement("td");
      completedTasksCell.textContent = member.completedTasksCount;
      row.appendChild(completedTasksCell);

      const onTimeCell = document.createElement("td");
      onTimeCell.textContent = member.completedOnTimeCount;
      row.appendChild(onTimeCell);

      const afterDueCell = document.createElement("td");
      afterDueCell.textContent = member.afterDueCount;
      row.appendChild(afterDueCell);

      const assignedCountCell = document.createElement("td");
      assignedCountCell.textContent = member.assignedTasksCount;
      row.appendChild(assignedCountCell);

      const taskCompletionCell = document.createElement("td");
      taskCompletionCell.textContent = `${member.taskCompletionPercentage.toFixed(2)}%`;
      row.appendChild(taskCompletionCell);
//
      rankedMembersTable.appendChild(row);

      // const statsTasksTable = document.getElementById('statsTasksTable');
      // const rankCriteria = document.getElementById('stats-select');
      // rankCriteria.addEventListener('change',()=>{
      //   const rankCriteriaValue = rankCriteria.value;
        
      //   switch(rankCriteriaValue){
      //     case('rankMembers'):
      //     rankedMembersTable.parentElement.style.display = 'block';
      //     statsTasksTable.parentElement.style.display='none';
      //     break;
      //     case('completedTasks'):
      //     rankedMembersTable.parentElement.style.display = 'none';
      //     renderAllStatsTasks(member.completedTasks);
      //     statsTasksTable.parentElement.style.display='block';
      //     break;
      //     case('completedOnTime'):
      //     rankedMembersTable.parentElement.style.display = 'none';
      //     renderAllStatsTasks(member.completedOnTime);
      //     statsTasksTable.parentElement.style.display='block';
      //     break;
      //     case('completedAfterTime'):
      //     rankedMembersTable.parentElement.style.display = 'none';
      //     renderAllStatsTasks(member.completedAfterDueDate);
      //     statsTasksTable.parentElement.style.display='block';
      //     break;
      //   }
  
      // });

      // const renderAllStatsTasks = (userTasks) => {
      //   statsTasksTable.innerHTML = "";//will start debuging from here
      //   userTasks.forEach((task) => {
      //     const row = document.createElement("tr");
    
      //     const taskCell = document.createElement("td");
      //     taskCell.textContent = task.text;
      //     row.appendChild(taskCell);
    
      //     const taskForCell = document.createElement("td");
      //     const assignedUser = users.find((user) => {
      //       return String(user.id).trim() === String(task.userId).trim();
      //     });
    
      //     taskForCell.textContent = assignedUser ? assignedUser.fullName : "N/A";
      //     row.appendChild(taskForCell);
    
      //     const addedDateCell = document.createElement("td");
      //     addedDateCell.textContent = new Date(task.dateAdded).toLocaleString();
      //     row.appendChild(addedDateCell);
    
      //     const dueDateCell = document.createElement("td");
      //     dueDateCell.textContent = new Date(task.dueDate).toLocaleString();
      //     row.appendChild(dueDateCell);
    
      //     const isCompletedCell = document.createElement("td");
      //     isCompletedCell.textContent = task.completed
      //       ? "Completed"
      //       : "Not Completed";
      //     row.appendChild(isCompletedCell);
    
      //     const reasonCell = document.createElement("td");
      //     reasonCell.textContent = task.reason;
      //     row.appendChild(reasonCell);
    
      //     statsTasksTable.appendChild(row);
      //   });
      // };
    });
  }