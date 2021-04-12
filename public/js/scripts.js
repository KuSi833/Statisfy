var ctx = document.getElementById("doughnut-chart");
var cty = document.getElementById("bar-chart");

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
                    text: "Genres (%):"
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

var bar = new Chart(cty, {
    type: 'bar',
    data: {
      labels: ["Acousticness", "Danceability", "Energy", "Instrumentalness", "Valence"],
      datasets: [
        {
          label: "Audio Feature",
          backgroundColor: [
            'rgba(255, 99, 132, 0.4)',
            'rgba(255, 159, 64, 0.4)',
            'rgba(255, 205, 86, 0.4)',
            'rgba(75, 192, 192, 0.4)',
            'rgba(54, 162, 235, 0.4)',
            'rgba(153, 102, 255, 0.4)',
            'rgba(201, 203, 207, 0.4)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          data: [0.33, 0.5, 0.98, 0.1, 0.7],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Average Audio Feature accross your Taste'
      },
      maintainAspectRatio: false,
      indexAxis: "y"
    }
});