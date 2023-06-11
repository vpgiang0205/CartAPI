class Product {
    constructor(id, name, price, img, screen, blackCamera, frontCamera, desc, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.screen = screen;
        this.blackCamera = blackCamera;
        this.frontCamera = frontCamera;
        this.desc = desc;
        this.type = type;
    }
    // Các phương thức khác
    checkProductExist(cartArr, id) {
        return cartArr.filter((item) => item.product.id === id);
    }
}

export default Product;
