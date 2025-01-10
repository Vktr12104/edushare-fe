async function fetchMenu() {
  try {
    const response = await fetch(
      "https://edushare-app.d9e3d2bmewhxadhh.southeastasia.azurecontainer.io:8083/api/v1/auth/collect"
    );
    const menus = await response.json();

    const menuContainer = document.getElementById("menu-container");

    menus.forEach((menu) => {
      const finalPrice = menu.harga - (menu.harga * menu.diskon) / 100;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
                <div>
                    <h3>${menu.nama}</h3>
                    <p>Kategori: ${menu.kategori}</p>
                </div>
                <div class="card-footer">
                    <p>Harga: <strong>IDR ${finalPrice.toFixed(2)}</strong></p>
                    <p>Diskon: ${menu.diskon}%</p>
                    <p>Durasi: ${menu.durasi} Bulan</p>
                    <p>Jarak: ${menu.jarak} km</p>
                </div>
                <div class="button-container">
                    <button class="button details-btn">Details</button>
                    <button class="button order-btn" data-id="${
                      menu.id
                    }">Order</button>
                </div>
            `;

      // Tambahkan event listener untuk tombol "Order"
      const orderBtn = card.querySelector(".order-btn");
      orderBtn.addEventListener("click", () => {
        // Redirect ke halaman order dengan parameter ID
        window.location.href = `home.html?id=${menu.id}`;
      });

      menuContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
  }
}
fetchMenu();
