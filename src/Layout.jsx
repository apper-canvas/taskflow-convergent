import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './components/ApperIcon'
import { categoryService } from './services'

const Layout = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.getAll()
        setCategories(result)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  const filterOptions = [
    { id: 'all', label: 'All Tasks', icon: 'List', count: 0 },
    { id: 'pending', label: 'Pending', icon: 'Clock', count: 0 },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: 0 },
    { id: 'today', label: 'Due Today', icon: 'Calendar', count: 0 },
    { id: 'overdue', label: 'Overdue', icon: 'AlertCircle', count: 0 }
  ]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-surface-900">TaskFlow</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <ApperIcon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-4 py-2 w-80 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
              <ApperIcon name="Plus" size={18} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-surface-50 border-r border-surface-200 overflow-y-auto transition-transform duration-300 ease-in-out`}>
          <div className="p-6">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h2 className="text-lg font-heading font-semibold text-surface-900">Filters</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-surface-200 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Progress Overview */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-surface-700 mb-3">Today's Progress</h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-surface-600">Completed</span>
                  <span className="text-sm font-medium text-surface-900">5 of 12</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="mt-2 text-xs text-surface-500">Great progress! Keep it up!</div>
              </div>
            </div>

            {/* Filter Options */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-surface-700 mb-3">Filters</h3>
              <div className="space-y-1">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedCategory(filter.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === filter.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-surface-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <ApperIcon name={filter.icon} size={16} />
                      <span>{filter.label}</span>
                    </div>
                    <span className="text-xs bg-surface-200 px-2 py-0.5 rounded-full">{filter.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-surface-700">Categories</h3>
                <button className="p-1 rounded hover:bg-surface-200 transition-colors">
                  <ApperIcon name="Plus" size={14} className="text-surface-400" />
                </button>
              </div>
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-surface-700 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span>{category.name}</span>
                    </div>
                    <span className="text-xs bg-surface-200 px-2 py-0.5 rounded-full">{category.taskCount}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Layout