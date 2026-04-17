import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend
} from "recharts"

function ChartFrame({ children }) {
  const containerRef = useRef(null)
  const [size, setSize] = useState({ width: 0, height: 288 })

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect()
      setSize({
        width: Math.max(Math.round(width), 0),
        height: Math.max(Math.round(height), 288)
      })
    }

    updateSize()

    const observer = new ResizeObserver(() => {
      updateSize()
    })

    observer.observe(element)
    window.requestAnimationFrame(updateSize)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="h-72 w-full min-h-[288px] min-w-0">
      {size.width > 0 ? children(size) : <div className="h-full w-full animate-pulse rounded-2xl bg-surface-50" />}
    </div>
  )
}

export default function TaskStatsCharts({ tasks = [] }) {
  const areaData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("ar", { weekday: "short" })
    const today = new Date()

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))

      const count = tasks.filter((task) => {
        if (!task.createdAt) return false
        return new Date(task.createdAt).toDateString() === date.toDateString()
      }).length

      return {
        name: formatter.format(date),
        tasks: count
      }
    })
  }, [tasks])

  const pieData = useMemo(() => {
    const groups = {
      "مكتملة": { value: 0, color: "#10b981" },
      "قيد التنفيذ": { value: 0, color: "#4f46e5" },
      "ملغاة أو معلقة": { value: 0, color: "#f59e0b" }
    }

    tasks.forEach((task) => {
      const status = String(task.status || "").toUpperCase()

      if (status === "COMPLETED") groups["مكتملة"].value += 1
      else if (status === "OPEN" || status === "IN_PROGRESS" || status === "ASSIGNED") groups["قيد التنفيذ"].value += 1
      else groups["ملغاة أو معلقة"].value += 1
    })

    return Object.entries(groups).map(([name, config]) => ({ name, ...config }))
  }, [tasks])

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="saas-card min-w-0 border-surface-200 bg-white p-8">
        <div className="mb-6">
          <h3 className="text-lg font-black text-surface-900 font-alexandria">نشاط المهام الأسبوعي</h3>
          <p className="text-xs font-bold text-surface-400 mt-1 uppercase tracking-widest">مقارنة المهام الجديدة خلال الأسبوع</p>
        </div>

        <ChartFrame>
          {({ width, height }) => (
            <AreaChart width={width} height={height} data={areaData}>
              <defs>
                <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ fontWeight: 800, color: "#4f46e5" }}
              />
              <Area
                type="monotone"
                dataKey="tasks"
                stroke="#4f46e5"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTasks)"
              />
            </AreaChart>
          )}
        </ChartFrame>
      </div>

      <div className="saas-card min-w-0 border-surface-200 bg-white p-8">
        <div className="mb-6">
          <h3 className="text-lg font-black text-surface-900 font-alexandria">توزيع حالة المهام</h3>
          <p className="text-xs font-bold text-surface-400 mt-1 uppercase tracking-widest">نسبة المهام حسب الحالة الحالية</p>
        </div>

        <ChartFrame>
          {({ width, height }) => (
            <PieChart width={width} height={height}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs font-bold text-surface-600 font-alexandria ml-2">{value}</span>}
              />
            </PieChart>
          )}
        </ChartFrame>
      </div>
    </div>
  )
}
