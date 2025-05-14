document.addEventListener('DOMContentLoaded', () => {
  renderCategoryChart();
  renderMonthlyChart();
});

function groupByCategory(expenses) {
  const result = {};
  expenses.forEach(e => {
    result[e.category] = (result[e.category] || 0) + parseFloat(e.amount);
  });
  return result;
}

function groupByMonth(expenses) {
  const result = {};
  expenses.forEach(e => {
    const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    result[month] = (result[month] || 0) + parseFloat(e.amount);
  });
  return result;
}

function renderCategoryChart() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const data = groupByCategory(expenses);

  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Total Spent by Category',
        data: Object.values(data),
        backgroundColor: generateColors(Object.keys(data).length),
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: { color: 'white' }
        }
      }
    }
  });
}

function renderMonthlyChart() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const data = groupByMonth(expenses);
  const sortedLabels = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));

  new Chart(document.getElementById('monthlyChart'), {
    type: 'bar',
    data: {
      labels: sortedLabels,
      datasets: [{
        label: 'Monthly Expenses',
        data: sortedLabels.map(label => data[label]),
        backgroundColor: '#0d6efd'
      }]
    },
    options: {
      scales: {
        x: { ticks: { color: 'white' } },
        y: { ticks: { color: 'white' } }
      },
      plugins: {
        legend: {
          labels: { color: 'white' }
        }
      }
    }
  });
}

function generateColors(count) {
  const colors = [
    '#0dcaf0', '#ffc107', '#dc3545', '#198754', '#6610f2',
    '#fd7e14', '#20c997', '#6f42c1', '#0d6efd', '#f8f9fa'
  ];
  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
}
