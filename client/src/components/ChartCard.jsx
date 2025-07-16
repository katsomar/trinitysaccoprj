import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';

const ChartCard = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map((item) => item.date),
                    datasets: [
                        {
                            label: 'Savings Performance',
                            data: data.map((item) => item.amount),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Amount ($)',
                            },
                        },
                    },
                },
            });
        }
    }, [data]);

    return (
        <div className="chart-card">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ChartCard;
