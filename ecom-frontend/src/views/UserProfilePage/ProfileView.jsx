/**
 * ProfileView.jsx
 * User profile page showing personal info, addresses, payment methods, and order history.
 * Reuses existing components from checkout for addresses and payment cards.
 */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PersonalInfo from "./components/PersonalInfo";
import AddressInfo from "./components/AddressInfo";
import PaymentCardInfo from "./components/PaymentCardInfo";
import OrderHistory from "./components/OrderHistory";
import {
  fetchUserAddressList,
  getUserPaymentCards,
  getUserOrders,
} from "../../store/actions";

const ProfileView = () => {
  const { currentUser, userAddresses } = useSelector(
    (state) => state.authentication
  );
  const { paymentCards } = useSelector((state) => state.payment);
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  // Fetch all profile data on mount
  useEffect(() => {
    dispatch(fetchUserAddressList());
    dispatch(getUserPaymentCards());
    dispatch(getUserOrders());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">My Profile</h1>

      {/* Personal Information Section */}
      <section className="mb-8">
        <PersonalInfo user={currentUser} />
      </section>

      {/* Saved Addresses Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Saved Addresses
        </h2>
        <AddressInfo address={userAddresses} />
      </section>

      {/* Payment Methods Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-slate-800">
          Payment Methods
        </h2>
        <PaymentCardInfo cards={paymentCards} />
      </section>

      {/* Order History Section */}
      <section className="mb-8">
        <OrderHistory orders={orders} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default ProfileView;
