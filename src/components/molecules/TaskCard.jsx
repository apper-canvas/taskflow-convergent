import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { format, isToday, isOverdue, parseISO } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Button from '@/components/atoms/Button'
import PriorityBadge from '@/components/atoms/PriorityBadge'

const TaskCard = ({
  task,
  category,
  onToggleComplete,
  onEdit,
  onDelete,
  onToggleSelect,
  isSelected,
  index
}) => {
  const isTaskOverdue = task.dueDate && isOverdue(parseISO(task.dueDate))
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate))

  return (
    <motion.div
      data-task-id={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -1, shadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      className={`bg-white rounded-lg p-6 shadow-sm border border-surface-200 transition-all duration-200 ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            checked={isSelected}
            onChange={() => onToggleSelect(task.id)}
          />
          <Button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleComplete(task.id)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              task.status === 'completed'
                ? 'bg-success border-success'
                : 'border-surface-300 hover:border-success hover:bg-success/10'
            }`}
          >
            {task.status === 'completed' && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                  d="M3 7L6 10L11 4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            )}
          </Button>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-medium transition-all duration-200 ${
                task.status === 'completed' 
                  ? 'text-surface-500 line-through' 
                  : 'text-surface-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`mt-1 text-sm transition-all duration-200 ${
                  task.status === 'completed' 
                    ? 'text-surface-400' 
                    : 'text-surface-600'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                onClick={() => onEdit(task)}
                className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all"
              >
                <ApperIcon name="Edit" size={16} />
              </Button>
              <Button
                onClick={() => onDelete(task.id)}
                className="p-2 text-surface-400 hover:text-error hover:bg-error/10 rounded-lg transition-all"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-3">
            <PriorityBadge priority={task.priority} />
            
            {category && (
              <div className="flex items-center space-x-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-xs text-surface-600">{category.name}</span>
              </div>
            )}
            
            {task.dueDate && (
              <div className={`flex items-center space-x-1 text-xs ${
                isTaskOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-surface-600'
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span>
                  {isDueToday ? 'Due today' : format(parseISO(task.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    categoryId: PropTypes.string,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    status: PropTypes.string.isRequired,
  }).isRequired,
  category: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }),
  onToggleComplete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
}

export default TaskCard