import { createPortal } from 'react-dom'
import usePortal from '../ext/use-portal'

/**
 * @example
 * <Portal>
 *   <p>Thinking with portals</p>
 * </Portal>
 */
const Portal = ({ id, children }) => {
  const target = usePortal(id);
  return createPortal(
    children,
    target,
  )
}

export default Portal
