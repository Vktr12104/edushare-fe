const API_BASE = "https://edushare.codebloop.my.id/api/v1/auth";
let token = "";
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; path=/; expires=${new Date(
    new Date().getTime() + 3600 * 1000
  ).toUTCString()};`;
}

async function register() {
  const username = document.getElementById("register-username").value.trim();
  const fullName = document.getElementById("register-fullname").value.trim();
  const password = document.getElementById("register-password").value.trim();
  const confirmPassword = document
    .getElementById("register-confirm-password")
    .value.trim();
  const feedback = document.getElementById("register-feedback");
  feedback.textContent = "";
  feedback.className = "";
  console.log("Attempting registration with data:", {
    username,
    fullName,
    password,
    confirmPassword,
  });
  if (!username || !fullName || !password || !confirmPassword) {
    feedback.textContent = "All fields are required!";
    feedback.className = "error";
    return;
  }
  if (password !== confirmPassword) {
    feedback.textContent = "Passwords do not match!";
    feedback.className = "error";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        full_name: fullName,
        password,
        confirm_password: confirmPassword,
      }),
    });

    if (res.ok) {
      console.log("Registration successful!");
      feedback.textContent = "Registration successful!";
      feedback.className = "success";
      document.getElementById("registerForm").reset();
    } else {
      const error = await res.json();
      console.error("Registration error:", error);
      feedback.textContent = error.message || "Failed to register.";
      feedback.className = "error";
    }
  } catch (err) {
    console.error("Unexpected error during registration:", err);
    feedback.textContent = "Error during registration. Please try again later.";
    feedback.className = "error";
  }
}

let accessToken = "";
let refreshToken = "";

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const feedback = document.getElementById("login-feedback");

  feedback.textContent = "";

  if (!username || !password) {
    feedback.textContent = "Username and password are required!";
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data1 = await res.json();

    if (res.ok) {
      accessToken = data1.data.access_token;
      refreshToken = data1.data.refresh_token;
      console.log(data1);
      setCookie("accessToken", accessToken, 0.01);
      setCookie("refreshToken", refreshToken, 7);
      alert("Login successful!");
      console.log("Redirecting to home page...");
      window.location.href = "frontend/index.html";
    } else {
      feedback.textContent = data1.message || "Login failed. Please try again.";
    }
  } catch (err) {
    console.error("Error during login:", err);
    feedback.textContent = "An error occurred during login. Please try again.";
  }
}

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

async function getProfile() {
  const feedback = document.getElementById("profile-feedback");
  try {
    const response = await fetch(`${API_BASE}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      feedback.textContent = "Profile loaded successfully!";
      feedback.className = "success";

      // Tampilkan data profil
      console.log("Profile Data:", data);
    } else {
      const error = await response.json();
      feedback.textContent = error.detail || "Failed to load profile.";
      feedback.className = "error";
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    feedback.textContent = "An error occurred while loading profile.";
    feedback.className = "error";
  }
}
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
