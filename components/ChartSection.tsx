import { Pie, Bar } from "react-chartjs-2";

const generateColors = (count: number) => {
  const baseColors = [
    'rgba(34, 197, 94, 0.6)',    // emerald
    'rgba(59, 130, 246, 0.6)',   // blue
    'rgba(239, 68, 68, 0.6)',    // rose
    'rgba(168, 85, 247, 0.6)',   // purple
    'rgba(251, 146, 60, 0.6)',   // orange
    'rgba(14, 165, 233, 0.6)',   // sky
    'rgba(236, 72, 153, 0.6)',   // pink
    'rgba(45, 212, 191, 0.6)',   // teal
    'rgba(234, 179, 8, 0.6)',    // yellow
    'rgba(139, 92, 246, 0.6)',   // violet
  ];

  const baseGlowColors = [
    'rgba(34, 197, 94, 0.3)',
    'rgba(59, 130, 246, 0.3)',
    'rgba(239, 68, 68, 0.3)',
    'rgba(168, 85, 247, 0.3)',
    'rgba(251, 146, 60, 0.3)',
    'rgba(14, 165, 233, 0.3)',
    'rgba(236, 72, 153, 0.3)',
    'rgba(45, 212, 191, 0.3)',
    'rgba(234, 179, 8, 0.3)',
    'rgba(139, 92, 246, 0.3)',
  ];

  while (baseColors.length < count) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    baseColors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    baseGlowColors.push(`rgba(${r}, ${g}, ${b}, 0.3)`);
  }

  return { colors: baseColors.slice(0, count), glowColors: baseGlowColors.slice(0, count) };
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
  const { colors, glowColors } = generateColors(categoryData.labels.length);

  const enhancedCategoryData = {
    ...categoryData,
    datasets: categoryData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: colors,
      borderColor: colors.map(color => color.replace('0.6', '0.8')),
      borderWidth: 2,
      hoverBackgroundColor: colors.map(color => color.replace('0.6', '0.8')),
      shadowColor: glowColors,
    })),
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
        border: {
          display: false,
        },
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
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-blue-900/40 to-blue-950/40 
        border border-blue-500/30
        p-6 hover:from-blue-900/50 hover:to-blue-950/50 
        hover:border-blue-500/50 transition-all duration-300">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-blue-300">Expense Categories</h2>
          <div className="flex flex-col md:flex-row items-center mt-4">
            <div className="h-64 w-full md:w-auto md:flex-1 relative">
              <Pie data={enhancedCategoryData} options={pieChartOptions} />
            </div>
            <div className="ml-6 hidden md:block">
              <ul className="space-y-3">
                {categoryData.labels.map((label, index) => (
                  <li key={label} className="flex items-center">
                    <span
                      className="w-3 h-3 rounded-sm mr-2"
                      style={{
                        backgroundColor: colors[index],
                        boxShadow: `0 0 10px ${glowColors[index]}`,
                      }}
                    />
                    <span className="text-sm text-white/80">{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-violet-900/40 to-violet-950/40 
        border border-violet-500/30
        p-6 hover:from-violet-900/50 hover:to-violet-950/50 
        hover:border-violet-500/50 transition-all duration-300">
        <div className="relative z-10">
          <h2 className="text-lg font-semibold text-violet-300">Monthly Trend</h2>
          <div className="h-64 mt-4">
            <Bar data={enhancedCategoryData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
