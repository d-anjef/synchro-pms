import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiMoreHorizontal, FiCalendar } from 'react-icons/fi';
import { format, addDays, startOfDay, differenceInDays } from 'date-fns';
import './TaskCalendar.css';

const TaskCalendar = ({ tasks = [] }) => {
  // Generate next 8 days
  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 8 }, (_, i) => addDays(today, i));
  }, []);

  // Filter tasks within visible range
  const visibleTasks = useMemo(() => {
    const start = days[0];
    const end = days[days.length - 1];
    return tasks
      .filter((t) => t.dueDate)
      .filter((t) => {
        const d = new Date(t.dueDate);
        return d >= start && d <= end;
      })
      .slice(0, 6);
  }, [tasks, days]);

  return (
    <motion.div
      className="task-calendar"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="task-calendar-header">
        <h3>Task Calendar</h3>
        <button className="task-calendar-menu">
          <FiMoreHorizontal size={16} />
        </button>
      </div>

      <div className="task-calendar-body">
        {/* Days header */}
        <div className="task-calendar-days">
          {days.map((day, i) => (
            <div key={i} className="task-calendar-day">
              <div className="task-calendar-day-label">
                {format(day, 'd')} {format(day, 'MMM')}
              </div>
            </div>
          ))}
        </div>

        {/* Tasks timeline */}
        <div className="task-calendar-tracks">
          {visibleTasks.length === 0 ? (
            <div className="task-calendar-empty">
              <FiCalendar size={28} />
              <p>No upcoming tasks in this period</p>
            </div>
          ) : (
            visibleTasks.map((task, i) => {
              const startCol = Math.max(
                0,
                differenceInDays(new Date(task.dueDate), days[0])
              );
              return (
                <motion.div
                  key={task._id}
                  className="task-calendar-track"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className={`task-calendar-bar ${task.status === 'in_progress' ? 'task-calendar-bar-highlight' : ''}`}
                    style={{
                      gridColumnStart: startCol + 1,
                      gridColumnEnd: Math.min(startCol + 2, 9),
                    }}
                  >
                    <span className="task-calendar-bar-date">
                      {format(new Date(task.dueDate), 'd MMM')}
                    </span>
                    <span className="task-calendar-bar-title">{task.title}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCalendar;