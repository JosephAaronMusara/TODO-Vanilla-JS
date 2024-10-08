document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registration-form");
  const regRole = document.getElementById("reg-role");
  const regType = document.getElementById("reg-type");

  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const fullName = document.getElementById("reg-fullname").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value;
    const confirmPassword = document.getElementById(
      "reg-confirm-password"
    ).value;
    const contact = document.getElementById("reg-contact").value.trim();
    const type = document.getElementById("reg-type").value;
    const role =
      type === "organization"
        ? document.getElementById("reg-role").value
        : "regular";
    const approved =
      type === "organization" && role === "regular" ? false : true;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    existing_emails = [];
    users.forEach((user) => {
      existing_emails.push(user.email);
    });

    if (existing_emails.includes(email)) {
      alert(`User with email ${email} already exists`);
      em_field = document.getElementById("reg-email");
      registrationForm.reset(); //not sure if its necessary
      return;
    }

    users.push({
      fullName,
      email,
      password,
      contact,
      type,
      role,
      approved,
      id: Date.now(),
    });
    localStorage.setItem("users", JSON.stringify(users));
    alert(
      "Registration successful! Proceed to login or wait for approval if you are an organization member"
    );
    registrationForm.reset();
    window.location.href = "login.html";
  });

  regType.addEventListener("change", () => {
    if (regType.value === "organization") {
      regRole.style.display = "block";
    } else {
      regRole.style.display = "none";
    }
  });
});
