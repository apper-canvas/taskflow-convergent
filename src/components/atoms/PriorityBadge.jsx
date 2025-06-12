import PropTypes from 'prop-types'

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

const PriorityBadge = ({ priority, className = '' }) => {
  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)} text-white ${className}`}>
      {getPriorityLabel(priority)}
    </div>
  )
}

PriorityBadge.propTypes = {
  priority: PropTypes.oneOf(['low', 'medium', 'high', 'urgent']).isRequired,
  className: PropTypes.string,
}

export default PriorityBadge