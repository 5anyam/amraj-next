
import Header from "@/components/Header";
import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const { state } = useLocation() as any;
  if (!state) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-lg mx-auto text-center py-24">
          <p className="text-xl mb-6">No order found. Go to <Link to="/shop" className="text-blue-600 hover:underline">Shop</Link></p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="text-4xl text-blue-700 font-bold mb-4">Thank You!</div>
        <div className="text-xl mb-4">Your payment is successful</div>
        <div className="bg-blue-50 rounded-lg p-5 shadow text-blue-900 mb-4">
          <div className="mb-2">Order ID: <span className="font-bold">{state.orderId}</span></div>
          <div className="">Total Paid: ₹{state.total.toFixed(2)}</div>
        </div>
        <div className="mb-6">A confirmation email will be sent to <span className="font-semibold">{state.form?.email}</span></div>
        <Link to="/shop" className="bg-blue-600 hover:bg-blue-900 text-white px-6 py-2 rounded font-bold">Continue Shopping</Link>
      </div>
    </div>
  );
}
