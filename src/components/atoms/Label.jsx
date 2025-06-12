import PropTypes from 'prop-types'

const Label = ({ htmlFor, children, className = '', ...props }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-surface-700 mb-2 ${className}`} {...props}>
      {children}
    </label>
  )
}

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default Label