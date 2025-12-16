if (!localStorage.getItem("users")) {
  const users = [
    { username: "benson", email: "benson.carungay@education.nsw.gov.au", password: "Strawberry1!", admin: true },
    { username: "nicolas", email: "nicholas.brentam@education.nsw.gov.au", password: "Blueberry2!", admin: true },
    { username: "raffay", email: "raffay.haroon950@education.nsw.gov.au", password: "Blackberry3!", admin: true },
    { username: "testuser", email: "test@test.com", password: "1234", admin: false }
  ];
  localStorage.setItem("users", JSON.stringify(users));
}

//LOGIN LOGIC//
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const match = users.find(u =>
    u.username === username && u.email === email && u.password === password
  );

  const error = document.getElementById("error");

  if (match) {
    localStorage.setItem(
        "currentUser",
        JSON.stringify({
        username: match.username,
        email: match.email,
        admin: match.admin
        })
    );
    window.location.href = "index.html";
  }
});