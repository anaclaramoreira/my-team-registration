document.getElementById("teamForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const role = document.getElementById("role").value.trim();
  const errorMessage = document.getElementById("error-message");

  if (!name || !email || !role) {
    errorMessage.textContent = "All fields are required!";
  } else {
    errorMessage.textContent = "";
    alert("Registration successful!");
    this.reset();
  }
});

