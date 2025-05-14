function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
  document.getElementById('username').value = profile.username || '';
  document.getElementById('monthlyBudget').value = profile.monthlyBudget || '';
  document.getElementById('theme').value = profile.theme || 'dark';

  // Optionally switch theme (basic logic)
  document.body.classList.toggle('bg-light', profile.theme === 'light');
  document.body.classList.toggle('text-dark', profile.theme === 'light');
}

function saveProfile(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value);
  const theme = document.getElementById('theme').value;

  const profile = {
    username,
    monthlyBudget: isNaN(monthlyBudget) ? null : monthlyBudget,
    theme
  };

  localStorage.setItem('userProfile', JSON.stringify(profile));
  showToast("Profile saved successfully!", "success");

  setTimeout(() => {
    location.reload(); // refresh to apply theme
  }, 500);
}

document.getElementById('profileForm').addEventListener('submit', saveProfile);
window.addEventListener('DOMContentLoaded', loadProfile);
