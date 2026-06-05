let students = JSON.parse(localStorage.getItem("students")) || [];

function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

function renderStudents() {
    const list = document.getElementById("studentList");
    list.innerHTML = "";
    students.forEach((student, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="schueler.html?index=${index}">${student.name}</a>`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => {
            if (confirm(`Schüler "${student.name}" wirklich löschen? Alle Daten gehen verloren!`)) {
                students.splice(index, 1);
                saveStudents();
                renderStudents();
                renderDashboard();
            }
        };
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
}

document.getElementById("addStudentForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("studentNameInput").value.trim();
    if (!name) return;

    if (students.some(s => s.name === name)) {
        alert("Dieser Schüler existiert bereits!");
        return;
    }

    students.push({ name, appointments: [], payments: [] });
    saveStudents();
    renderStudents();
    renderDashboard();
    document.getElementById("studentNameInput").value = "";
});

function formatDate(yyyy_mm_dd) {
    const [y, m, d] = yyyy_mm_dd.split("-");
    return `${d}.${m}.${y}`;
}

function renderDashboard() {
    const students = JSON.parse(localStorage.getItem("students")) || [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let allAppointments = [];
    students.forEach(s => {
        if (s.appointments) {
            s.appointments.forEach(a => {
                if (!a.date) return;
                const d = new Date(a.date);
                if (isNaN(d)) return;

                const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                if (day >= today) {
                    allAppointments.push({ ...a, student: s.name });
                }
            });
        }
    });

    allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    const nextEventEl = document.getElementById("nextEvent");

    if (allAppointments.length > 0) {
        const firstDate = allAppointments[0].date;

        const sameDayAppointments = allAppointments.filter(
            appt => appt.date === firstDate
        );

        nextEventEl.innerHTML = sameDayAppointments
            .map(appt =>
                `${appt.student} | ${appt.title || appt.description} am ${formatDate(appt.date)}`
            )
            .join("<br><br>");

    } else {
        nextEventEl.textContent = "Keine Termine vorhanden.";
    }

    let openPayments = [];
    students.forEach(s => {
        if (s.payments) {
            s.payments.forEach(p => {
                if (!p.confirmed) {
                    openPayments.push({ ...p, student: s.name });
                }
            });
        }
    });

    const openPaymentsEl = document.getElementById("openPayments");
    if (openPayments.length > 0) {
        openPaymentsEl.innerHTML = openPayments
            .map(p => `${p.student} | ${p.title || p.description} (${p.amount} Fr.)`)
            .join("<br><br>");
    } else {
        openPaymentsEl.textContent = "Keine offenen Zahlungen.";
    }
}

renderDashboard();
renderStudents();

document.getElementById("exportDataBtn").addEventListener("click", () => {
const students = localStorage.getItem("students");
if (!students) {
    alert("Keine Daten zum Exportieren vorhanden!");
    return;
}

const blob = new Blob([students], { type: "application/json" });
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "nachhilfe_data.json";
a.click();

URL.revokeObjectURL(url);
});

document.getElementById("importDataInput").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const importedStudents = JSON.parse(event.target.result);

            if (!Array.isArray(importedStudents)) throw new Error("Ungültige Datei");

            importedStudents.forEach(imported => {
                const existing = students.find(s => s.name === imported.name);

                if (existing) {
                    imported.appointments?.forEach(appt => {
                        if (!existing.appointments.includes(appt)) existing.appointments.push(appt);
                    });
                    imported.payments?.forEach(pay => {
                        if (!existing.payments.some(p => p.description === pay.description && p.amount === pay.amount)) {
                            existing.payments.push(pay);
                        }
                    });
                } else {
                    students.push(imported);
                }
            });

            saveStudents();
            renderStudents();
            alert("Import erfolgreich!");
        } catch (err) {
            alert("Fehler beim Import: " + err.message);
        }
    };
    reader.readAsText(file);
});