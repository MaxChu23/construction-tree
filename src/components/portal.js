import usePortal from '../ext/use-portal'
import { createPortal } from 'react-dom'

const Portal = ({ id, children }) => {
  const target = usePortal(id)
  return createPortal(children, target)
}

export default Portal
