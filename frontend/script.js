function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
async function logout() {
  const refreshToken = getCookie("refreshToken");
  if (!refreshToken) {
    console.error("Refresh token tidak ditemukan!");
    return;
  }
  try {
    const response = await fetch(
      "https://edushare.codebloop.my.id/api/v1/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }
    );

    if (response.ok) {
      if (response.status === 204) {
        console.log("Logout berhasil");
        document.cookie =
          "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.cookie =
          "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        alert("Anda telah berhasil logout!");
        window.location.href = "../index.html";
      }
    } else {
      const errorData = await response.json();
      console.error("Gagal logout:", errorData);
      alert("Gagal logout, coba lagi.");
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat logout:", error);
    alert("Terjadi kesalahan saat logout.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("logout-button")
    .addEventListener("click", function (event) {
      event.preventDefault();
      logout();
    });
});
