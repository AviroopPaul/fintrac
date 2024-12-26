import { Pie, Bar } from "react-chartjs-2";
import { categoryConfig, getDefaultCategoryConfig } from '@/models/categoryConfig';

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
  const colors = categoryData.labels.map(
    label => getDefaultCategoryConfig(label).backgroundColor
  );
  
  const glowColors = colors.map(color => 
    color?.replace('0.6', '0.3') || 'rgba(156, 163, 175, 0.3)'
  );

  const enhancedCategoryData = {
    ...categoryData,
    datasets: categoryData.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: colors,
      borderColor: colors.map(color => color?.replace('0.6', '0.8')),
      borderWidth: 2,
      hoverBackgroundColor: colors.map(color => color?.replace('0.6', '0.8')),
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
            size: window.innerWidth < 640 ? 10 : 12,
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
            size: window.innerWidth < 640 ? 10 : 12,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="relative overflow-hidden rounded-xl 
        bg-gradient-to-br from-blue-900/40 to-blue-950/40 
        border border-blue-500/30
        p-4 sm:p-6 hover:from-blue-900/50 hover:to-blue-950/50 
        hover:border-blue-500/50 transition-all duration-300">
        <div className="relative z-10">
          <h2 className="text-base sm:text-lg font-semibold text-blue-300">Expense Categories</h2>
          <div className="flex flex-col md:flex-row items-center mt-3 sm:mt-4">
            <div className="h-56 sm:h-64 w-full md:w-auto md:flex-1 relative">
              <Pie data={enhancedCategoryData} options={pieChartOptions} />
            </div>
            <div className="mt-4 md:mt-0 md:ml-6">
              <ul className="flex flex-wrap md:flex-col gap-2 sm:gap-3">
                {categoryData.labels.map((label, index) => (
                  <li key={label} className="flex items-center">
                    <span
                      className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm mr-1.5 sm:mr-2"
                      style={{
                        backgroundColor: colors[index],
                        boxShadow: `0 0 10px ${glowColors[index]}`,
                      }}
                    />
                    <span className="text-xs sm:text-sm text-white/80">{label}</span>
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
