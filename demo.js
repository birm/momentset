j = devSeed(1, 100)
let params = {alpha:0.1, beta:0.5, gamma:0.1}
s1 = HoltWinters(1, j, params)
res1 = s1.fit()
s2 = HoltWinters(2, j, params)
res2 = s2.fit()
s3 = HoltWinters(3, j, params)
res3 = s3.fit()
r0 = []
r1 = []
r2 = []
r3 = []
s = []
b = []
c = []
l=[]
for (let i=0; i<j.length; i++){
  r0[i] = j[i][0]
  r1[i] = res1[i][0]
  r2[i] = res2[i][0]
  r3[i] = res3[i][0]
  l[i] = i
  s[i] = s3.S[i][0]
  b[i] = s3.B[i][0]
  c[i] = s3.C[i][0]
}

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};


var ctx1 = document.getElementById('smoothChart').getContext('2d');
window.smoothChart = new Chart(ctx1, {
    type: 'line',
    data: {
      labels: l,
      datasets: [{
					label: 'Original',
					backgroundColor: window.chartColors.red,
					borderColor: window.chartColors.red,
					data: r0,
					fill: false,
				}, {
					label: 'HoltWinters 1',
					fill: false,
					backgroundColor: window.chartColors.yellow,
					borderColor: window.chartColors.yellow,
					data: r1,
				}, {
					label: 'HoltWinters 2',
					fill: false,
					backgroundColor: window.chartColors.blue,
					borderColor: window.chartColors.blue,
					data: r2,
				}, {
					label: 'HoltWinters 3',
					fill: false,
					backgroundColor: window.chartColors.green,
					borderColor: window.chartColors.green,
					data: r3,
				}]
    },
    options: {
  responsive: true,
  title: {
    display: true,
    text: 'Holt Winters on Random Data'
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Observation'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Value'
      }
    }]
  }
}});
