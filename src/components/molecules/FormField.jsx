import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Label from '@/components/atoms/Label'

const FormField = ({ id, label, children, error, helpText }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center space-x-1"
        >
          <ApperIcon name="AlertCircle" size={14} />
          <span>{error}</span>
        </motion.p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-surface-500">{helpText}</p>
      )}
    </div>
  )
}

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.string,
  helpText: PropTypes.string,
}

export default FormField