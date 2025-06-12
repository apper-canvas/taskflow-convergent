import PropTypes from 'prop-types'

const Checkbox = ({ checked, onChange, className = '', ...props }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`w-4 h-4 text-primary focus:ring-primary/20 border-surface-300 rounded ${className}`}
      {...props}
    />
  )
}

Checkbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
}

export default Checkbox