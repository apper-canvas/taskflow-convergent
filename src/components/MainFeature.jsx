import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ isOpen, onClose, onSave, task, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        categoryId: task.categoryId || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        status: task.status || 'pending'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        priority: 'medium',
        dueDate: '',
        status: 'pending'
      })
    }
    setErrors({})
  }, [task, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters'
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    const taskData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      createdAt: task?.createdAt || new Date().toISOString()
    }
    
    onSave(taskData)
  }

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'bg-surface-400' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-info' },
    { value: 'high', label: 'High Priority', color: 'bg-warning' },
    { value: 'urgent', label: 'Urgent', color: 'bg-error' }
  ]

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-semibold text-surface-900">
                    {task ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                      errors.title 
                        ? 'border-error focus:border-error focus:ring-error/20' 
                        : 'border-surface-200 focus:border-primary'
                    }`}
                    autoFocus
                  />
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-error flex items-center space-x-1"
                    >
                      <ApperIcon name="AlertCircle" size={14} />
                      <span>{errors.title}</span>
                    </motion.p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add task description..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                      errors.description 
                        ? 'border-error focus:border-error focus:ring-error/20' 
                        : 'border-surface-200 focus:border-primary'
                    }`}
                  />
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 text-sm text-error flex items-center space-x-1"
                    >
                      <ApperIcon name="AlertCircle" size={14} />
                      <span>{errors.description}</span>
                    </motion.p>
                  )}
                  <p className="mt-1 text-xs text-surface-500">
                    {formData.description.length}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Field */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className="w-full px-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="">Select category...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Field */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-2">
                      Priority
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {priorityOptions.map(option => (
                        <motion.button
                          key={option.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleInputChange('priority', option.value)}
                          className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                            formData.priority === option.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-surface-200 hover:border-surface-300 text-surface-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                            <span>{option.label.split(' ')[0]}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Due Date Field */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="w-full px-4 py-3 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <ApperIcon 
                      name="Calendar" 
                      size={18} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 pointer-events-none" 
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all font-medium"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                  >
                    <ApperIcon name={task ? "Save" : "Plus"} size={18} />
                    <span>{task ? 'Update Task' : 'Create Task'}</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MainFeature