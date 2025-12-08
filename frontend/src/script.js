setTimeout(() => {
    // Start from Section 1
    document.addEventListener("DOMContentLoaded", () => {
        if (window.innerWidth <= 655) {
            document.querySelector(".section1").scrollIntoView({ behavior: "smooth" });
        }
    })


    // Review Card Slide
    document.addEventListener("DOMContentLoaded", function () {
        const cards = document.querySelectorAll(".good-cards .col");
        let index = 0;

        function showCard(i) {
            cards.forEach((card, idx) => {
                card.classList.toggle("active", idx === i);
            });
        }

        function autoSlide() {
            index = (index + 1) % cards.length;
            showCard(index);
        }

        // Mobile only
        if (window.innerWidth < 768) {
            showCard(index);              // show first card
            setInterval(autoSlide, 3000); // change every 3s
        } else {
            // On desktop, keep all visible
            cards.forEach(card => card.classList.add("active"));
        }
    });


    // Switch Active Class 
    const tabs = document.querySelectorAll('.tab');
    const flights = document.getElementById('flightForm');
    const hotels = document.getElementById('hotelForm');
    const cars = document.getElementById('carForm');
    const cruises = document.getElementById('cruiseForm');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // remove active from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // hide all forms
            flights.style.display = 'none';
            hotels.style.display = 'none';
            cars.style.display = 'none';
            cruises.style.display = 'none';

            // show the correct form based on tab text
            if (tab.textContent === 'Flights') flights.style.display = 'block';
            if (tab.textContent === 'Hotels') hotels.style.display = 'block';
            if (tab.textContent === 'Cars') cars.style.display = 'block';
            if (tab.textContent === 'Cruise') cruises.style.display = 'block';
        });
    });


    // Current Date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // months start from 0
    const dd = String(today.getDate()).padStart(2, '0');
    const currentDateValue = `${yyyy}-${mm}-${dd}`;

    document.querySelectorAll('.currentDate').forEach(input => {
        input.value = currentDateValue;
    });

    // Current Time 
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mmm = String(now.getMinutes()).padStart(2, '0');
    const currentTimeValue = `${hh}:${mmm}`;
    document.querySelectorAll('.currentTime').forEach(input => {
        input.value = currentTimeValue;
    });

    // Next Day Date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy2 = tomorrow.getFullYear();
    const mm2 = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd2 = String(tomorrow.getDate()).padStart(2, '0');
    const nextDateValue = `${yyyy2}-${mm2}-${dd2}`;

    document.querySelectorAll('.nextDate').forEach(input => {
        input.value = nextDateValue;
    });


    const hamMenu = document.querySelector('.ham-menu');
    const details = document.querySelector('.header-details');
    const allDeals = document.getElementById("all-deals");

    hamMenu.addEventListener("click", () => {
        hamMenu.classList.toggle('active');
        details.classList.toggle('active');
        allDeals.style.display = "none";  // hide
    });

    // Deals
    document.getElementById("deals").addEventListener("click", function (e) {
        e.preventDefault();

        const currentDisplay = window.getComputedStyle(allDeals).display;


        if (currentDisplay === "none") {
            allDeals.style.display = "grid";  // show
        } else {
            allDeals.style.display = "none";  // hide
        }
    });



    document.addEventListener('DOMContentLoaded', function () {
        flatpickr('#daterange', {
            mode: 'range',
            dateFormat: 'd-m-Y',
            // optional:
            // defaultDate: ['09-02-2025', '14-02-2025'],
            // allowInput: true,
        });
    });

    // Flights Form

    // form-options active 
    const options = document.querySelectorAll(".form-options li");

    options.forEach(option => {
        option.addEventListener("click", () => {
            // remove active from all
            options.forEach(o => o.classList.remove("active"));
            // add active to clicked one
            option.classList.add("active");
        });
    });

    // adult child 
    // Toggle passenger selector
    function togglePassengerSelector() {
        const content = document.getElementById('passengerContent');
        content.classList.toggle('active');
    }

    // Set up counters
    function setupCounter(decBtnId, incBtnId, countId, min = 0, max = 9) {
        const decBtn = document.getElementById(decBtnId);
        const incBtn = document.getElementById(incBtnId);
        const countElem = document.getElementById(countId);

        let count = parseInt(countElem.textContent);

        function updateCount(value) {
            count = value;
            countElem.textContent = count;
            decBtn.disabled = count <= min;
            incBtn.disabled = count >= max;
            updatePassengerHeader();
        }

        decBtn.addEventListener('click', () => updateCount(count - 1));
        incBtn.addEventListener('click', () => updateCount(count + 1));
    }

    // Update passenger header text
    function updatePassengerHeader() {
        const adultCount = parseInt(document.getElementById('adultCount').textContent) || 0;
        const childCount = parseInt(document.getElementById('childCount').textContent) || 0;
        const infantLapCount = parseInt(document.getElementById('infantLapCount').textContent) || 0;
        const classSelect = document.querySelector('select');
        const selectedClass = classSelect.options[classSelect.selectedIndex].text;
        const totalTravellers = adultCount + childCount + infantLapCount;

        const passengerHeader = document.querySelector('.passenger-header div:first-child');
        passengerHeader.textContent = `${selectedClass}, ${totalTravellers} Travellers`;
    }

    // Initialize counters
    setupCounter('adultDec', 'adultInc', 'adultCount', 1);
    setupCounter('childDec', 'childInc', 'childCount');
    setupCounter('infantLapDec', 'infantLapInc', 'infantLapCount');

    // Update header when class changes
    document.querySelector('select').addEventListener('change', updatePassengerHeader);

    // Hotels Form

    // Toggle passenger selector
    function togglePassengerSelectorHotel() {
        const content = document.getElementById('passengerContentHotel');
        content.classList.toggle('active');
    }

    // Set up counters
    function setupCounterHotel(decBtnId, incBtnId, countId, min = 0, max = 9) {
        const decBtnHotel = document.getElementById(decBtnId);
        const incBtnHotel = document.getElementById(incBtnId);
        const countElemHotel = document.getElementById(countId);

        let countHotel = parseInt(countElemHotel.textContent);

        function updateCountHotel(value) {
            countHotel = value;
            countElemHotel.textContent = countHotel;
            decBtnHotel.disabled = countHotel <= min;
            incBtnHotel.disabled = countHotel >= max;
            updatePassengerHeaderHotel();
        }

        decBtnHotel.addEventListener('click', () => updateCountHotel(countHotel - 1));
        incBtnHotel.addEventListener('click', () => updateCountHotel(countHotel + 1));
    }

    // Update passenger header text
    function updatePassengerHeaderHotel() {
        const adultCountHotel = parseInt(document.getElementById('adultCountHotel').textContent) || 0;
        const childCountHotel = parseInt(document.getElementById('childCountHotel').textContent) || 0;
        const infantLapElemHotel = document.getElementById('infantLapCountHotel');

        const classSelectHotel = document.getElementById("roomNumber");
        const selectedClassHotel = classSelectHotel.options[classSelectHotel.selectedIndex].text;

        const passengerHeaderHotel = document.getElementById('hotelDetails');
        passengerHeaderHotel.textContent = `${selectedClassHotel} Rooms, ${adultCountHotel} Adults, ${childCountHotel} Child`;
    }

    // Initialize counters
    setupCounterHotel('adultDecHotel', 'adultIncHotel', 'adultCountHotel', 1);
    setupCounterHotel('childDecHotel', 'childIncHotel', 'childCountHotel');

    // If hotel form also has infants
    if (document.getElementById('infantLapCountHotel')) {
        setupCounterHotel('infantLapDecHotel', 'infantLapIncHotel', 'infantLapCountHotel');
    }

    // Update header when class changes (only inside hotel form)
    const roomSelectHotel = document.getElementById('roomNumber');
    if (roomSelectHotel) {
        roomSelectHotel.addEventListener('change', updatePassengerHeaderHotel);
    }

    // console.log("ALL WORKING !!!");
}, 500);