import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
//import NewHiresTable from './components/getAllNewHires/NewHiresTable';
import NewHiresTable from './components/getAllNewHires/NewHiresTable';
import AddNewHire from './components/addNewHire/AddNewHire';
import EditNewHire from './components/updateNewHire/EditNewHire';

function App() {

  const route = createBrowserRouter([
    {
    path:'/',
    element: <NewHiresTable/>
    },
    {
      path:'/add-new-hire',
      element: <AddNewHire/>
    },
    {
      path:'/update-new-hire/:id',
      element: <EditNewHire/>
    },
])

  return (
    <div className="App">
      <RouterProvider router = {route}></RouterProvider>
    </div>
  );
}

export default App
