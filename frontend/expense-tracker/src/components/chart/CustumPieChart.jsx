import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

import CustomTooltip from './CustomTooltip.jsx'
import CustomLegend from './CustomLegend.jsx'

export const CustumPieChart = ({ data = [], label, totalAmount, colors = [], showTextAnchor }) => {

    if (!data.length) {
        return <p className="text-center text-gray-400">No data</p>;
    }


    return (
        <ResponsiveContainer width="100%" height={380}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={130}
                    innerRadius={100}
                    labelLine={false}
                >
                    {Array.isArray(data) && data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length] || "#8884d8"} />
                    ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
                <Legend content={CustomLegend} />

                {showTextAnchor && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            dy={-25}
                            textAnchor="middle"
                            fill='#666'
                            fontSize="14px"

                        >
                            {label}
                        </text>

                        <text
                            x="50%"
                            y="50%"
                            dy={8}
                            textAnchor="middle"
                            fill='#333'
                            fontSize="24px"
                            fontWeight="semi-bold"

                        >
                            {totalAmount}
                        </text>
                    </>
                )}

            </PieChart>

        </ResponsiveContainer >
    )
}

export default CustumPieChart