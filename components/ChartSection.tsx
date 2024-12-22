import { Pie, Bar } from "react-chartjs-2";

const generateColors = (count: number) => {
  const baseColors = [
    "#FF6384", // red
    "#36A2EB", // blue
    "#FFCE56", // yellow
    "#4BC0C0", // teal
    "#9966FF", // purple
    "#FF9F40", // orange
    "#7CBA3B", // green
    "#EC932F", // dark orange
    "#3B7BA3", // dark blue
    "#B4464B", // dark red
  ];

  while (baseColors.length < count) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    baseColors.push(`rgb(${r}, ${g}, ${b})`);
  }

  return baseColors.slice(0, count);
};

interface ChartSectionProps {
  categoryData: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
}

export default function ChartSection({ categoryData }: ChartSectionProps) {
  const colors = generateColors(categoryData.labels.length);

  const enhancedCategoryData = {
    ...categoryData,
    datasets: categoryData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: colors,
    })),
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const pieChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {},
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-white">
          Expense Categories
        </h2>
        <div className="flex flex-col md:flex-row items-center">
          <div className="h-64 w-full md:w-auto md:flex-1">
            <Pie data={enhancedCategoryData} options={pieChartOptions} />
          </div>
          <div className="ml-4 text-white hidden md:block">
            <ul className="space-y-2">
              {enhancedCategoryData.labels.map((label, index) => (
                <li key={label} className="flex items-center">
                  <span
                    className="w-4 h-4 mr-2 rounded-sm"
                    style={{
                      backgroundColor: colors[index],
                    }}
                  />
                  <span className="text-sm">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-white">Monthly Trend</h2>
        <div className="h-64">
          <Bar
            data={enhancedCategoryData}
            options={{
              ...barChartOptions,
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
