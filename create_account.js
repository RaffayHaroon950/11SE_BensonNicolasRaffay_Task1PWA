function showError(msg) {
  const el = document.getElementById("error");
  el.textContent = msg;
  el.style.display = "block";
}

function isStrongPassword(pw) {
  // at least 8 chars, 1 upper, 1 lower, 1 number, 1 symbol
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(pw);
}

document.getElementById("createForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  // Basic checks
  if (username.length < 3) return showError("Username must be at least 3 characters.");
  if (!email.includes("@") || !email.includes(".")) return showError("Please enter a valid email.");
  if (!isStrongPassword(password)) {
    return showError("Password must be 8+ chars with upper, lower, number, and symbol.");
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  // Check uniqueness
  if (users.some(u => u.username === username)) return showError("That username is already taken.");
  if (users.some(u => u.email === email)) return showError("That email is already registered.");

  // Save user (prototype only)
  users.push({ username, email, password, admin: false });
  localStorage.setItem("users", JSON.stringify(users));

  // Send to log in page
  window.location.href = "login_page.html";
});