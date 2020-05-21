j = devSeed(100)
let params = {alpha:0.1, beta:0.5, gamma:0.1}
s1 = HoltWinters(1, j, params)
res1 = s1.fit()
s2 = HoltWinters(2, j, params)
res2 = s2.fit()
s3 = HoltWinters(3, j, params)
res3 = s3.fit()
ar2 = new AutoRegression(j, {p:2})
ar5 = new AutoRegression(j, {p:5})
ar9 = new AutoRegression(j, {p:9})
arma55 = new ARMA(j, {p:5, q:5})
ar2.fit()
ar5.fit()
ar9.fit()
res7 = arma55.fit()
r0 = []
r1 = []
r2 = []
r3 = []
r4 = []
r5 = []
r6 = []
r7 = []
s = []
b = []
c = []
l=[]

var url = new URL(window.location.href);
var f = url.searchParams.get("f") || 10;
f = parseInt(f,10)
fs1 = s1.forecast(f)
fs2 = s2.forecast(f)
fs3 = s3.forecast(f)
far2 = ar2.forecast(f)
far5 = ar5.forecast(f)
far9 = ar9.forecast(f)
farma55 = arma55.forecast(f)
for (let i=0; i<j.length; i++){
  r0[i] = j[i]
  r1[i] = res1[i]
  r2[i] = res2[i]
  r3[i] = res3[i]
  r4[i] = j[i]
  r5[i] = j[i]
  r6[i] = j[i]
  r7[i] = res7[i]
  l[i] = i
  s[i] = s3.S[i]
  b[i] = s3.B[i]
  c[i] = s3.C[i]

}
for (let i=0; i<f; i++){
  let m = i + j.length
  l[m] = m
  r1[m] = fs1[i]
  r2[m] = fs2[i]
  r3[m] = fs3[i]
  r4[m] = far2[i]
  r5[m] = far5[i]
  r6[m] = far9[i]
  r7[m] = farma55[i]
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
				},{
					label: 'AR(2)',
					fill: false,
					backgroundColor: window.chartColors.gray,
					borderColor: window.chartColors.gray,
					data: r4,
				},{
					label: 'AR(5)',
					fill: false,
					backgroundColor: window.chartColors.orange,
					borderColor: window.chartColors.orange,
					data: r5,
				},{
					label: 'AR(9)',
					fill: false,
					backgroundColor: window.chartColors.purple,
					borderColor: window.chartColors.purple,
					data: r6,
				},{
					label: 'ARMA(5,5)',
					fill: false,
					backgroundColor: window.chartColors.yellow,
					borderColor: window.chartColors.yellow,
					data: r7,
				}]
    },
    options: {
  responsive: true,
  title: {
    display: true,
    text: 'Random Data, Forecasting out ' + f
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
