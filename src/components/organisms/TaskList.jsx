import PropTypes from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'
import EmptyState from '@/components/molecules/EmptyState'

const TaskList = ({
  tasks,
  categories,
  selectedTasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onToggleSelectTask,
  isEmptyAndFiltered,
  onEmptyStateButtonClick,
  isLoading,
  error
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-6 shadow-sm border border-surface-200"
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-3 bg-surface-200 rounded w-1/2"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-surface-200 rounded-full w-16"></div>
                <div className="h-6 bg-surface-200 rounded-full w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <EmptyState
        iconName="AlertCircle"
        title="Something went wrong"
        description={error}
        buttonText="Try Again"
        onButtonClick={onEmptyStateButtonClick}
      />
    )
  }
  
  if (tasks.length === 0 && !isEmptyAndFiltered) {
    return (
      <EmptyState
        iconName="CheckSquare"
        title="No tasks yet"
        description="Create your first task to get started with your productivity journey"
        buttonText="Create Your First Task"
        onButtonClick={onEmptyStateButtonClick}
        iconMotionProps={{ animate: { y: [0, -10, 0] }, transition: { repeat: Infinity, duration: 3 } }}
        buttonMotionProps={{ whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }}
      />
    )
  }

  if (tasks.length === 0 && isEmptyAndFiltered) {
    return (
      <EmptyState
        iconName="SearchX"
        title="No matching tasks found"
        description="Adjust your search query or filters to find tasks."
      />
    )
  }


  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map((task, index) => {
          const category = categories.find(c => c.id === task.categoryId)
          return (
            <TaskCard
              key={task.id}
              task={task}
              category={category}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleSelect={onToggleSelectTask}
              isSelected={selectedTasks.includes(task.id)}
              index={index}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.object).isRequired,
  categories: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onToggleSelectTask: PropTypes.func.isRequired,
  isEmptyAndFiltered: PropTypes.bool.isRequired,
  onEmptyStateButtonClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
}

export default TaskList