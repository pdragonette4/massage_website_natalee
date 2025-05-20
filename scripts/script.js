// add classes for mobile navigation toggling
var CSbody = document.querySelector("body");
const CSnavbarMenu = document.querySelector("#cs-navigation");
const CShamburgerMenu = document.querySelector("#cs-navigation .cs-toggle");

CShamburgerMenu.addEventListener('click', function() {
    CShamburgerMenu.classList.toggle("cs-active");
    CSnavbarMenu.classList.toggle("cs-active");
    CSbody.classList.toggle("cs-open");
    // run the function to check the aria-expanded value
    ariaExpanded();
});

// checks the value of aria expanded on the cs-ul and changes it accordingly whether it is expanded or not
function ariaExpanded() {
    const csUL = document.querySelector('#cs-expanded');
    const csExpanded = csUL.getAttribute('aria-expanded');

    if (csExpanded === 'false') {
        csUL.setAttribute('aria-expanded', 'true');
    } else {
        csUL.setAttribute('aria-expanded', 'false');
    }
}

// This script adds a class to the body after scrolling 100px
// and we used these body.scroll styles to create some on scroll 
// animations with the navbar

document.addEventListener('scroll', (e) => { 
    const scroll = document.documentElement.scrollTop;
    if(scroll >= 100){
document.querySelector('body').classList.add('scroll')
    } else {
    document.querySelector('body').classList.remove('scroll')
    }
});


// mobile nav toggle code
const dropDownTriggers = document.querySelectorAll('#cs-navigation .cs-dropdown > .cs-li-link');
dropDownTriggers.forEach(trigger => {
    const parentItem = trigger.parentElement; // <li> element

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        parentItem.classList.toggle('cs-active');
        const isExpanded = parentItem.classList.contains('cs-active');
        trigger.setAttribute('aria-expanded', isExpanded);
    });

    trigger.addEventListener('focus', () => {
        dropDownTriggers.forEach(otherTrigger => {
            const otherParent = otherTrigger.parentElement;
            if (otherTrigger !== trigger && otherParent.classList.contains('cs-active')) {
                otherParent.classList.remove('cs-active');
                otherTrigger.setAttribute('aria-expanded', false);
            }
        });
        parentItem.classList.add('cs-active');
        trigger.setAttribute('aria-expanded', true);
    });

    trigger.addEventListener('blur', () => {
        setTimeout(() => {
            const activeElement = document.activeElement;
            if (!parentItem.contains(activeElement)) {
                parentItem.classList.remove('cs-active');
                trigger.setAttribute('aria-expanded', false);
            }
        }, 0);
    });
});

// Keep hover effect on dropdown trigger when keyboard-browsing dropdown items
const dropLinks = document.querySelectorAll('#cs-navigation .cs-drop-link');
dropLinks.forEach(link => {
    link.addEventListener('focus', () => {
        const parentDropdown = link.closest('.cs-dropdown');
        if (parentDropdown) parentDropdown.classList.add('keyboard-focus');
    });
    link.addEventListener('blur', () => {
        const parentDropdown = link.closest('.cs-dropdown');
        if (parentDropdown) parentDropdown.classList.remove('keyboard-focus');
    });
});


// JS FOR BOOKING SECTION
// Enhanced with accessibility features

document.addEventListener('DOMContentLoaded', function() {
    const state = {
        selectedDate: null,
        selectedTime: null,
        selectedService: null,
        selectedDuration: null,
        basePrice: 0,
        priceFactor: 0,
        totalPrice: 0
    }

    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const currentMonthElem = document.getElementById('current-month');
    const calendarDaysElem = document.getElementById('calendar-days');
    const timeSlotsElem = document.getElementById('time-slots');
    const timeSlotsDateElem = document.getElementById('time-slots-date');
    const serviceOptions = document.querySelectorAll('.cs-service-option');
    const durationOptions = document.querySelectorAll('.cs-duration-option');
    const totalPriceElem = document.getElementById('total-price');
    const bookButton = document.getElementById('book-button');

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    renderCalendar();

    // Navigation event listeners
    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    // Keyboard accessibility for month navigation
    prevMonthBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            prevMonthBtn.click();
        }
    });

    nextMonthBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            nextMonthBtn.click();
        }
    });

    // Service selection with accessibility
    serviceOptions.forEach(option => {
        // Mouse click event
        option.addEventListener('click', () => {
            selectService(option);
        });

        // Keyboard accessibility
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectService(option);
            }
        });

        // Focus handling
        option.addEventListener('focus', () => {
            option.classList.add('cs-focus');
        });

        option.addEventListener('blur', () => {
            option.classList.remove('cs-focus');
        });
    });

    function selectService(option) {
        // Reset any previously selected service
        serviceOptions.forEach(opt => {
            opt.classList.remove('active');
            opt.setAttribute('aria-pressed', 'false');
        });
        
        // Mark the new selection
        option.classList.add('active');
        option.setAttribute('aria-pressed', 'true');
        
        // Update state
        const serviceName = option.dataset.service;
        const basePrice = parseFloat(option.dataset.basePrice);
        state.selectedService = serviceName;
        state.basePrice = basePrice;
        
        // Update the price
        updateTotalPrice();
        
        // Check if booking button should be enabled
        checkBookingAvailable();
    }

    // Duration selection with accessibility 
    durationOptions.forEach(option => {
        // Mouse click event
        option.addEventListener('click', () => {
            selectDuration(option);
        });

        // Keyboard accessibility
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectDuration(option);
            }
        });

        // Focus handling
        option.addEventListener('focus', () => {
            option.classList.add('cs-focus');
        });

        option.addEventListener('blur', () => {
            option.classList.remove('cs-focus');
        });
    });

    function selectDuration(option) {
        // Reset any previously selected duration
        durationOptions.forEach(opt => {
            opt.classList.remove('active');
            opt.setAttribute('aria-pressed', 'false');
        });
        
        // Mark the new selection
        option.classList.add('active');
        option.setAttribute('aria-pressed', 'true');
        
        // Update state
        const duration = parseInt(option.dataset.duration);
        const priceFactor = parseFloat(option.dataset.priceFactor);
        state.selectedDuration = duration;
        state.priceFactor = priceFactor;
        
        // Update the price
        updateTotalPrice();
        
        // Check if booking button should be enabled
        checkBookingAvailable();
    }
    
    function renderCalendar() {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        // First day of the week starts on Monday in Australia
        const startDay = (firstDay.getDay() + 6) % 7;
        const daysInMonth = lastDay.getDate();

        // Update month and year display
        currentMonthElem.textContent = `${getMonthName(currentMonth)} ${currentYear}`;

        // Clear previous calendar days
        calendarDaysElem.innerHTML = '';

        // Fill the first week with previous month dates 
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('cs-calendar-day', 'cs-disabled', 'cs-other-month');
            dayElem.textContent = prevMonthLastDay - i;
            dayElem.setAttribute('aria-hidden', 'true');
            calendarDaysElem.appendChild(dayElem);
        }

        const today = new Date();
        const todayDate = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('cs-calendar-day');
            dayElem.textContent = i;
            
            const dateToCheck = new Date(currentYear, currentMonth, i);
            const formattedDate = formatDisplayDate(dateToCheck);

            if (i === todayDate && currentMonth === todayMonth && currentYear === todayYear) {
                dayElem.classList.add('cs-today');
                dayElem.setAttribute('aria-label', `Today, ${formattedDate}`);
            } else {
                dayElem.setAttribute('aria-label', formattedDate);
            }

            if (dateToCheck < new Date(todayYear, todayMonth, todayDate)) {
                dayElem.classList.add('cs-disabled');
                dayElem.setAttribute('aria-disabled', 'true');
            } else {
                // Make selectable days focusable
                dayElem.setAttribute('tabindex', '0');
                dayElem.setAttribute('role', 'button');

                // Click handler
                dayElem.addEventListener('click', () => {
                    selectDay(dayElem, i);
                });

                // Keyboard handler
                dayElem.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectDay(dayElem, i);
                    }
                });
            }
            calendarDaysElem.appendChild(dayElem);
        }

        const totalDaysShown = startDay + daysInMonth;
        const remainingDays = 42 - totalDaysShown;
        for (let i = 1; i <= remainingDays; i++) {
            const dayElem = document.createElement('div');
            dayElem.classList.add('cs-calendar-day', 'cs-disabled', 'cs-other-month');
            dayElem.textContent = i;
            dayElem.setAttribute('aria-hidden', 'true');
            calendarDaysElem.appendChild(dayElem);
        }
    }
    
    function selectDay(dayElem, day) {
        // Remove selected class from all days
        document.querySelectorAll('.cs-calendar-day').forEach(day => {
            day.classList.remove('cs-selected');
            day.setAttribute('aria-selected', 'false');
        });
        
        // Add selected class to clicked day
        dayElem.classList.add('cs-selected');
        dayElem.setAttribute('aria-selected', 'true');
        
        state.selectedDate = new Date(currentYear, currentMonth, day);
        updateTimeSlots(state.selectedDate);
        checkBookingAvailable();
    }
//  helper to calciulate final price
    function updateTotalPrice() {
    if (state.basePrice > 0 && state.priceFactor > 0) {
        state.totalPrice = Math.round(state.basePrice * state.priceFactor);
        totalPriceElem.textContent = `$${state.totalPrice}`;
    } else {
        state.totalPrice = 0;
        totalPriceElem.textContent = '$0';
    }
    }

    // Function to update time slots with accessibility improvements
    function updateTimeSlots(date) {
        const formattedDate = formatDisplayDate(date);
        timeSlotsDateElem.innerHTML = `Available Times for <span>${formattedDate}</span>`;
        timeSlotsElem.innerHTML = '';
        
        const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
        
        // Simulate randomly booked sessions
        const bookedSlots = [];
        for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * timeSlots.length);
            if (!bookedSlots.includes(randomIndex)) {
                bookedSlots.push(randomIndex);
            }
        }
        
        timeSlots.forEach((time, index) => {
            const timeSlotElem = document.createElement('div');
            timeSlotElem.classList.add('cs-time-slot');
            timeSlotElem.textContent = time;
            timeSlotElem.setAttribute('role', 'button');
            
            if (bookedSlots.includes(index)) {
                timeSlotElem.classList.add('cs-disabled');
                timeSlotElem.setAttribute('aria-disabled', 'true');
                timeSlotElem.setAttribute('aria-label', `${time}, not available`);
            } else {
                timeSlotElem.setAttribute('tabindex', '0');
                timeSlotElem.setAttribute('aria-pressed', 'false');
                
                // Click handler
                timeSlotElem.addEventListener('click', () => {
                    selectTimeSlot(timeSlotElem, time);
                });
                
                // Keyboard handler
                timeSlotElem.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectTimeSlot(timeSlotElem, time);
                    }
                });
                
                // Focus handling
                timeSlotElem.addEventListener('focus', () => {
                    timeSlotElem.classList.add('cs-focus');
                });
                
                timeSlotElem.addEventListener('blur', () => {
                    timeSlotElem.classList.remove('cs-focus');
                });
            }
            
            timeSlotsElem.appendChild(timeSlotElem);
        });
    }
    
    function selectTimeSlot(timeSlotElem, time) {
        // Remove active class from all time slots
        document.querySelectorAll('.cs-time-slot').forEach(slot => {
            slot.classList.remove('active');
            slot.setAttribute('aria-pressed', 'false');
        });
        
        // Add active class to clicked time slot
        timeSlotElem.classList.add('active');
        timeSlotElem.setAttribute('aria-pressed', 'true');
        
        // Update state
        state.selectedTime = time;
        
        checkBookingAvailable();
    }

    // Function to check if booking button should be enabled
    function checkBookingAvailable() {
        if (state.selectedDate && state.selectedTime && state.selectedService && state.selectedDuration && state.totalPrice > 0) {
            bookButton.disabled = false;
            // Add accessible confirmation message
            bookButton.setAttribute('aria-label', `Book Appointment for ${formatDisplayDate(state.selectedDate)} at ${state.selectedTime}, ${state.selectedService} for ${state.selectedDuration} minutes, total price $${state.totalPrice}`);
        } else {
            bookButton.disabled = true;
            bookButton.setAttribute('aria-label', 'Book Appointment - Please complete all selections');
        }
    }

    // Format a date for display
    function formatDisplayDate(date) {
        if (!date) return 'Select a date';

        const day = date.getDate();
        const month = getMonthName(date.getMonth());
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    // Get the name of a month by index
    function getMonthName(month) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month];
    }
    
    // Initialises event listener for the book button
    bookButton.addEventListener('click', () => {
        alert('Booking confirmed! Thank you for your reservation.');
    });
    
    // Add keyboard accessibility for the book button
    bookButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!bookButton.disabled) {
                bookButton.click();
            }
        }
    });
});

// JS for click Book Now to scroll down smoothly
const scrollLinks = document.querySelectorAll('.jump-to-booking');

scrollLinks.forEach(link => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Stop default jump
    document.getElementById('cs-booking').scrollIntoView({
      behavior: 'smooth'
    });
  });
});