# Quick Migration Guide

## Component Import Changes

### Navigation Components
```javascript
// OLD
import NavigationBar from './components/shared/NavigationBar'
import Sidebar from './components/shared/Sidebar'

// NEW
import TopNavBar from './components/ui/navigation/TopNavBar'
import SidebarNav from './components/ui/navigation/SidebarNav'
```

### Product Components
```javascript
// OLD
import ItemCard from './components/shared/ItemCard'
import Filter from './components/products/Filter'
import ProductViewModal from './components/shared/ProductViewModal'

// NEW
import ProductCard from './components/ui/layout/ProductCard'
import ProductFilter from './views/ProductsPage/components/ProductFilter'
import ProductQuickView from './components/ui/modals/ProductQuickView'
```

### Cart Components
```javascript
// OLD
import CartItemDisplay from './components/cart/CartItemDisplay'
import CartEmpty from './components/cart/CartEmpty'
import QuantitySelector from './components/cart/QuantitySelector'

// NEW
import CartItemRow from './views/ShoppingCartPage/components/CartItemRow'
import EmptyCartState from './views/ShoppingCartPage/components/EmptyCartState'
import QuantityControl from './views/ShoppingCartPage/components/QuantityControl'
```

### Feedback Components
```javascript
// OLD
import ErrorPage from './components/shared/ErrorPage'
import Status from './components/shared/Status'

// NEW
import ErrorDisplay from './components/ui/feedback/ErrorDisplay'
import StatusBadge from './components/ui/feedback/StatusBadge'
```

### Layout Components
```javascript
// OLD
import Paginations from './components/shared/Paginations'
import CollapsibleSection from './components/shared/CollapsibleSection'

// NEW
import PaginationControls from './components/ui/layout/PaginationControls'
import CollapsiblePanel from './components/ui/forms/CollapsiblePanel'
```

### Redux Store
```javascript
// OLD
import store from './store/reducers/store'

// NEW
import store from './core/store/configureStore'
```

### Redux Selectors
```javascript
// OLD
const { items } = useSelector((state) => state.shoppingCart)

// NEW
const { items } = useSelector((state) => state.cart)
```

### Utilities
```javascript
// OLD
import { bannerLists } from './utils'
import { adminNavigation } from './utils'

// NEW
import { bannerLists } from './utilities/bannerData'
import { adminNavigation } from './utilities/navigationConfig'
```

### Constants
```javascript
// NEW - Use constants instead of magic numbers
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COST,
  PRODUCTS_PER_PAGE,
  SUCCESS_TOAST_DURATION
} from './utilities/constants'
```

## Redux State Changes

### State Naming
```javascript
// OLD
state.shoppingCart
state.authentication

// NEW
state.cart
state.authentication (unchanged)
```

## File Locations Reference

### Views (Main Pages)
- HomePage → `views/HomePage/HomeView.jsx`
- Products → `views/ProductsPage/ProductsView.jsx`
- Cart → `views/ShoppingCartPage/CartView.jsx`
- Checkout → `views/CheckoutPage/CheckoutView.jsx`
- Login → `views/AuthenticationPage/LoginView.jsx`
- Register → `views/AuthenticationPage/RegisterView.jsx`
- Profile → `views/UserProfilePage/ProfileView.jsx`

### Admin Views
- Dashboard → `views/AdminDashboardPage/DashboardView.jsx`
- Products → `views/AdminDashboardPage/ProductManagementView.jsx`
- Orders → `views/AdminDashboardPage/OrderManagementView.jsx`
- Categories → `views/AdminDashboardPage/CategoryManagementView.jsx`
- Customers → `views/AdminDashboardPage/CustomerManagementView.jsx`

### UI Components
- **Navigation:** `components/ui/navigation/`
- **Feedback:** `components/ui/feedback/`
- **Forms:** `components/ui/forms/`
- **Layout:** `components/ui/layout/`
- **Modals:** `components/ui/modals/`

### Redux Slices
- **Catalog:** `features/catalog/catalogSlice.js`
- **Cart:** `features/cart/cartSlice.js`
- **Auth:** `features/auth/authSlice.js`
- **Payment:** `features/payment/paymentSlice.js`
- **Orders:** `features/orders/orderSlice.js`
- **Admin:** `features/admin/customerSlice.js`
- **Errors:** `features/shared/errorSlice.js`
