document.addEventListener("DOMContentLoaded", async () => {
    const ctx = document.getElementById("mpoxChart").getContext("2d");
    let chart;

    async function fetchData() {
        const response = await fetch("https://mpox-api.onrender.com/data");
        const csvData = await response.text();
        return parseCSV(csvData);
    }

    function parseCSV(csv) {
        const rows = csv.split("\n").slice(1);
        const dates = [], confirmedCases = [], deaths = [];
        rows.forEach(row => {
            const [date, cases, death] = row.split(",");
            if (date && cases && death) {
                dates.push(date);
                confirmedCases.push(+cases);
                deaths.push(+death);
            }
        });
        return { dates, confirmedCases, deaths };
    }

    function renderChart(data, range) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.dates.slice(-range),
                datasets: [
                    { label: "Confirmed Cases", data: data.confirmedCases.slice(-range), borderColor: "#a52a2a", fill: false },
                    { label: "Deaths", data: data.deaths.slice(-range), borderColor: "#000", fill: false }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const data = await fetchData();
    renderChart(data, 100);

    document.getElementById("timeline").addEventListener("input", (e) => {
        renderChart(data, +e.target.value);
    });
});
