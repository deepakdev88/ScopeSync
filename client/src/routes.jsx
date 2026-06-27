import Home from "./pages/Home"
import Admin from './pages/Admin'
import ClientView from "./pages/ClientView"
import { createBrowserRouter } from "react-router"

export const router = createBrowserRouter([
    {
        path:"/",
        Component: Home,    
    },
    {
        path:"/admin",
        Component:Admin
    },
    {
        path:"/project/:projectId",
        Component:ClientView
    }
])