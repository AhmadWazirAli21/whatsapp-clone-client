import { Route, Routes } from 'react-router-dom';
import { Chat, Login, NotFound, Password, Register} from 'views';
import Auth from 'Auth';
import { useEffect } from 'react';
import AppRoute from 'AppRoute';

export default function App() {
  useEffect(() => {
    Auth.init()
  }, [])

  return (
    <div id='main-container' className='container-fluid'>
      <Routes>
        <Route path='/password' element={<AppRoute can={Auth.auth} to='login'><Password /></AppRoute>} />
        <Route path='/' element={<AppRoute can={Auth.auth} to='login'><Chat /></AppRoute>} />
        <Route path='/register' element={<AppRoute can={Auth.guest} to='/'><Register /></AppRoute>} />
        <Route path='/login' element={<AppRoute can={Auth.guest} to='/'><Login /></AppRoute>} />
        <Route path='*' element={<NotFound />}/>
      </Routes>
    </div>
  )
}