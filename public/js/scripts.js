var ctx = document.getElementById("doughnut-chart");
var cty;

var doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Africa", "Asia", "Europe", "Latin America", "North America"],
        datasets: [
            {
                label: "Population (millions)",
                data: [2478,5267,734,784,433],
                backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"]
            }
        ]
    },

    //Config options
    options: {
        plugins: {
            legend: {
                position: "right"
            }
        }
    }
});