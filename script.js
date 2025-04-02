document.addEventListener("DOMContentLoaded", function () {
    const calendarDaysEl = document.getElementById("calendar-days");
    const currentMonthEl = document.getElementById("currentMonth");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const eventFormEl = document.getElementById("eventForm");
    const eventTitleEl = document.getElementById("eventTitle");
    const eventDescEl = document.getElementById("eventDesc");
    const eventDateEl = document.getElementById("eventDate");
    const saveEventBtn = document.getElementById("saveEvent");
    const closeEventFormBtn = document.getElementById("closeEventForm");

    const userRole = document.body.getAttribute("data-role"); // Get user role from HTML
    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem("events")) || [];

    function loadCalendar() {
        calendarDaysEl.innerHTML = "";
        currentMonthEl.textContent = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const prevMonthDays = firstDay.getDay();

        // Add empty slots for previous month
        for (let i = 0; i < prevMonthDays; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("calendar-day", "empty");
            calendarDaysEl.appendChild(emptyCell);
        }

        // Add actual days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("calendar-day");
            dayCell.textContent = day;

            let eventData = events.filter(e => e.date === formatDate(currentDate.getFullYear(), currentDate.getMonth() + 1, day));
            eventData.forEach(event => {
                let eventEl = document.createElement("div");
                eventEl.classList.add("event-item");
                eventEl.textContent = event.title;
                eventEl.addEventListener("click", () => editEvent(event));
                dayCell.appendChild(eventEl);
            });

            if (userRole === "Admin" || userRole === "Teacher") {
                dayCell.addEventListener("click", () => openEventForm(day));
            }

            calendarDaysEl.appendChild(dayCell);
        }
    }

    function openEventForm(day) {
        eventFormEl.style.display = "block";
        eventDateEl.value = formatDate(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
    }

    function saveEvent() {
        let title = eventTitleEl.value.trim();
        let description = eventDescEl.value.trim();
        let date = eventDateEl.value;

        if (!title || !date) {
            alert("Please fill in all fields!");
            return;
        }

        events.push({ title, description, date });
        localStorage.setItem("events", JSON.stringify(events));

        eventFormEl.style.display = "none";
        eventTitleEl.value = "";
        eventDescEl.value = "";
        loadCalendar();
    }

    function editEvent(event) {
        let newTitle = prompt("Edit Event Title:", event.title);
        if (newTitle) {
            let eventIndex = events.findIndex(e => e.date === event.date && e.title === event.title);
            if (eventIndex !== -1) {
                events[eventIndex].title = newTitle;
                localStorage.setItem("events", JSON.stringify(events));
                loadCalendar();
            }
        }
    }

    function formatDate(year, month, day) {
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }

    saveEventBtn.addEventListener("click", saveEvent);
    closeEventFormBtn.addEventListener("click", () => eventFormEl.style.display = "none");

    prevMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        loadCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        loadCalendar();
    });

    function loadPage(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                document.getElementById("content").innerHTML = data;
            });
    }

    document.getElementById("calendarButton").addEventListener("click", function () {
        loadPage("calendar.html");
    });

    loadCalendar();
});
