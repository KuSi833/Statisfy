var ctx = document.getElementById("doughnut-chart");
var cty;

var doughnut = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Pop", "Classical", "Alternative", "Hip-Hop", "Bollywood"],
        datasets: [
            {
                label: "Genres (%)",
                data: [10, 20, 15, 40, 15], 
                backgroundColor: ["#28536B", "#D8719E", "#FFE8C2", "#35CE8D", "#F0A868"]
            }
        ]
    },

    //Config options
    options: {
        plugins: {
            legend: {
                position: "right",
                title: {
                    color: "white",
                    display: true,
                    text: "Genre:"
                },
                labels: {
                    color: "white"
                }
            }
        },
        animations: {
            tension: {
              duration: 1000,
              easing: 'linear',
              from: 1,
              to: 0,
              loop: true
            }
          },
        maintainAspectRatio: false
    }
});