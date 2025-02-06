const apiUrl = "https://your-render-backend-url.onrender.com/data";

async function fetchData() {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function createChart() {
    const data = await fetchData();

    const dates = data.map(d => d.date);
    const confirmedCases = data.map(d => d.confirmed);
    const deathCases = data.map(d => d.deaths);

    const ctx = document.getElementById("lineChart").getContext("2d");
    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [
                { label: "Confirmed Cases", data: confirmedCases, borderColor: "red", fill: false },
                { label: "Death Cases", data: deathCases, borderColor: "black", fill: false }
            ]
        },
        options: {
            responsive: true,
            scales: { x: { display: true, ticks: { maxTicksLimit: 10 } } }
        }
    });

    const slider = document.getElementById("timelineSlider");
    slider.max = dates.length - 1;
    slider.oninput = function () {
        const filteredData = data.slice(0, this.value);
        updateChart(filteredData);
    };
}

function updateChart(filteredData) {
    chart.data.labels = filteredData.map(d => d.date);
    chart.data.datasets[0].data = filteredData.map(d => d.confirmed);
    chart.data.datasets[1].data = filteredData.map(d => d.deaths);
    chart.update();
}

async function createMap() {
    const map = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const data = await fetchData();
    data.forEach(d => {
        L.circle([Math.random() * 140 - 70, Math.random() * 360 - 180], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: d.confirmed * 10
        }).addTo(map);
    });
}

window.onload = function () {
    createChart();
    createMap();
};
