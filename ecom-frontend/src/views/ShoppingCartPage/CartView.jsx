/**
 * CartView.jsx
 * Shopping cart page displaying cart items with checkout functionality.
 * Shows empty state if no items, otherwise displays cart items and totals.
 */

import { MdArrowBack, MdShoppingCart } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import CartItemRow from './components/CartItemRow';
import EmptyCartState from './components/EmptyCartState';
import { syncCartForCheckout } from '../../store/actions';
import toast from 'react-hot-toast';

const CartView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);

    // Calculate total price from all cart items
    const cartSummary = { ...items };
    cartSummary.totalPrice = items?.reduce(
        (acc, cur) => acc + Number(cur?.price) * Number(cur?.quantity), 0
    );

    // Show empty cart state if no items
    if (!items || items.length === 0) return <EmptyCartState />;

    return (
        <div className="lg:px-14 sm:px-8 px-4 py-10">
            {/* Page header */}
            <div className="flex flex-col items-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                  <MdShoppingCart size={36} className="text-gray-700" />
                    Your Cart
                </h1>
                <p className="text-lg text-gray-600 mt-2">All your selected items</p>
            </div>

            {/* Table header */}
            <div className="grid md:grid-cols-5 grid-cols-4 gap-4 pb-2 font-semibold items-center">
                <div className="md:col-span-2 justify-self-start text-lg text-slate-800 lg:ps-4">
                    Product
                </div>
                <div className="justify-self-center text-lg text-slate-800">Price</div>
                <div className="justify-self-center text-lg text-slate-800">Quantity</div>
                <div className="justify-self-center text-lg text-slate-800">Total</div>
            </div>

            {/* Cart items list */}
            <div>
                {items && items.length > 0 &&
                    items.map((item, i) => <CartItemRow key={i} {...item}/>)}
            </div>

            {/* Cart summary and checkout */}
            <div className="border-t-[1.5px] border-slate-200 py-4 flex sm:flex-row sm:px-0 px-2 flex-col sm:justify-between gap-4">
                <div></div>
                <div className="flex text-sm gap-1 flex-col">
                    <div className="flex justify-between w-full md:text-lg text-sm font-semibold">
                        <span>Subtotal</span>
                        <span>${Number(cartSummary?.totalPrice).toFixed(2)}</span>
                    </div>

                    <p className="text-slate-500">
                        Taxes and shipping calculated at checkout
                    </p>

                    {/* Checkout button */}
                    <div className="w-full flex justify-end">
                        <button
                            onClick={() => dispatch(syncCartForCheckout(navigate, toast))}
                            className="font-semibold w-[300px] py-2 px-4 rounded-xs bg-custom-blue text-white flex items-center justify-center gap-2 hover:text-gray-300 transition duration-500">
                            <MdShoppingCart size={20} />
                            Checkout
                        </button>
                    </div>

                    {/* Continue shopping link */}
                    <Link className="flex gap-2 items-center mt-2 text-slate-500" to="/products">
                        <MdArrowBack />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartView;
