import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { isToday, parseISO, isBefore } from 'date-fns'
import { taskService, categoryService } from '@/services'
import TaskHeaderActions from '@/components/organisms/TaskHeaderActions'
import TaskList from '@/components/organisms/TaskList'
import TaskForm from '@/components/organisms/TaskForm'
// Utility function for checking if a date is overdue
function isOverdue(date) {
  if (!date) return false
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return isBefore(parsedDate, new Date())
}

const HomePage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  const [selectedTasks, setSelectedTasks] = useState([])

const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      // Transform data to match expected format
      const transformedTasks = tasksResult.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name,
        description: task.description || '',
        categoryId: task.category_id?.toString(),
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.due_date,
        createdAt: task.created_at || task.CreatedOn,
        completedAt: task.completed_at
      }))
      
      const transformedCategories = categoriesResult.map(category => ({
        id: category.Id?.toString(),
        name: category.Name,
        color: category.color,
        icon: category.icon,
        taskCount: category.task_count || 0
      }))
      
      setTasks(transformedTasks)
      setCategories(transformedCategories)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  const createConfetti = useCallback((taskId) => {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`)
    if (!taskElement) return;

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
  }, [])

const handleTaskComplete = useCallback(async (taskId) => {
    try {
      const task = tasks.find(t => t.id === taskId)
      if (!task) return
      
      const updateData = {
        status: task.status === 'completed' ? 'pending' : 'completed',
        completedAt: task.status === 'completed' ? null : new Date().toISOString()
      }
      
      const updatedTask = await taskService.update(taskId, updateData)
      
      // Transform response data
      const transformedTask = {
        id: updatedTask.Id?.toString(),
        title: updatedTask.title || updatedTask.Name,
        description: updatedTask.description || '',
        categoryId: updatedTask.category_id?.toString(),
        priority: updatedTask.priority || 'medium',
        status: updatedTask.status || 'pending',
        dueDate: updatedTask.due_date,
        createdAt: updatedTask.created_at || updatedTask.CreatedOn,
        completedAt: updatedTask.completed_at
      }
      
      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? transformedTask : t))
      
      if (transformedTask.status === 'completed') {
        toast.success('Task completed! 🎉')
        createConfetti(taskId)
      } else {
        toast.info('Task marked as pending')
      }
    } catch (error) {
      toast.error('Failed to update task')
    }
  }, [tasks, createConfetti])

  const handleTaskSave = useCallback(async (taskData) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, taskData)
        
        // Transform response data
        const transformedTask = {
          id: updated.Id?.toString(),
          title: updated.title || updated.Name,
          description: updated.description || '',
          categoryId: updated.category_id?.toString(),
          priority: updated.priority || 'medium',
          status: updated.status || 'pending',
          dueDate: updated.due_date,
          createdAt: updated.created_at || updated.CreatedOn,
          completedAt: updated.completed_at
        }
        
        setTasks(prevTasks => prevTasks.map(t => t.id === editingTask.id ? transformedTask : t))
        toast.success('Task updated successfully')
      } else {
        const newTask = await taskService.create(taskData)
        
        // Transform response data
        const transformedTask = {
          id: newTask.Id?.toString(),
          title: newTask.title || newTask.Name,
          description: newTask.description || '',
          categoryId: newTask.category_id?.toString(),
          priority: newTask.priority || 'medium',
          status: newTask.status || 'pending',
          dueDate: newTask.due_date,
          createdAt: newTask.created_at || newTask.CreatedOn,
          completedAt: newTask.completed_at
        }
        
        setTasks(prevTasks => [...prevTasks, transformedTask])
        toast.success('Task created successfully')
      }
      setShowTaskModal(false)
      setEditingTask(null)
    } catch (error) {
      toast.error('Failed to save task')
    }
  }, [editingTask])

  const handleTaskDelete = useCallback(async (taskId) => {
    try {
      await taskService.delete(taskId)
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId))
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }, [])

  const handleBulkDelete = useCallback(async () => {
    if (selectedTasks.length === 0) return
    
    try {
      await Promise.all(selectedTasks.map(id => taskService.delete(id)))
      setTasks(prevTasks => prevTasks.filter(t => !selectedTasks.includes(t.id)))
      setSelectedTasks([])
      toast.success(`${selectedTasks.length} tasks deleted`)
    } catch (error) {
      toast.error('Failed to delete tasks')
    }
  }, [selectedTasks])

  const handleToggleSelectTask = useCallback((taskId) => {
    setSelectedTasks(prevSelected =>
      prevSelected.includes(taskId)
        ? prevSelected.filter(id => id !== taskId)
        : [...prevSelected, taskId]
    )
  }, [])

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
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

  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasksCount = tasks.length;
  const isEmptyAndFiltered = tasks.length > 0 && filteredTasks.length === 0;

  return (
    <div className="h-full flex flex-col">
      <TaskHeaderActions
        totalTasks={totalTasksCount}
        completedTasks={completedTasksCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onAddTaskClick={() => {
          setEditingTask(null)
          setShowTaskModal(true)
        }}
        selectedTasks={selectedTasks}
        onBulkDelete={handleBulkDelete}
        onClearSelection={() => setSelectedTasks([])}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <TaskList
          tasks={sortedTasks}
          categories={categories}
          selectedTasks={selectedTasks}
          onToggleComplete={handleTaskComplete}
          onEditTask={(task) => {
            setEditingTask(task)
            setShowTaskModal(true)
          }}
          onDeleteTask={handleTaskDelete}
          onToggleSelectTask={handleToggleSelectTask}
          isLoading={loading}
          error={error}
          isEmptyAndFiltered={isEmptyAndFiltered}
          onEmptyStateButtonClick={!error ? () => { setEditingTask(null); setShowTaskModal(true); } : loadData}
        />
      </div>

      <TaskForm
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

export default HomePage