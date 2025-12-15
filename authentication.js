if (!localStorage.getItem("users")) {
  const users = [
    { username: "testuser", email: "test@test.com", password: "1234" }
  ];
  localStorage.setItem("users", JSON.stringify(users));
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const match = users.find(u =>
    u.username === username && u.email === email && u.password === password
  );

  const error = document.getElementById("error");

  if (match) {
    // mark “logged in”
    localStorage.setItem("currentUser", JSON.stringify({ username, email }));
    window.location.href = "index.html";
  } else {
    error.textContent = "Invalid details";
    error.style.display = "block";
  }
});