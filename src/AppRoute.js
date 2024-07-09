import { Navigate } from "react-router-dom";

const AppRoute = ({children, can, to}) => {
  const able = can()
  
  return able ? children : <Navigate to={to} />
}

export default AppRoute