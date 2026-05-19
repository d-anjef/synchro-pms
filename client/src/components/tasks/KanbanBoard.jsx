import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { FiPlus, FiMoreHorizontal } from 'react-icons/fi';
import { useMemo } from 'react';
import StatusBadge from './StatusBadge';
import TaskCard from './TaskCard';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';
import './KanbanBoard.css';

const COLUMNS = [
  { id: 'todo', label: 'To-do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review', label: 'In Review' },
  { id: 'completed', label: 'Completed' },
];

const KanbanBoard = ({ tasks = [], onTasksUpdate, onCreate }) => {
  // Group tasks by status
  const columns = useMemo(() => {
    const grouped = {};
    COLUMNS.forEach((c) => {
      grouped[c.id] = tasks
        .filter((t) => t.status === c.id)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    });
    return grouped;
  }, [tasks]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic update
    const updated = tasks.map((t) =>
      t._id === draggableId
        ? { ...t, status: destination.droppableId, position: destination.index }
        : t
    );
    onTasksUpdate?.(updated);

    try {
      await taskService.updateStatus(draggableId, {
        status: destination.droppableId,
        position: destination.index,
      });
    } catch (err) {
      toast.error('Failed to move task');
      onTasksUpdate?.(tasks); // revert
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((col) => (
          <div key={col.id} className="kanban-column">
            {/* Column header */}
            <div className="kanban-column-header">
              <div className="kanban-column-title">
                <span className="kanban-column-drag">⋮⋮</span>
                <StatusBadge status={col.id} count={columns[col.id].length} />
              </div>
              <div className="kanban-column-actions">
                <button><FiMoreHorizontal size={14} /></button>
                <button onClick={() => onCreate?.(col.id)}>
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Tasks list */}
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`kanban-column-body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {columns[col.id].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          style={{
                            ...prov.draggableProps.style,
                            opacity: snap.isDragging ? 0.85 : 1,
                          }}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  {columns[col.id].length === 0 && (
                    <motion.button
                      className="kanban-empty"
                      onClick={() => onCreate?.(col.id)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <FiPlus size={16} />
                      <span>Add task</span>
                    </motion.button>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;