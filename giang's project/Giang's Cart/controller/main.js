import Api from '../services/api.js';
import Product from '../model/Product.js';
import CartItem from '../model/CartItem.js';
import Cart from '../model/Cart.js';
const api = new Api();
const cart = new Cart();
// GetEle:
const getEle = (id) => document.getElementById(id)


// RenderUI of the page
function renderUI(data) {
    let content = "";
    if (data && data.length > 0) {
        data.forEach((product) => {
            let truncatedDesc = product.desc.length > 100 ? product.desc.slice(0, 50) + "..." : product.desc;
            content +=
                `
                        <div class="col-lg-3 col-md-6 my-3">
                            <div class="card text-black h-100">
                            <div class="card__Overlay">
                                        <div class="card__OverlayHeader">
                                        ${product.name}
                                        </div>
                                        <div class="card__OverlayBody">
                                            <p>Screen: ${product.screen}</p>
                                            <p>Back Camera: ${product.blackCamera}</p>
                                            <p>Front Camera: ${product.frontCamera}</p>
                                            <br>
                                            <a href="">Click here for more details</a>
                                        </div>
                                        <div class = "card__OverlayFooter">
                                        <button type="button" class=""  onclick="btnAddToCart(${product.id})" >Add to Cart</button>
                                        </div>
                            </div>
                                <img src="${product.img}" class="" alt="${product.name}">
                                <div class="card-body">
                                <p>${product.type}</p>
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text">${truncatedDesc}</p>
                                <p class="card-text">Price: ${product.price}</p>
                                </div>
                            </div>
                        </div>
                            `;
        })
        getEle("customerProductList").innerHTML = content;
    }
}

// Render Product:
function renderProduct() {
    api.callApi("product", "GET", null)
        .then((rs) => {
            // run renderUI
            renderUI(rs.data)
        })
        .catch((error) => {
            console.log(error)
        })
};

// Cart (Riêng phần này chú thích vietsub cho teammate dễ hiểu)
let cartArr = [];
window.btnAddToCart = async (value) => {
    // Khi nhấn thêm, gọi API để lấy dữ liệu sản phẩm
    const phoneData = await api.callApi(`product/${value}`, 'GET', null);

    // Tạo các biến và gán giá trị từ dữ liệu lấy được
    const { id, name, price, screen, backCamera, frontCamera, img, desc, type } = phoneData.data;

    // Tạo đối tượng sản phẩm với các giá trị đã lấy được
    const product = new Product(id, name, price, img, screen, backCamera, frontCamera, desc, type);

    // Tạo đối tượng mới sẽ được thêm vào giỏ hàng với số lượng là 1
    const newCartItem = new CartItem(product, 1);

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    let cartItem = product.checkProductExist(cartArr, newCartItem.product.id);

    if (cartItem.length === 0) {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
        cartArr.push(newCartItem);
        console.log('Thêm sản phẩm vào giỏ hàng thành công!');
    } else {
        // Chạy vòng lặp check các sản phẩm 
        for (let i = 0; i < cartItem.length; i++) {
            const item = cartItem[i];
            // Nếu id của item (sản phẩm) trong giỏ hàng có cùng id sản phẩm mới thêm vào thì
            if (item.product.id === newCartItem.product.id) {
                // Tăng số lượng của item đã có +1
                item.quantity++;
                console.log('Số lượng sản phẩm đã được cập nhật!');
                console.log(item.quantity);
                break; // Thoát khỏi vòng lặp sau khi tìm thấy sản phẩm
            }
        }
    }

    setLocalStorage();
    renderCartItem(cartArr);
};

function renderCartItem(cartArr) {
    const cartItemsHTML = cartArr.map(cartItem => `
        <div class="cart-item">
            <div class="item-name">${cartItem.product.name}</div>
            <div class="item-quantity">${cartItem.quantity}</div>
            <div class="item-price">${cartItem.product.price}</div>
        </div>
    `).join("");

    getEle('cartContent').innerHTML = cartItemsHTML;
}

// Clear
window.clearLocalStorage = clearLocalStorage;
function clearLocalStorage() {
    localStorage.removeItem("cart");
    cartArr = [];
    renderCartItem(cartArr);
}

/** LocalStorage */
function setLocalStorage() {
    // Convert cartArr to string
    var dataString = JSON.stringify(cartArr);
    // Set localStorage
    localStorage.setItem("cart", dataString);
}

function getLocalStorage() {
    // Check condition
    if (localStorage.getItem("cart")) {
        var dataString = localStorage.getItem("cart");
        // Convert string to cartArr
        cartArr = JSON.parse(dataString);
        renderCartItem(cartArr);
    }
}

/** Run fuctions */
renderProduct()
getLocalStorage();