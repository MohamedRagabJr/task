"use client";

import { useShallow } from 'zustand/shallow';
import { useCart } from '../store';
import Breadcrumb from '../component/breadcrumb';

export default function Cart() {
  const { count, cart, addCart, removeCart } = useCart(
    useShallow((state) => ({
      count: state.count,
      cart: state.cart,
      addCart: state.addCart,
      removeCart: state.removeCart,
    }))
  );

  const totalItems = count;
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Cart' },
  ];
  return (
    <div className='min-h-screen'>
        <Breadcrumb  items={breadcrumbItems}/>
        <div className="h-fit max-w-md bg-white flex flex-col gap-y-2 p-2 rounded-md shadow-md mt-5 mb-5 mx-auto">
            
        <h3 className="text-[1rem] text-neutral-950 font-semibold border-b border-neutral-400 pb-2">
            Cart:
        </h3>
        <ul>
            {cart.map((item) => (
            <li
                key={item.id + item.title}
                className="text-[0.9rem] text-neutral-800 flex justify-between"
            >
                <p>
                {item.title.length > 10
                    ? `${item.title.slice(0, 10)}...`
                    : item.title}
                </p>
                <div className="flex items-center gap-x-2">
                <button onClick={() => removeCart(item.id)}>-</button>
                <p>{item.quantity}</p>
                <button onClick={() => addCart(item)}>+</button>
                </div>
                <p>${(item.price * item.quantity).toFixed(2)}</p>
            </li>
            ))}
        </ul>
        <div className="text-[0.9rem] text-neutral-900 font-medium flex justify-between border-t border-dashed border-neutral-400 pt-2">
            <p>Total Items:</p>
            <p>{totalItems}</p>
        </div>
        <div className="text-[0.9rem] text-neutral-900 font-medium flex justify-between">
            <p>Total Price:</p>
            <p>${totalPrice.toFixed(2)}</p>
        </div>
        </div>
    </div>
  );
}