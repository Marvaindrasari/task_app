"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useGetCalendarTasks } from "../api/use-fetch-calendar";

export default function CalendarTable() {
  const { workspaceId } = useParams();
  const { tasks, loading } = useGetCalendarTasks(workspaceId as string);

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // 🔥 cek apakah hari ini
  const isToday = (day: number) => {
    const now = new Date();
    return (
      day === now.getDate() &&
      currentMonth === now.getMonth() &&
      currentYear === now.getFullYear()
    );
  };

  // 🔥 mapping task berdasarkan tanggal
  const tasksByDate = useMemo(() => {
    const map: Record<number, any[]> = {};

    tasks.forEach((task: any) => {
      if (!task.dueDate) return;

      const d = new Date(task.dueDate);

      if (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      ) {
        const date = d.getDate();
        if (!map[date]) map[date] = [];
        map[date].push(task);
      }
    });

    return map;
  }, [tasks, currentMonth, currentYear]);

  if (loading) return <p className="p-6">Loading...</p>;

  const daysArray = [];

  // 🔥 kosong sebelum tanggal 1
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    daysArray.push(
      <div key={`empty-${i}`} className="border h-28 bg-gray-50" />
    );
  }

  // 🔥 render tanggal
  for (let day = 1; day <= daysInMonth; day++) {
    daysArray.push(
      <div
        key={day}
        className={`border h-28 p-1 text-xs transition relative
          ${isToday(day) ? "bg-blue-500 text-white" : "bg-white"}
        `}
      >
        {/* tanggal */}
        <p className="font-bold text-right">{day}</p>

        {/* task */}
        <div className="mt-1 space-y-1">
          {tasksByDate[day]?.map((task: any) => (
            <div
              key={task.$id}
              className={`rounded px-1 py-[2px] text-[10px]
                ${isToday(day)
                  ? "bg-white text-black"
                  : "bg-yellow-200 text-black"}
              `}
            >
              {task.taskName || task.name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      {/* Header bulan */}
      <h2 className="text-lg font-bold mb-4">
        {today.toLocaleString("default", { month: "long" })} {currentYear}
      </h2>

      {/* Nama hari */}
      <div className="grid grid-cols-7 text-center font-semibold border bg-gray-100">
        <div className="border p-2">Mon</div>
        <div className="border p-2">Tue</div>
        <div className="border p-2">Wed</div>
        <div className="border p-2">Thu</div>
        <div className="border p-2">Fri</div>
        <div className="border p-2">Sat</div>
        <div className="border p-2">Sun</div>
      </div>

      {/* Grid kalender */}
      <div className="grid grid-cols-7 border">
        {daysArray}
      </div>
    </div>
  );
}