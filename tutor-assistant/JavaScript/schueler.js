let students = JSON.parse(localStorage.getItem("students")) || [];
const urlParams = new URLSearchParams(window.location.search);
const index = parseInt(urlParams.get("index"));
if (!students[index]) {
    alert("Schüler existiert nicht!");
    window.location.href = "index.html";
}

const student = students[index];
document.getElementById("studentNameTitle").textContent = student.name;

function formatDate(yyyy_mm_dd) {
    const [y, m, d] = yyyy_mm_dd.split("-");
    return `${d}.${m}.${y}`;
}

function renderEvents() {
    const tbody = document.getElementById("eventTable").querySelector("tbody");
    tbody.innerHTML = "";

    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);

    const sorted = [...student.appointments].sort((a, b) => new Date(a.date) - new Date(b.date));

    const recent = sorted.filter(a => new Date(a.date) >= threeWeeksAgo);
    const older = sorted.filter(a => new Date(a.date) < threeWeeksAgo);

    renderEventRows(recent, tbody);

    if (older.length > 0) {
        const toggle = document.createElement("button");
        toggle.textContent = "Ältere anzeigen";
        toggle.style.marginTop = "10px";

        let expanded = false;
        let olderRows = [];

        toggle.onclick = () => {
            if (!expanded) {
                olderRows = renderEventRows(older, tbody);
                toggle.textContent = "Ältere ausblenden";
            } else {
                olderRows.forEach(r => r.remove());
                olderRows = [];
                toggle.textContent = "Ältere anzeigen";
            }
            expanded = !expanded;
        };

        tbody.parentNode.appendChild(toggle);
    }
}

function renderEvents() {
    const tbody = document.getElementById("eventTable").querySelector("tbody");
    tbody.innerHTML = "";

    const now = new Date();
    const threeWeeksAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const sortedAppointments = [...student.appointments].sort((a, b) => new Date(a.date) - new Date(b.date));

    let hasOlder = false;
    sortedAppointments.forEach((appt, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${appt.title}</td><td>${formatDate(appt.date)}</td>`;
        const td = document.createElement("td");

        const calBtn = document.createElement("button");
        calBtn.textContent = "In Kalender";
        calBtn.onclick = () => addToCalendar(appt.title, appt.date);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Löschen";
        delBtn.onclick = () => {
            student.appointments.splice(i, 1);
            saveAndRender();
        };

        td.appendChild(calBtn);
        td.appendChild(delBtn);
        td.style.display = "flex";
        td.style.gap = "6px";
        tr.appendChild(td);

        if (new Date(appt.date) < threeWeeksAgo) {
            tr.classList.add("older-appointment");
            tr.style.display = "none";
            hasOlder = true;
        }

        tbody.appendChild(tr);
    });

    if (hasOlder) {
        const trBtn = document.createElement("tr");
        const tdBtn = document.createElement("td");
        tdBtn.colSpan = 3;
        const showBtn = document.createElement("button");
        showBtn.textContent = "Ältere Termine";
        showBtn.onclick = () => {
            document.querySelectorAll(".older-appointment").forEach(el => {
                el.style.display = el.style.display === "none" ? "" : "none";
            });
        };
        tdBtn.appendChild(showBtn);
        trBtn.appendChild(tdBtn);
        tbody.appendChild(trBtn);
    }
}

function renderPayments() {
    const tbody = document.getElementById("paymentTable").querySelector("tbody");
    tbody.innerHTML = "";

    student.payments.forEach((p, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${p.description}</td><td>${p.amount}</td><td>${p.confirmed ? "Bestätigt" : "Nicht bestätigt"}</td>`;
        const td = document.createElement("td");

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = p.confirmed ? "Nicht bestätigt" : "Bestätigen";
        toggleBtn.onclick = () => {
            p.confirmed = !p.confirmed;
            saveAndRender();
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "Löschen";
        delBtn.onclick = () => {
            student.payments.splice(i, 1);
            saveAndRender();
        };

        td.appendChild(toggleBtn);
        td.appendChild(delBtn);
        td.style.display = "flex";
        td.style.gap = "6px";

        tr.appendChild(td);
        tbody.appendChild(tr);
    });
}

function addToCalendar(apptTitle, apptDate) {
    const time = prompt("Uhrzeit (z.B. 15:30):", "12:00");
    if (!time) return;
    const [hour, minute] = time.split(":");

    const start = new Date(`${apptDate}T${hour.padStart(2,'0')}:${minute.padStart(2,'0')}:00`);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const fmt = d => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const event =
    `BEGIN:VCALENDAR
    VERSION:2.0
    BEGIN:VEVENT
    SUMMARY:${apptTitle}
    DTSTART:${fmt(start)}
    DTEND:${fmt(end)}
    END:VEVENT
    END:VCALENDAR`;

    const blob = new Blob([event], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${apptTitle}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveAndRender() {
    localStorage.setItem("students", JSON.stringify(students));
    renderEvents();
    renderPayments();
}

document.getElementById("addEventForm").addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("eventTitle").value.trim();
    const date = document.getElementById("eventDate").value;
    if (title && date) {
        student.appointments.push({ title, date });
        saveAndRender();
    }
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDate").value = "";
});

document.getElementById("addPaymentForm").addEventListener("submit", e => {
    e.preventDefault();
    const description = document.getElementById("paymentTitle").value.trim();
    const amount = parseFloat(document.getElementById("paymentAmount").value);
    const confirmed = document.getElementById("paymentConfirmed").value === "true";
    if (description && !isNaN(amount)) {
        student.payments.push({ description, amount, confirmed });
        saveAndRender();
    }
    document.getElementById("paymentTitle").value = "";
    document.getElementById("paymentAmount").value = "";
    document.getElementById("paymentConfirmed").value = "false";
});

saveAndRender();