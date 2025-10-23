
import { createBrowserRouter } from 'react-router-dom'

import { Home } from './Pages/home'
import { Detail } from './Pages/detail'
import { Notfound } from './Pages/notfound'
import { Layout } from './components/layout'

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/detail/:cripto",
                element: <Detail />
            },
            {
                path: "*",
                element: <Notfound />
            }
        ]
    }
])

export { router }
    