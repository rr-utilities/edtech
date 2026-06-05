const students = JSON.parse(localStorage.getItem("students")) || [];

let allAppointments = [];
students.forEach(s => {
    if (s.appointments) {
        s.appointments.forEach(a => {
            allAppointments.push({
                name: s.name,
                title: a.title,
                date: a.date
            });
        });
    }
});

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const todayStr = today.toISOString().split("T")[0];

function formatDateDDMMYYYY(dateStr) {
    const [y, m, d] = dateStr.split("-");
    return `${d}.${m}.${y}`;
}

function renderCalendar(year, month) {
    const cal = document.getElementById("calendar");
    cal.innerHTML = "";

    const monthNames = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    document.getElementById("monthLabel").textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;

    for (let i = 1; i < startDay; i++) {
        const empty = document.createElement("div");
        cal.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";

        const dateEl = document.createElement("div");
        dateEl.className = "date";
        dateEl.textContent = d;

        if (dateStr === todayStr) {
            dateEl.classList.add("today");
        }

        dayDiv.appendChild(dateEl);

        const dayEvents = allAppointments.filter(a => a.date === dateStr);
        dayEvents.forEach(e => {
            const ev = document.createElement("div");
            ev.className = "event";
            ev.textContent = e.name;
            dayDiv.appendChild(ev);
        });

        if (dayEvents.length > 0) {
            dayDiv.onclick = () => showPopup(dateStr, dayEvents);
        }

        cal.appendChild(dayDiv);
    }
}

function showPopup(date, events) {
    const popup = document.getElementById("popup");
    document.getElementById("popupDate").textContent = `📅 ${formatDateDDMMYYYY(date)}`;
    const evList = document.getElementById("popupEvents");
    evList.innerHTML = "";
    events.forEach(e => {
        const p = document.createElement("p");
        p.textContent = `${e.name}: ${e.title}`;
        evList.appendChild(p);
    });
    popup.style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

document.getElementById("prevMonth").onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
};

document.getElementById("nextMonth").onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
};

renderCalendar(currentYear, currentMonth);