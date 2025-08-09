"use client";

import { useShallow } from "zustand/shallow";
import { useCart } from "../store";
import Breadcrumb from "../component/breadcrumb";

export default function Cart() {
  const { cart, addCart, removeCart } = useCart(
    useShallow((state) => ({
      count: state.count,
      cart: state.cart,
      addCart: state.addCart,
      removeCart: state.removeCart,
    }))
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 10 : 0; // example fixed shipping
  const totalPrice = subtotal + shipping;

  const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "Cart" }];

  return (
    <div className="min-h-screen px-4 p-4">
      <div className="main-bg-100 mb-10 m-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="mt-5 mb-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product List */}
        <div className="col-span-2 bg-white rounded-md shadow-md p-4">
          <h3 className="text-lg font-semibold border-b border-neutral-300 pb-2 mb-4">
            Your Cart
          </h3>

          {cart.length === 0 ? (
            <p className="text-neutral-600">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-y-4">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b pb-3"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src="https://via.placeholder.com/300?text=No+Image"
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">
                        {item.title.length > 20
                          ? `${item.title.slice(0, 20)}...`
                          : item.title}
                      </p>
                      <p className="text-sm text-neutral-500">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 main-bg-100 rounded p-1">
                    <button
                      className="px-2 py-1  "
                      onClick={() => removeCart(item.id)}
                    >
                      -
                    </button>
                    <p>{item.quantity}</p>
                    <button
                      className="px-2 py-1 "
                      onClick={() => addCart(item)}
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Summary */}
        <div className="bg-white rounded-md shadow-md p-4 h-fit">
          <h3 className="text-lg font-semibold border-b border-neutral-300 pb-2 mb-4">
            Order Summary
          </h3>
          <div className="flex justify-between mb-2">
            <p>Subtotal:</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between mb-2">
            <p>Shipping:</p>
            <p>${shipping.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t border-neutral-300 pt-2">
            <p>Total:</p>
            <p>${totalPrice.toFixed(2)}</p>
          </div>
          <button
            className="mt-4 w-full main-bg text-white py-2 rounded hover:bg-blue-700"
            disabled={cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
