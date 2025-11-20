async function run() {
    const main = document.querySelector('main');

    const response = await fetch('https://kpi.up.railway.app/ottawa');
    const json = await response.json();
    const { data } = json;

    main.innerHTML = `
    <div id="current-weather">
        <h1>Weather In Ottawa</h1>
        <h4>${data.day}</h4>
        <p>Current Temp: ${data.temp}</p>
        <p>High: ${data.high}</p>
        <p>Low: ${data.low}</p>
        <p>Sunrise: ${data.sunrise}</p>
        <p>Sunset: ${data.sunset}</p>
    </div>
    `
}
run()