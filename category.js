let editIndex = null;

function loadCategories() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  const list = document.getElementById('categoryList');
  list.innerHTML = '';

  if (categories.length === 0) {
    list.innerHTML = `<li class="list-group-item bg-secondary text-light">No categories found.</li>`;
    return;
  }

  categories.forEach((cat, i) => {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center bg-secondary text-light";
    li.innerHTML = `
      <span>${cat}</span>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="startEditCategory(${i})">✏️ Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteCategory(${i})">🗑️ Delete</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function addCategory(e) {
  e.preventDefault();
  const input = document.getElementById('categoryInput');
  let name = input.value.trim();

  if (!name) return showToast("Category name can't be empty", "danger");

  let categories = JSON.parse(localStorage.getItem('categories')) || [];

  // For update
  if (editIndex !== null) {
    categories[editIndex] = name;
    localStorage.setItem('categories', JSON.stringify(categories));
    showToast("Category updated ✅", "success");
    editIndex = null;
    toggleButtons(false);
  } else {
    if (categories.includes(name)) {
      showToast("Category already exists!", "warning");
      return;
    }
    categories.push(name);
    localStorage.setItem('categories', JSON.stringify(categories));
    showToast("Category added ✅", "success");
  }

  input.value = '';
  loadCategories();
}

function startEditCategory(index) {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  document.getElementById('categoryInput').value = categories[index];
  editIndex = index;
  toggleButtons(true);
}

function deleteCategory(index) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  let categories = JSON.parse(localStorage.getItem('categories')) || [];
  const removed = categories.splice(index, 1);
  localStorage.setItem('categories', JSON.stringify(categories));
  showToast(`Deleted "${removed}" 🗑️`, "danger");
  loadCategories();
}

function toggleButtons(isEditing) {
  document.getElementById('updateBtn').classList.toggle('d-none', !isEditing);
}

document.getElementById('categoryForm').addEventListener('submit', addCategory);
document.getElementById('updateBtn').addEventListener('click', addCategory);

window.addEventListener('DOMContentLoaded', loadCategories);
