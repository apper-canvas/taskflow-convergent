import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isOverdue, parseISO } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { taskService, categoryService } from '../services'

const Home = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedTasks, setSelectedTasks] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      setTasks(tasksResult)
      setCategories(categoriesResult)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      const updatedTask = await taskService.update(taskId, {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedAt: task.status === 'completed' ? null : new Date().toISOString()
      })
      
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
      
      if (updatedTask.status === 'completed') {
        toast.success('Task completed! 🎉')
        // Trigger confetti animation
        createConfetti(taskId)
      } else {
        toast.info('Task marked as pending')
      }
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const createConfetti = (taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`)
    if (!taskElement) return

    const rect = taskElement.getBoundingClientRect()
    const colors = ['#6366F1', '#8B5CF6', '#F59E0B', '#10B981']
    
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div')
      particle.className = 'confetti-particle'
      particle.style.left = `${rect.left + rect.width / 2}px`
      particle.style.top = `${rect.top + rect.height / 2}px`
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      particle.style.animationDelay = `${i * 0.1}s`
      
      document.body.appendChild(particle)
      
      setTimeout(() => {
        document.body.removeChild(particle)
      }, 600)
    }
  }

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, taskData)
        setTasks(tasks.map(t => t.id === editingTask.id ? updated : t))
        toast.success('Task updated successfully')
      } else {
        const newTask = await taskService.create(taskData)
        setTasks([...tasks, newTask])
        toast.success('Task created successfully')
      }
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (error) {
      toast.error('Failed to save task')
    }
  }

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(tasks.filter(t => t.id !== taskId))
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return
    
    try {
      await Promise.all(selectedTasks.map(id => taskService.delete(id)))
      setTasks(tasks.filter(t => !selectedTasks.includes(t.id)))
      setSelectedTasks([])
      toast.success(`${selectedTasks.length} tasks deleted`)
    } catch (error) {
      toast.error('Failed to delete tasks')
    }
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      case 'priority':
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      case 'title':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-surface-400',
      medium: 'bg-info',
      high: 'bg-warning',
      urgent: 'bg-error'
    }
    return colors[priority] || colors.medium
  }

  const getPriorityLabel = (priority) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
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
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Actions */}
      <div className="flex-shrink-0 p-6 bg-white border-b border-surface-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-heading font-semibold text-surface-900">Tasks</h1>
            <p className="text-surface-600 mt-1">
              {tasks.filter(t => t.status === 'completed').length} of {tasks.length} tasks completed
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="title">Sort by Title</option>
            </select>
            
            <button
              onClick={() => {
                setEditingTask(null)
                setShowTaskModal(true)
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <ApperIcon name="Plus" size={18} />
              <span>Add Task</span>
            </button>
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
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-error text-white rounded hover:bg-error/90 transition-colors"
                >
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedTasks([])}
                  className="px-3 py-1 text-sm bg-surface-200 text-surface-700 rounded hover:bg-surface-300 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        {sortedTasks.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-surface-900">No tasks yet</h3>
            <p className="mt-2 text-surface-500">Create your first task to get started with your productivity journey</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingTask(null)
                setShowTaskModal(true)
              }}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium"
            >
              Create Your First Task
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sortedTasks.map((task, index) => {
                const category = categories.find(c => c.id === task.categoryId)
                const isTaskOverdue = task.dueDate && isOverdue(parseISO(task.dueDate))
                const isDueToday = task.dueDate && isToday(parseISO(task.dueDate))
                
                return (
                  <motion.div
                    key={task.id}
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
                        <input
                          type="checkbox"
                          checked={selectedTasks.includes(task.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedTasks([...selectedTasks, task.id])
                            } else {
                              setSelectedTasks(selectedTasks.filter(id => id !== task.id))
                            }
                          }}
                          className="w-4 h-4 text-primary focus:ring-primary/20 border-surface-300 rounded"
                        />
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleTaskComplete(task.id)}
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
                        </motion.button>
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
                            <button
                              onClick={() => {
                                setEditingTask(task)
                                setShowTaskModal(true)
                              }}
                              className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all"
                            >
                              <ApperIcon name="Edit" size={16} />
                            </button>
                            <button
                              onClick={() => handleTaskDelete(task.id)}
                              className="p-2 text-surface-400 hover:text-error hover:bg-error/10 rounded-lg transition-all"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)} text-white`}>
                            {getPriorityLabel(task.priority)}
                          </div>
                          
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
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <MainFeature
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false)
          setEditingTask(null)
        }}
        onSave={handleTaskSave}
        task={editingTask}
        categories={categories}
      />
    </div>
  )
}

export default Home