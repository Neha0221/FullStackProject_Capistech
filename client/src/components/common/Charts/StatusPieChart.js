import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// statuses: { 'to-do': number, 'in-progress': number, 'done': number, 'cancelled': number }
const StatusPieChart = ({ statuses, height = 260 }) => {
  const data = useMemo(() => ([
    { name: 'To-Do', value: statuses?.['to-do'] || 0 },
    { name: 'In Progress', value: statuses?.['in-progress'] || 0 },
    { name: 'Done', value: statuses?.['done'] || 0 },
    { name: 'Cancelled', value: statuses?.['cancelled'] || 0 }
  ]), [statuses]);

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const hasData = total > 0;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={hasData ? data : [{ name: 'No Data', value: 1 }]}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
          >
            {(hasData ? data : [{ name: 'No Data', value: 1 }]).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={hasData ? COLORS[index % COLORS.length] : '#e9ecef'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatusPieChart;


