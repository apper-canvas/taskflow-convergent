import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({ iconName, title, description, buttonText, onButtonClick, buttonIconName, iconMotionProps, buttonMotionProps }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      {iconName && (
        <motion.div {...iconMotionProps}>
          <ApperIcon name={iconName} className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
      )}
      <h3 className="mt-4 text-lg font-medium text-surface-900">{title}</h3>
      <p className="mt-2 text-surface-500">{description}</p>
      {buttonText && onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium flex items-center justify-center space-x-2 mx-auto"
          {...buttonMotionProps}
        >
          {buttonIconName && <ApperIcon name={buttonIconName} size={18} />}
          <span>{buttonText}</span>
        </Button>
      )}
    </motion.div>
  )
}

EmptyState.propTypes = {
  iconName: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  buttonIconName: PropTypes.string,
  iconMotionProps: PropTypes.object,
  buttonMotionProps: PropTypes.object,
}

export default EmptyState