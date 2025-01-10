let orderQuantity = 1;
const collections = [];
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
const menuId = getQueryParam("id");
if (menuId) {
  fetchCollection(menuId);
} else {
  document.getElementById(
    "order-container"
  ).innerHTML = `<p>Menu ID tidak ditemukan!</p>`;
}
async function fetchCollection(id) {
  try {
    const response = await fetch(
      `https://edushare-app.d9e3d2bmewhxadhh.southeastasia.azurecontainer.io:8083/api/v1/auth/collect/${id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const collection = await response.json();
    collections.push(collection);
    renderOrderPage(collection);
  } catch (error) {
    console.error("Failed to fetch collection:", error);
    document.getElementById(
      "order-container"
    ).innerHTML = `<p>Error loading collection. Please try again later.</p>`;
  }
}
function renderOrderPage(order) {
  const container = document.getElementById("order-container");
  container.innerHTML = `
          <div class="order-card">
              <div class="order-details">
                  <h3>${order.nama}</h3>
                  <p>Price: IDR ${order.harga}</p>
              </div>
              <div class="order-actions">
                  <button class="Tambah" onclick="updateQuantity(${order.id}, -1)">-</button>
                  <span id="quantity-${order.id}">${orderQuantity}</span>
                  <button class="Tambah" onclick="updateQuantity(${order.id}, 1)">+</button>
              </div>
          </div>
          <div class="total-price">
              <h3>Total: <span id="total-price">IDR ${order.harga}</span></h3>
          </div>
      `;
}
function updateQuantity(id, change) {
  console.log("Order ID:", id);
  console.log("Change:", change);

  const quantityElement = document.getElementById(`quantity-${id}`);
  if (!quantityElement) {
    console.error("Quantity element not found for ID:", id);
    return;
  }

  console.log("Quantity element exists:", quantityElement);

  orderQuantity = Math.max(1, orderQuantity + change);
  console.log("Updated quantity:", orderQuantity);
  quantityElement.textContent = orderQuantity;

  const totalPriceElement = document.getElementById("total-price");
  if (!totalPriceElement) {
    console.error("Total price element not found!");
    return;
  }
  const order = collections.find((item) => item.id === id);
  if (!order) {
    console.error("Order not found for ID:", id);
    return;
  }
  const totalPrice = order.harga * orderQuantity;
  console.log("Updated total price:", totalPrice);

  totalPriceElement.textContent = `IDR ${totalPrice}`;
}

async function createOrder() {
  const accessToken = getCookie("accessToken");
  const productName = document.getElementById("Kategori_Barang").value;
  if (!accessToken) {
    console.error("Access token tidak ditemukan!");
    return;
  }
  const orderData = {
    nama: productName,
    kuantitas: orderQuantity,
  };
  console.log(orderData);
  try {
    const response = await fetch(
      "https://edushare-app.d9e3d2bmewhxadhh.southeastasia.azurecontainer.io:8083/api/v1/auth/order",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Order berhasil dibuat:", data);
      alert(`Order berhasil dibuat!`);
      window.location.href = "index.html";
    } else {
      const errorData = await response.json();
      console.error("Gagal membuat order:", errorData);
      alert(
        `Gagal membuat order: ${errorData.detail || "Error tidak diketahui"}`
      );
    }
  } catch (error) {
    console.error("Terjadi kesalahan saat mengakses API:", error);
    alert("Terjadi kesalahan saat mengakses API.");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const predictButton = document.querySelector(".btn-predict");
  const form = document.querySelector(".form-predict");
  const hasilPrediksiElement = document.querySelector("#hasilPrediksi");
  if (predictButton && form) {
    predictButton.addEventListener("click", async function (event) {
      event.preventDefault();
      const formData = new FormData(form);
      const requestBody = {
        Kategori_Barang: formData.get("Kategori_Barang"),
        Harga_Barang: parseFloat(formData.get("Harga_Barang")),
        Diskon: parseFloat(formData.get("Diskon")),
        Jumlah_Pembelian: parseFloat(formData.get("Jumlah_Pembelian")),
        Durasi_Kepemilikan: parseFloat(formData.get("Durasi_Kepemilikan")),
        Jarak: parseFloat(formData.get("Jarak")),
      };
      if (
        isNaN(requestBody.Harga_Barang) ||
        isNaN(requestBody.Diskon) ||
        isNaN(requestBody.Jumlah_Pembelian) ||
        isNaN(requestBody.Durasi_Kepemilikan) ||
        isNaN(requestBody.Jarak)
      ) {
        hasilPrediksiElement.innerHTML = "Masukkan data numerik yang valid.";
        return;
      }

      try {
        const response = await fetch(
          "https://edushare-app.d9e3d2bmewhxadhh.southeastasia.azurecontainer.io:8083/api/v1/auth/order/Predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (response.ok) {
          const data = await response.json();
          hasilPrediksiElement.innerHTML = `${data.prediction}`;
        } else {
          const error = await response.json();
          hasilPrediksiElement.innerHTML = `Error: ${error.detail}`;
        }
      } catch (error) {
        console.error("Error calling API:", error);
        hasilPrediksiElement.innerHTML =
          "Terjadi kesalahan saat memanggil API.";
      }
    });
  }
});
