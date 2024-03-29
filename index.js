var timer = -1;
var totalTime = 300;
var selectedDonutType = null;
var donuts = 0;
var donutsPerSecond = 0;
var donutsPerClick = 1;
var donutMarketUnlocked = false;
var dollars = 0;
var timeUntilChartUpdate = 1;
var nextPrice = 10;
var donutBankUnlocked = false;
var donutBankBalance = 0;
var donutsPerSecondPerSecond = 0;
var timeExtendCost = 25;
var tempTimer = 0;

const chartElem = document.getElementById("graph");
const chartCtx = chartElem.getContext('2d');
chartCtx.height = 200;
chartCtx.width = 300;
var chartData = [10,10,10,10,10,10,10,10,10,10];

var nextPrice = 0;
var myChart = new Chart(chartElem, {
    type: 'line',
    data: {
        labels: ["","","","","","","","","",""],
        datasets: [{
            label: 'My First Dataset',
            data: chartData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: 50,
            },
            x: {
                display: false //this will remove all the x-axis grid lines
            }
        },
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        },
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    }
});


function selectDonutType() {
    selectedDonutType = this.value;
    document.getElementById("startgame").disabled = false;
}

for (element of document.getElementsByName("donuttype")) {
    console.log(element.value)
    element.onclick = selectDonutType;
}

const timesPerSecond = 50;

function gameLoop() {
    timer -= 1/timesPerSecond;
    timer += tempTimer / (timesPerSecond/2);
    tempTimer -= tempTimer / (timesPerSecond/2);
    donutsPerSecond += donutsPerSecondPerSecond/timesPerSecond;
    donuts+=donutsPerSecond/timesPerSecond;
    if (timer < 0) {
        clearInterval(gameLoopInterval);
        document.getElementById("game").style.display = "none";
        document.getElementById("postGame").style.display = "block";
        document.getElementById("finalDonutDisplay").innerText = `You got ${Math.floor(donuts)} donuts.`
        document.getElementById("finalDollarDisplay").innerText = `You got ${"$"}${(Math.floor(dollars))}.${(((Math.floor(dollars*100))%100) < 10) ? "0" : ""}${Math.floor(dollars*100)%100} dollars.`
        return;
    }
    const timerVal = Math.ceil(timer);
    document.getElementById("timeDisplay").innerText = `Time left: ${Math.floor(timerVal/60)}:${(timerVal%60 < 10) ? "0" : ""}${timerVal%60}`;
    document.getElementById("donutDisplay").innerText = `Donuts: ${Math.floor(donuts)}`;
    document.getElementById("meterInterior").style.width = `${(donuts-Math.floor(donuts))*100}%`
    document.getElementById("balanceMeterInterior").style.width = `${(donutBankBalance-Math.floor(donutBankBalance))*100}%`
    document.getElementById("dpsdisplay").innerText = `Donuts per second: ${Math.floor(donutsPerSecond*10)/10}`;
    document.getElementById("dpcdisplay").innerText = `Donuts per click: ${Math.floor(donutsPerClick*10)/10}`;
    document.getElementById("dollarsDisplay").innerText = `Dollars: ${"$"}${(Math.floor(dollars))}.${(((Math.floor(dollars*100))%100) < 10) ? "0" : ""}${Math.floor(dollars*100)%100}`;
    document.getElementById("donutPriceDisplay").innerText = `Donut price: ${"$"}${(Math.floor(chartData[chartData.length-1]))}.${(((Math.floor(chartData[chartData.length-1]*100))%100) < 10) ? "0" : ""}${Math.floor(chartData[chartData.length-1]*100)%100}`
    if (donuts >= 25) {
        document.getElementById("donutMachine").classList.add("slideInLeft");
    }
    if (donuts >= 50) {
        document.getElementById("donutDuplicator").classList.add("slideInLeft");
    }
    if (donuts >= 100) {
        document.getElementById("donutMarketUnlock").classList.add("slideInLeft");
    }
    document.getElementById("makeDonutButton").disabled = donutsPerClick == 0;
    document.getElementById("donutMachine").disabled = donuts < 50;
    document.getElementById("donutDuplicator").disabled = donuts < 100;
    document.getElementById("donutMarketUnlock").disabled = donuts < 250 || donutMarketUnlocked;
    document.getElementById("donutBankUnlock").disabled = dollars < 50 || donutBankUnlocked;
    document.getElementById("donutMarketBuyButton").disabled = dollars < chartData[chartData.length-1];
    document.getElementById("donutMarketSellButton").disabled = donuts < 1;
    document.getElementById("donutBankWithdraw").disabled = donutBankBalance < 1;
    document.getElementById("donutBankDeposit").disabled = donuts < 1;
    document.getElementById("donutExponent").disabled = dollars < 250;
    document.getElementById("extendTimer").disabled = dollars < timeExtendCost;
    if (donutsPerSecond != 0) {
        document.getElementById("dpsdisplay").classList.add("slideInRight");
    }
    if (donutsPerClick != 1) {
        document.getElementById("dpcdisplay").classList.add("slideInRight");
    }
    if (dollars >= 50) {
        document.getElementById("donutExponent").classList.add("slideInLeft");
    }
    if (donutMarketUnlocked) {
        document.getElementById("donutMarket").classList.add("slideInRight");
        document.getElementById("dollarsDisplay").classList.add("slideInLeft");
        document.getElementById("donutBankUnlock").classList.add("slideInLeft");
        document.getElementById("extendTimer").classList.add("slideInLeft");
        timeUntilChartUpdate -= 1/timesPerSecond;
        if (timeUntilChartUpdate < 0) {
            nextPrice *= 0.5+(Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random()+Math.random())/10
            if (nextPrice < 0.1) nextPrice = 0.1;
            timeUntilChartUpdate = .5;
            chartData.push(nextPrice);
            chartData.shift();
            myChart.data.datasets.forEach((dataset)=>{
                dataset.data = chartData;
            })
            myChart.update();
        }
    }
    if (donutBankUnlocked) {
        document.getElementById("donutBank").classList.add("slideInRight");
        donutBankBalance *= 1.0005;
        document.getElementById("donutBankBalance").innerText = `Account Balance: ${Math.floor(donutBankBalance)}`;
        document.getElementById("donutBankBalance").innerText = `Account Balance: ${Math.floor(donutBankBalance)}`;
    }
}

var gameLoopInterval = null;

document.getElementById("startgame").onclick = function() {
    if (!this.disabled) {
        document.getElementById("game").style.display = "block";
        document.getElementById("startmenu").style.display = "none";
        timer = totalTime
        donuts = 0;
        if (selectedDonutType == "Time") donuts = -100;
        donutsPerSecond = 0;
        if (selectedDonutType == "Poo") donutsPerSecond = -0.2;
        if (selectedDonutType == "Passive") donutsPerSecond = 10;
        donutsPerClick = 1;
        if (selectedDonutType == "Passive") donutsPerClick = 0;
        timeUntilChartUpdate = .5;
        nextPrice = 10;
        donutMarketUnlocked = false;
        if (selectedDonutType == "Money") donutMarketUnlocked = true;
        dollars = 0;
        if (selectedDonutType == "Money") dollars = -50;
        donutBankUnlocked = false;
        donutBankBalance = 0;
        donutsPerSecondPerSecond = 0;
        timeExtendCost = 25;
        tempTimer = 0;
        if (selectedDonutType == "Time") tempTimer = 30;
        document.getElementById("donutMachine").classList.remove("slideInLeft");
        document.getElementById("donutDuplicator").classList.remove("slideInLeft");
        document.getElementById("donutMarketUnlock").classList.remove("slideInLeft");
        document.getElementById("dpsdisplay").classList.remove("slideInRight");
        document.getElementById("dpcdisplay").classList.remove("slideInRight");
        document.getElementById("donutMarket").classList.remove("slideInRight");
        document.getElementById("dollarsDisplay").classList.remove("slideInLeft");
        document.getElementById("donutBankUnlock").classList.remove("slideInLeft");
        document.getElementById("donutBank").classList.remove("slideInRight");
        document.getElementById("donutExponent").classList.remove("slideInLeft");
        document.getElementById("extendTimer").classList.remove("slideInLeft");
        gameLoopInterval = setInterval(gameLoop, 1000/timesPerSecond);
        document.getElementById("donutDisplay").innerText = `Donuts: ${Math.floor(donuts)}`;
        document.getElementById("dpsdisplay").innerText = `Donuts per second: ${Math.floor(donutsPerSecond*10)/10}`;
        document.getElementById("dpcdisplay").innerText = `Donuts per click: ${Math.floor(donutsPerClick*10)/10}`;
        document.getElementById("dollarsDisplay").innerText = `Dollars: ${"$"}${(Math.floor(dollars))}.${(((Math.floor(dollars*100))%100) < 10) ? "0" : ""}${Math.floor(dollars*100)%100}`;
    } else {
        alert("Matrix has been broken");
    }
}
document.getElementById("backToMenu").onclick = function() {
    document.getElementById("postGame").style.display = "none";
    document.getElementById("startmenu").style.display = "block";

}

document.getElementById("makeDonutButton").onclick = ()=>{
    donuts+=donutsPerClick;
    document.getElementById("donutDisplay").innerText = `Donuts: ${Math.floor(donuts)}`;
}

document.getElementById("donutMachine").onclick = ()=>{
    if (donuts >= 50) {
        donutsPerSecond+=0.5;
        document.getElementById("dpsdisplay").innerText = `Donuts per second: ${Math.floor(donutsPerSecond*10)/10}`;
        donuts -= 50;
    }
}
document.getElementById("donutDuplicator").onclick = ()=>{
    if (donuts >= 100) {
        donutsPerClick+=0.1;
        document.getElementById("dpcdisplay").innerText = `Donuts per click: ${Math.floor(donutsPerClick*10)/10}`;
        donuts -= 100;
    }
}
document.getElementById("donutMarketUnlock").onclick = ()=>{
    if (donuts >= 250) {
        donutMarketUnlocked = true;
        donuts -= 250;
    }
}
document.getElementById("donutMarketBuyButton").onclick = ()=>{
    if (dollars > chartData[chartData.length-1]) {
        donuts += 1;
        dollars -= chartData[chartData.length-1];
        nextPrice += (Math.random()+Math.random())/2;
    }
}
document.getElementById("donutMarketSellButton").onclick = ()=>{
    if (donuts >= 1) {
        donuts--;
        dollars += chartData[chartData.length-1];
        nextPrice -= (Math.random()+Math.random())/2;
        if (nextPrice < 0.1) nextPrice = 0.1;
    }
}
document.getElementById("donutBankUnlock").onclick = ()=>{
    if (dollars >= 50) {
        donutBankUnlocked = true;
        dollars -= 50;
    }
}
document.getElementById("donutBankDeposit").onclick = ()=>{
    if (donuts >= 1) {
        donuts--;
        donutBankBalance++;
    }
}
document.getElementById("donutBankWithdraw").onclick = ()=>{
    if (donutBankBalance >= 1) {
        donuts+=Math.floor(donutBankBalance);
        donutBankBalance = 0;
    }
}
document.getElementById("donutExponent").onclick = ()=>{
    if (dollars >= 250) {
        donutsPerSecondPerSecond+=0.1;
        dollars -= 250;
    }
}
document.getElementById("extendTimer").onclick = ()=>{
    if (dollars >= timeExtendCost) {
        tempTimer += 30;
        dollars -= timeExtendCost;
        timeExtendCost *= 2;
        document.getElementById("extendTimer").innerText = `Extend time by 30s (Cost: ${"$"}${timeExtendCost}, x2 every purchase)`
    }
}