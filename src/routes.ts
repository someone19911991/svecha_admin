import Main from "./pages/Main/Main";
import Products from "./pages/Products/Products"
import Product from "./pages/Products/Product";
import Notifications from "./pages/Notifications/Notifications";
import Messages from "./pages/Messages/Messages";
import Models from "./pages/Models/Models";

export const routes = [
    { path: '/', element: Main },

    { path: '/products/:category', element: Products },
    { path: '/products/:category_name/:product_id', element: Product },
    { path: '/notifications', element: Notifications },
    { path: '/messages', element: Messages },
    { path: '/notifications_history', element: Notifications },
    { path: '/messages_history', element: Messages },
    { path: '/models/', element: Models },
    // { path: '/spark_plugs', element: SparkPlugs },
    // { path: '/ignition_coils', element: IgnitionCoils },
    // { path: '/ignition_coil_mouthpieces', element: IgnitionCoilMouthpieces },
    // { path: '/airbag_cables', element: IgnitionCoils },
    // { path: '/crankshaft_sensors', element: IgnitionCoils },
    // { path: '/camshaft_sensors', element: IgnitionCoils },
]
