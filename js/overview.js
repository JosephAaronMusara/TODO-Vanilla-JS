export function overView() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const createdTasks = JSON.parse(localStorage.getItem("createdTasks")) || [];

  const totalTasks = createdTasks.length;
  const completedTasks = createdTasks.filter((task) => task.completed).length;
  const overdueTasks = createdTasks.filter(
    (task) => new Date(task.dueDate) < new Date() && !task.completed
  ).length;
  const pendingTasks = totalTasks - completedTasks - overdueTasks;

  const tasksData = {
    labels: ["Completed", "Pending", "Overdue"],
    datasets: [
      {
        data: [completedTasks, pendingTasks, overdueTasks],
        backgroundColor: ["#28a745", "#ffc107", "#dc3545"],
      },
    ],
  };

  const activeMembers = users.filter(
    (user) =>
      user.approved && user.type === "organization" && user.role === "regular"
  ).length;
  const inactiveMembers = users.length - activeMembers;

  const membersData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [activeMembers, inactiveMembers],
        backgroundColor: ["#007bff", "#6c757d"],
      },
    ],
  };

  const tasksChartCtx = document.getElementById("tasksChart").getContext("2d");
  new Chart(tasksChartCtx, {
    type: "doughnut",
    data: tasksData,
  });

  const membersChartCtx = document
    .getElementById("membersChart")
    .getContext("2d");
  new Chart(membersChartCtx, {
    type: "doughnut",
    data: membersData,
  });
}
