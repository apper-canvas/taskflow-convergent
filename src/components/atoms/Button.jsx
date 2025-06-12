import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const Button = ({ children, className = '', type = 'button', onClick, whileHover, whileTap, ...props }) => {
  // Filter out `whileHover` and `whileTap` so they don't get passed to the DOM element directly
  // if not using motion.button. If using motion.button, they are valid.
  const MotionComponent = whileHover || whileTap ? motion.button : 'button';

  return (
    <MotionComponent
      type={type}
      onClick={onClick}
      className={className}
      {...(whileHover && { whileHover })}
      {...(whileTap && { whileTap })}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  whileHover: PropTypes.object,
  whileTap: PropTypes.object,
}

export default Button