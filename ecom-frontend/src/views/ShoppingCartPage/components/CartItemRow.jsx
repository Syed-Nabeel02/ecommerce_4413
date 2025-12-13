/**
 * CartItemRow.jsx
 * Individual cart item display component.
 * Renamed from CartItemDisplay for better clarity.
 * Shows product image, name, price, quantity controls, and total.
 */

import { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import QuantityControl from './QuantityControl';
import { useDispatch } from 'react-redux';
import { decreaseCartItemQuantity, increaseCartItemQuantity, removeItemFromCart } from '../../../store/actions';
import toast from 'react-hot-toast';

const CartItemRow = ({
    productId,
    productName,
    image,
    description,
    quantity,
    price,
    cartId,
  }) => {
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const dispatch = useDispatch();

    const handleIncreaseQuantity = (cartItems) => {
        dispatch(increaseCartItemQuantity(
            cartItems,
            toast,
            currentQuantity,
            setCurrentQuantity
        ));
    };

    const handleDecreaseQuantity = (cartItems) => {
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            setCurrentQuantity(newQuantity);
            dispatch(decreaseCartItemQuantity(cartItems, newQuantity));
        }
    };

    const handleRemoveItem = (cartItems) => {
        dispatch(removeItemFromCart(cartItems, toast));
    };

    // Reusable cart item data object
    const cartItemData = {
        image,
        productName,
        description,
        price,
        productId,
        quantity,
    };

    return (
        <div className="grid md:grid-cols-5 grid-cols-4 md:text-md text-sm gap-4   items-center  border border-slate-200  rounded-md  lg:px-4  py-4 p-2">
            <div className="md:col-span-2 justify-self-start flex  flex-col gap-2 ">
                <div className="flex md:flex-row flex-col lg:gap-4 sm:gap-3 gap-0 items-start ">
                   <h3 className="lg:text-[17px] text-sm font-semibold text-slate-600">
                    {productName.length > 90 ? productName.substring(0, 90) + '...' : productName}
                   </h3>
                </div>

                <div className="md:w-36 sm:w-24 w-12">
                    <img
                        src={`${import.meta.env.VITE_BACK_END_URL}/images/${image}`}
                        alt={productName}
                        className="md:h-36 sm:h-24 h-12 w-full object-cover rounded-md"/>


                <div className="flex items-start gap-5 mt-3">
                    <button
                        onClick={() => handleRemoveItem(cartItemData)}
                        className="flex items-center font-semibold space-x-2 px-4 py-1 text-xs border border-rose-600 text-rose-600 rounded-md hover:bg-red-50 transition-colors duration-200">
                        <HiOutlineTrash size={16} className="text-rose-600"/>
                        Remove
                    </button>
                    </div>
                </div>
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
                ${Number(price).toFixed(2)}
            </div>

            <div className="justify-self-center">
                <QuantityControl
                    quantity={currentQuantity}
                    cardCounter={true}
                    onIncrease={() => handleIncreaseQuantity(cartItemData)}
                    onDecrease={() => handleDecreaseQuantity(cartItemData)}
                />
            </div>

            <div className="justify-self-center lg:text-[17px] text-sm text-slate-600 font-semibold">
                ${(Number(currentQuantity) * Number(price)).toFixed(2)}
            </div>
        </div>
    )
};

export default CartItemRow;
