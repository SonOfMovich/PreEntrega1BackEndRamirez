const fs = require('fs');

class Cart {
    constructor(fileName) {
        this.fileName = fileName;
        this.route = `./data/${fileName}.txt`
        this.encode = 'utf-8'
    }
    async createCart() {
        let cartsSTRING = await fs.promises.readFile(this.route, this.encode);
        let cartsPARSE = await JSON.parse(cartsSTRING)
        let cartId = cartsPARSE[cartsPARSE.length - 1].cartId + 1
        let newCart = {
            cartId: cartId,
            products: []
        }
        let newCarts = [...cartsPARSE, newCart]
        let sortCarts = newCarts.sort((a, b) => {
            return a.id - b.id 
         })
        let newCartsSTRING = JSON.stringify(sortCarts, this.encode)
        await fs.promises.writeFile(this.route, newCartsSTRING)
        return cartId
    }
    async addToCart(cartId, productId) {
        try {
            let productsSTRING = await fs.promises.readFile("./data/products.txt", this.encode);
            let productsPARSE = await JSON.parse(productsSTRING)
            let productFind = productsPARSE.find((product) => {
                return product.id == productId
            })
            let cartsSTRING = await fs.promises.readFile(this.route, this.encode);
            let cartsPARSE = await JSON.parse(cartsSTRING)
            let cartFind = cartsPARSE.find((cart) => {
                return cart.cartId == cartId
            })
            let cartsFilter = cartsPARSE.filter((cart) => {
                return cart.cartId != cartId
            })

            let newCarts = [
                ...cartsFilter,
                {
                    cartId: cartFind.cartId,
                    products: [...cartFind.products, { ...productFind }]
                }
            ]
            let sortCarts = newCarts.sort((a, b) => {
                return a.id - b.id 
             })
            await fs.promises.writeFile(this.route, JSON.stringify(newCarts))
            return sortCarts;
        } catch (error) { console.log(error); }
    }
    async getById(cartId) {
        try {
            let cartSTRING = await fs.promises.readFile(this.route, this.encode);
            let cartPARSE = await JSON.parse(cartSTRING)
            let cartFind = cartPARSE.find((cart) => {
                return cart.cartId == cartId
            });
                return cartFind.products;
        } catch (error) {
            console.log(error)
        }
    }
    async deleteCartById(cartId) {
        try {
            let cartSTRING = await fs.promises.readFile(this.route, this.encode);
            let cartPARSE = await JSON.parse(cartSTRING)
            let cartUpdate = await cartPARSE.filter(cart => {
                return cart.cartId != cartId
            })
            let sortCart = cartUpdate.sort((a, b) => {
                return a.id - b.id 
             })
            let cartUpdateSTRING = JSON.stringify(sortCart)
            await fs.promises.writeFile(this.route, cartUpdateSTRING)
            console.log(`Se eliminó correctamente el item con id: ${cartId}`)
            return sortCart;
        } catch (error) {
            console.log(error)
        }

    }
    async deleteFromCart(cartId, productId) {
        try {
            let cartsSTRING = await fs.promises.readFile(this.route, this.encode);
            let cartsPARSE = await JSON.parse(cartsSTRING)
            let cartFind = cartsPARSE.find((cart) => {
                return cart.cartId == cartId
            });
            let cartsFilter = cartsPARSE.filter((cart) => {
                return cart.cartId != cartId
            })
            let productsFilter = cartFind.products.filter(product => {
                return product.id != productId
            })
            let newCarts = [
                ...cartsFilter,
                {
                    cartId: cartFind.cartId,
                    products: [...productsFilter ]
                }
            ]
            
            await fs.promises.writeFile(this.route, JSON.stringify(newCarts))
            return newCarts
        } catch (error) {
            console.log(error)
        }
    }
}
const cart = new Cart('cart')
module.exports = cart