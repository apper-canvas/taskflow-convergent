import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

const TaskHeaderActions = ({
  totalTasks,
  completedTasks,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddTaskClick,
  selectedTasks,
  onBulkDelete,
  onClearSelection
}) => {
  return (
    <div className="flex-shrink-0 p-6 bg-white border-b border-surface-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-surface-900">Tasks</h1>
          <p className="text-surface-600 mt-1">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </Select>
          
          <Button
            onClick={onAddTaskClick}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            whileHover={{ y: -0.5, shadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          >
            <ApperIcon name="Plus" size={18} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      
      {selectedTasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-surface-50 rounded-lg border border-surface-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-surface-700">
              {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <Button
                onClick={onBulkDelete}
                className="px-3 py-1 text-sm bg-error text-white rounded hover:bg-error/90 transition-colors"
              >
                Delete Selected
              </Button>
              <Button
                onClick={onClearSelection}
                className="px-3 py-1 text-sm bg-surface-200 text-surface-700 rounded hover:bg-surface-300 transition-colors"
              >
                Clear Selection
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

TaskHeaderActions.propTypes = {
  totalTasks: PropTypes.number.isRequired,
  completedTasks: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onAddTaskClick: PropTypes.func.isRequired,
  selectedTasks: PropTypes.arrayOf(PropTypes.string).isRequired,
  onBulkDelete: PropTypes.func.isRequired,
  onClearSelection: PropTypes.func.isRequired,
}

export default TaskHeaderActions