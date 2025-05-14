function loadCategories() {
  const categories = JSON.parse(localStorage.getItem('categories')) || ["Food", "Transport", "Shopping"];
  const categorySelect = document.getElementById('category');

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function addExpense() {
  const title = document.getElementById('title').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const notes = document.getElementById('notes').value.trim();

  const expense = {
    id: Date.now(),
    title,
    amount,
    category,
    date,
    notes
  };

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  showToast("Expense added successfully!", "success");
  document.getElementById('expenseForm').reset();
  document.getElementById('expenseForm').classList.remove("was-validated");
}

function showToast(message, type = "info") {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white bg-${type} border-0 show`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;
  toastContainer.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

window.addEventListener('DOMContentLoaded', loadCategories);
function loadExpenseList() {
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  renderExpenseTable(expenses);
  populateCategoryFilter();
}

function renderExpenseTable(expenses) {
  const tbody = document.getElementById('expensesTableBody');
  tbody.innerHTML = '';

  if (expenses.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No expenses found.</td></tr>`;
    return;
  }

  expenses.forEach(exp => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${exp.title}</td>
      <td>₹${exp.amount.toFixed(2)}</td>
      <td>${exp.category}</td>
      <td>${exp.date}</td>
      <td>${exp.notes || '-'}</td>
      <td>
        <a href="edit-expense.html?id=${exp.id}" class="btn btn-sm btn-warning me-2">✏️ Edit</a>
        <button class="btn btn-sm btn-danger" onclick="deleteExpense(${exp.id})">🗑️ Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteExpense(id) {
  if (!confirm("Delete this expense? You can't undo this.")) return;

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses = expenses.filter(e => e.id !== id);
  localStorage.setItem('expenses', JSON.stringify(expenses));
  showToast("Expense deleted 🗑️", "danger");
  loadExpenseList();
}

function populateCategoryFilter() {
  const select = document.getElementById('filterCategory');
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  select.innerHTML = `<option value="">📁 Filter by Category</option>`;
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function filterExpenses() {
  const search = document.getElementById('search').value.toLowerCase();
  const selectedCat = document.getElementById('filterCategory').value;
  const selectedMonth = document.getElementById('filterMonth').value;

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

  if (search) {
    expenses = expenses.filter(e => e.title.toLowerCase().includes(search));
  }

  if (selectedCat) {
    expenses = expenses.filter(e => e.category === selectedCat);
  }

  if (selectedMonth) {
    expenses = expenses.filter(e => e.date.startsWith(selectedMonth));
  }

  renderExpenseTable(expenses);
}

document.getElementById('search').addEventListener('input', filterExpenses);
document.getElementById('filterCategory').addEventListener('change', filterExpenses);
document.getElementById('filterMonth').addEventListener('change', filterExpenses);

window.addEventListener('DOMContentLoaded', loadExpenseList);
let editingExpenseId = null;

function loadEditExpense() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  editingExpenseId = id;

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const expense = expenses.find(e => e.id === id);

  if (!expense) {
    showToast("Expense not found!", "danger");
    setTimeout(() => window.location.href = 'view-expenses.html', 1500);
    return;
  }

  document.getElementById('title').value = expense.title;
  document.getElementById('amount').value = expense.amount;
  document.getElementById('date').value = expense.date;
  document.getElementById('notes').value = expense.notes || "";

  const categorySelect = document.getElementById('category');
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  categorySelect.innerHTML = "";

  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    if (cat === expense.category) opt.selected = true;
    categorySelect.appendChild(opt);
  });
}

function updateExpense() {
  const title = document.getElementById('title').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const notes = document.getElementById('notes').value.trim();

  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const index = expenses.findIndex(e => e.id === editingExpenseId);

  if (index === -1) {
    showToast("Expense not found!", "danger");
    return;
  }

  expenses[index] = {
    ...expenses[index],
    title,
    amount,
    category,
    date,
    notes,
  };

  localStorage.setItem('expenses', JSON.stringify(expenses));
  showToast("Expense updated successfully! ✅", "success");

  setTimeout(() => window.location.href = 'view-expenses.html', 1000);
}

window.addEventListener('DOMContentLoaded', loadEditExpense);
