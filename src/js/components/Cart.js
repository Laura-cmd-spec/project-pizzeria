import {select, templates, settings, classNames} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element) {
    const thisCart = this;
    thisCart.products = [];

    thisCart.getElements(element);
    thisCart.initActions();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {
      toggleTrigger: element.querySelector(select.cart.toggleTrigger),
      productList: element.querySelector(select.cart.productList),
      deliveryFee: element.querySelector(select.cart.deliveryFee),
      subtotalPrice: element.querySelector(select.cart.subtotalPrice),
      totalPrice: element.querySelectorAll(select.cart.totalPrice),
      totalNumber: element.querySelector(select.cart.totalNumber),
      form: element.querySelector(select.cart.form),
      phone: element.querySelector(select.cart.phone),
      address: element.querySelector(select.cart.address),

    };
    thisCart.dom.wrapper = element;
  }
  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.orders;

    const payload = {
      address: thisCart.dom.address.address,
      phone: thisCart.dom.phone.phone,
      totalPrice: thisCart.dom.totalPrice,
      subtotalPrice: thisCart.totalPrice - settings.cart.defaultDeliveryFee,
      totalNumber: thisCart.totalNumber,
      deliveryFee: thisCart.defaultDeliveryFee,
      products: []
    };
    console.log(thisCart);

    for (let prod of thisCart.products) {
      payload.products.push(prod.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options);

  }

  initActions() {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function (event) {
      event.preventDefault();
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function (event) {
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct) {
    const thisCart = this;
    /* generate HTML Based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    /* create const with DOM element using utilis.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);


    /* add element to cart */
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    thisCart.update();
  }


  update() {
    const thisCart = this;

    const deliveryFee = settings.cart.defaultDeliveryFee;
    let totalNumber = 0; // liczba całościowa sztuk w koszyku
    let subtotalPrice = 0; //cena koszyka bez dostawy

    for (let product of thisCart.products) {

      totalNumber += product.amount;
      subtotalPrice += product.price;

    }
    console.log(thisCart.products);

    if (subtotalPrice != 0) {
      thisCart.totalPrice = subtotalPrice + deliveryFee;
    } else {
      thisCart.totalPrice = 0;
    }

    console.log('product amount: ', totalNumber,
      'price without delivery: ', subtotalPrice,
      'total cart price: ', thisCart.totalPrice);

    thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = totalNumber;
    for (let totalPrice of thisCart.dom.totalPrice) {
      totalPrice.innerHTML = thisCart.totalPrice;
    }

  }
  remove(instance) {
    const thisCart = this;
    const removeList = thisCart.products;
    const index = removeList.indexOf(instance);
    thisCart.products.splice(index, 1);

    thisCart.update();
  }
}
export default Cart;