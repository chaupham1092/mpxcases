document.addEventListener("DOMContentLoaded", async () => {
    const ctx = document.getElementById("mpoxChart").getContext("2d");
    let chart;

    async function fetchData() {
        const response = await fetch("https://mpxcases.onrender.com/data");
        return await response.json();
    }

    function processData(data) {
        let dates = [], confirmedCases = [], deaths = [];

        // Reduce data points by selecting every 7th entry (weekly sampling)
        for (let i = 0; i < data.length; i += 7) {
            dates.push(data[i].date);
            confirmedCases.push(data[i].confirmed);
            deaths.push(data[i].deaths);
        }

        return { dates, confirmedCases, deaths };
    }

    function renderChart(data, range) {
        if (chart) chart.destroy();
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: data.dates.slice(-range),
                datasets: [
                    { label: "Confirmed Cases", data: data.confirmedCases.slice(-range), borderColor: "#a52a2a", borderWidth: 2, fill: false },
                    { label: "Deaths", data: data.deaths.slice(-range), borderColor: "#000", borderWidth: 2, fill: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                elements: { line: { tension: 0.3 } }, // Smooth the line
                scales: { x: { ticks: { maxTicksLimit: 10 } } } // Prevent x-axis clutter
            }
        });
    }

    const rawData = await fetchData();
    const data = processData(rawData);
    renderChart(data, 50);

    document.getElementById("timeline").addEventListener("input", (e) => {
        renderChart(data, +e.target.value);
    });
});
