import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import PropTypes from 'prop-types'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Textarea from '@/components/atoms/Textarea'
import Select from '@/components/atoms/Select'
import FormField from '@/components/molecules/FormField'

const TaskForm = ({ isOpen, onClose, onSave, task, categories }) => {
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
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-surface-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading font-semibold text-surface-900">
                    {task ? 'Edit Task' : 'Create New Task'}
                  </h2>
                  <Button
                    onClick={onClose}
                    className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <FormField id="title" label="Task Title *" error={errors.title}>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    className={errors.title ? 'border-error focus:border-error focus:ring-error/20' : 'border-surface-200 focus:border-primary'}
                    autoFocus
                  />
                </FormField>

                <FormField 
                  id="description" 
                  label="Description" 
                  error={errors.description} 
                  helpText={`${formData.description.length}/500 characters`}
                >
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Add task description..."
                    className={errors.description ? 'border-error focus:border-error focus:ring-error/20' : 'border-surface-200 focus:border-primary'}
                  />
                </FormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField id="categoryId" label="Category">
                    <Select
                      id="categoryId"
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                    >
                      <option value="">Select category...</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </FormField>

                  <div>
                    <Label>Priority</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {priorityOptions.map(option => (
                        <Button
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
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <FormField id="dueDate" label="Due Date">
                  <div className="relative">
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="pr-10"
                    />
                    <ApperIcon 
                      name="Calendar" 
                      size={18} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 pointer-events-none" 
                    />
                  </div>
                </FormField>

                <div className="flex justify-end space-x-4 pt-6 border-t border-surface-200">
                  <Button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="px-6 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50 transition-all font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                  >
                    <ApperIcon name={task ? "Save" : "Plus"} size={18} />
                    <span>{task ? 'Update Task' : 'Create Task'}</span>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

TaskForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  task: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  })).isRequired,
}

export default TaskForm