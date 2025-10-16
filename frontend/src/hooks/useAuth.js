import { useSelector, useDispatch } from 'react-redux'
import { setUser, logout } from '../store/slices/authSlice'

export default function useAuth() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  return { user, setUser: (u) => dispatch(setUser(u)), logout: () => dispatch(logout()) }
}
