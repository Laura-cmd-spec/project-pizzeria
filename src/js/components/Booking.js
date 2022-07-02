import { templates, select } from '../settings.js';
import AmountWidget from './AmountWidget.js';


class Booking{
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    
  }

  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    console.log(thisBooking.dom.wrapper);
    thisBooking.dom.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

  }

  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.peopleAmount.addEventListener('click', function () {
      console.log('zmiana liczby ludzi');
      thisBooking.resetTable();
    });

    thisBooking.dom.hoursAmount.addEventListener('click', function () {
      console.log('zmiana liczby godzin');
      thisBooking.resetTable();
    });
  
  }
}

export default Booking;