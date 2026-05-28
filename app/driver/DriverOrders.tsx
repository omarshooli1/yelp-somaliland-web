'use client';

import { FormEvent, useState } from 'react';
import { acceptDeliveryOrder } from '@/lib/delivery';
import type { DeliveryOrder } from '@/lib/types';

type DriverOrdersProps = {
  orders: DeliveryOrder[];
};

export function DriverOrders({ orders }: DriverOrdersProps) {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [acceptedOrders, setAcceptedOrders] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState('');

  const acceptOrder = async (event: FormEvent<HTMLFormElement>, orderId: string) => {
    event.preventDefault();
    setMessage('');

    if (!driverName.trim() || !driverPhone.trim()) {
      setMessage('Add driver name and phone first.');
      return;
    }

    try {
      await acceptDeliveryOrder({
        orderId,
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim()
      });
      setAcceptedOrders((current) => ({ ...current, [orderId]: true }));
      setMessage('Order accepted. Contact the restaurant and customer to coordinate pickup.');
    } catch (error) {
      setMessage('Could not accept order. It may already be taken.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-xl font-black">Driver check-in</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            value={driverName}
            onChange={(event) => setDriverName(event.target.value)}
            placeholder="Driver name"
            className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
          <input
            value={driverPhone}
            onChange={(event) => setDriverPhone(event.target.value)}
            placeholder="Driver phone"
            className="rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
        </div>
        {message && <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700">{message}</p>}
      </div>

      {orders.map((order) => {
        const business = order.businesses;
        const restaurantMapUrl = business?.latitude && business.longitude
          ? `https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=16/${business.latitude}/${business.longitude}`
          : null;
        const customerMapUrl = order.delivery_latitude && order.delivery_longitude
          ? `https://www.openstreetmap.org/?mlat=${order.delivery_latitude}&mlon=${order.delivery_longitude}#map=16/${order.delivery_latitude}/${order.delivery_longitude}`
          : null;

        return (
          <article key={order.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-brand-green">{order.status}</p>
                <h3 className="mt-1 text-xl font-black">{business?.name || 'Restaurant order'}</h3>
                <p className="mt-1 text-sm text-slate-500">{business?.address || order.business_id}</p>
              </div>
              <div className="rounded-2xl bg-brand-red px-4 py-3 text-center text-white">
                <div className="text-lg font-black">${Number(order.total_usd).toFixed(2)}</div>
                <div className="text-xs font-bold uppercase">total</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4">
              <p className="font-bold">Deliver to {order.customer_name}</p>
              <p className="mt-1 text-sm text-slate-600">{order.delivery_address}</p>
              <p className="mt-1 text-sm text-slate-600">{order.customer_phone}</p>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              {order.items.map((item) => (
                <div key={`${order.id}-${item.menu_item_id}`} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <strong>${(item.quantity * item.price_usd).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <form onSubmit={(event) => acceptOrder(event, order.id)} className="mt-5 flex flex-wrap gap-2">
              {restaurantMapUrl && <a href={restaurantMapUrl} target="_blank" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">Restaurant map</a>}
              {customerMapUrl && <a href={customerMapUrl} target="_blank" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">Customer map</a>}
              <button
                type="submit"
                disabled={acceptedOrders[order.id] || order.status !== 'open'}
                className="rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white disabled:bg-slate-300"
              >
                {acceptedOrders[order.id] || order.status !== 'open' ? 'Accepted' : 'Accept order'}
              </button>
            </form>
          </article>
        );
      })}

      {!orders.length && (
        <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-slate-200">
          <h2 className="text-xl font-black">No open orders</h2>
          <p className="mt-2 text-slate-600">New restaurant orders will appear here for drivers.</p>
        </div>
      )}
    </div>
  );
}
