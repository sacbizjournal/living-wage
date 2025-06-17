const data = {
  "1 Adult": {
    living: [27.46, 48.66, 62.21, 80.28],
    poverty: [7.52, 10.17, 12.81, 15.46],
    minimum: [16.50, 16.50, 16.50, 16.50]
  },
  "2 Adults, 1 working": {
    living: [37.10, 45.65, 49.86, 59.10],
    poverty: [10.17, 12.81, 15.46, 18.10],
    minimum: [16.50, 16.50, 16.50, 16.50]
  },
  "2 Adults, 2 working": {
    living: [18.55, 26.84, 33.61, 41.62],
    poverty: [5.08, 6.41, 7.73, 9.05],
    minimum: [16.50, 16.50, 16.50, 16.50]
  }
};

const displayLabels = {
  food: "Food",
  childCare: "Child care",
  medical: "Medical",
  housing: "Housing",
  transportation: "Transportation",
  civic: "Civic engagement",
  internet: "Internet & Mobile",
  other: "Other"
};

const expensesData = {
  "1 Adult": {
    0: { food: 4683, childCare: 0, medical: 3019, housing: 20147, transportation: 10531, civic: 3587, internet: 1472, other: 4749, totalExpenses: 48188 },
    1: { food: 6886, childCare: 13904, medical: 10439, housing: 26483, transportation: 12187, civic: 6314, internet: 1472, other: 9123, totalExpenses: 86809 },
    2: { food: 10315, childCare: 28603, medical: 10512, housing: 26483, transportation: 15352, civic: 6971, internet: 1472, other: 9558, totalExpenses: 109266  },
    3: { food: 13723, childCare: 37382, medical: 10589, housing: 36001, transportation: 17664, civic: 8938, internet: 1472, other: 11490, totalExpenses: 137259 }
  },
  "2 Adults, 1 working": {
    0: { food: 8585, childCare: 0, medical: 7262, housing: 21232, transportation: 12187, civic: 6314, internet: 2078, other: 9123, totalExpenses: 66781 },
    1: { food: 10670, childCare: 0, medical: 11406, housing: 26483, transportation: 15352, civic: 6971, internet: 2078, other: 10121, totalExpenses: 83081 },
    2: { food: 13726, childCare: 0, medical: 11680, housing: 26483, transportation: 17664, civic: 8938, internet: 2078, other: 11490, totalExpenses: 92058 },
    3: { food: 16744, childCare: 0, medical: 11983, housing: 36001, transportation: 19595, civic: 9915, internet: 2078, other: 12746, totalExpenses: 109063 }
  },
  "2 Adults, 2 working": {
    0: { food: 8585, childCare: 0, medical: 7262, housing: 21232, transportation: 12187, civic: 6314, internet: 2078, other: 9123, totalExpenses: 66781 },
    1: { food: 10670, childCare: 0, medical: 11406, housing: 26483, transportation: 15352, civic: 6971, internet: 2078, other: 10121, totalExpenses: 96985 },
    2: { food: 13726, childCare: 28603, medical: 11680, housing: 26483, transportation: 17664, civic: 8938, internet: 2078, other: 11490, totalExpenses: 120661 },
    3: { food: 16744, childCare: 37382, medical: 11983, housing: 36001, transportation: 19595, civic: 9915, internet: 2078, other: 12746, totalExpenses: 146445 }
  }
};

let chartInstance = null;

function calculateWage() {
  const adults = parseInt(document.getElementById('adults').value);
  const working = parseInt(document.getElementById('workingAdults').value);
  const children = parseInt(document.getElementById('children').value);
  const chartCanvas = document.getElementById('expenseChart');

  let group = '';
  if (adults === 1) {
    group = '1 Adult';
  } else if (adults === 2 && working === 1) {
    group = '2 Adults, 1 working';
  } else if (adults === 2 && working === 2) {
    group = '2 Adults, 2 working';
  } else {
    document.getElementById('result').innerText = 'Invalid household setup';
    return;
  }

  const livingWage = data[group].living[children];
  const povertyWage = data[group].poverty[children];
  const minimumWage = data[group].minimum[children];

  const expense = expensesData[group][children];
  const totalExpenses = expense.totalExpenses;

  const resultText = `To support a household with ${adults} adult(s), ${working} working, and ${children} child(ren) in the Sacramento metro area, here's what each working adult needs to earn:<br>
    <span class="highlight">– Living wage:</span> $${livingWage.toFixed(2)}/hr<br>
    For reference:
    – California minimum wage: $${minimumWage.toFixed(2)}/hr
    – Poverty wage: $${povertyWage.toFixed(2)}/hr
    <span class="highlight">– Estimated household annual expenses:</span> $${totalExpenses.toLocaleString()}`;

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = resultText;
  resultDiv.style.display = 'block';

  document.getElementById('chartSection').style.display = 'block';

  // Show or hide dynamic footnote based on household condition
  const footnoteDynamic = document.getElementById('footnoteDynamic');
  if (group === '2 Adults, 1 working' && children >= 1) {
    footnoteDynamic.style.display = 'block';
  } else {
    footnoteDynamic.style.display = 'none';
  }

  const entries = Object.entries(expense).filter(([key]) => key !== 'totalExpenses');
  const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
  const labels = sortedEntries.map(entry => displayLabels[entry[0]] || entry[0]);
  const values = sortedEntries.map(entry => entry[1]);

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Annual expenses',
        data: values,
        backgroundColor: '#3D6DAC',
        barThickness: 30,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: 'Libre Franklin'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `$${context.parsed.x.toLocaleString()}`;
            }
          },
          titleFont: {
            family: 'Libre Franklin'
          },
          bodyFont: {
            family: 'Libre Franklin'
          }
        }
      },
      scales: {
        x: {
          position: 'top',
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            },
            font: {
              family: 'Libre Franklin'
            }
          },
          grid: {
            display: false
          },
          beginAtZero: true
        },
        y: {
          ticks: {
            font: {
              family: 'Libre Franklin'
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}