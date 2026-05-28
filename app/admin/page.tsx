import Link from 'next/link';
import { getAdminDashboardData } from '@/lib/admin';
import { isAdminAuthenticated, isAdminConfigured } from './auth';
import {
  loginAdmin,
  logoutAdmin,
  updateDeliveryStatus,
  updateProductStatus,
  updateTaxiStatus,
  updateVendorStatus,
  verifyBusiness
} from './actions';

type AdminPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
    <p className="text-sm font-bold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-2 text-3xl font-black text-brand-ink">{value}</p>
  </div>
);

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const configured = isAdminConfigured();
  const authenticated = await isAdminAuthenticated();

  if (!configured) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-black">Admin setup needed</h1>
          <p className="mt-3 text-slate-600">
            Add an `ADMIN_PASSWORD` environment variable in Vercel, then redeploy.
          </p>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <form action={loginAdmin} className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-3xl font-black">Admin login</h1>
          <p className="mt-3 text-slate-600">Enter your admin password to manage the platform.</p>
          {params.error === 'invalid' && (
            <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm font-bold text-brand-red">
              Invalid password.
            </p>
          )}
          <input
            name="password"
            type="password"
            placeholder="Admin password"
            className="mt-6 w-full rounded-2xl bg-slate-50 px-4 py-3 outline-none ring-1 ring-slate-200 focus:ring-brand-red"
          />
          <button className="mt-4 w-full rounded-2xl bg-brand-red px-5 py-4 font-black text-white">
            Login
          </button>
        </form>
      </main>
    );
  }

  const data = await getAdminDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-green">Admin</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Platform dashboard</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            Approve vendors, verify businesses, moderate products, and monitor taxi and delivery activity.
          </p>
        </div>
        <form action={logoutAdmin}>
          <button className="rounded-full bg-brand-ink px-5 py-3 text-sm font-bold text-white">Logout</button>
        </form>
      </div>

      {data.usingDemoData && (
        <div className="mb-6 rounded-3xl bg-yellow-50 p-5 text-sm font-bold text-yellow-900 ring-1 ring-yellow-200">
          Admin is showing demo data because Supabase service role is not configured.
        </div>
      )}

      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Businesses" value={data.businesses.length} />
        <StatCard label="Vendors" value={data.vendors.length} />
        <StatCard label="Products" value={data.products.length} />
        <StatCard label="Delivery Orders" value={data.deliveryOrders.length} />
        <StatCard label="Taxi Rides" value={data.taxiRides.length} />
      </section>

      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-black">Vendors</h2>
          <div className="mt-5 space-y-4">
            {data.vendors.map((vendor) => (
              <div key={vendor.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link href={`/vendors/${vendor.id}`} className="font-black hover:text-brand-red">{vendor.vendor_name}</Link>
                    <p className="text-sm text-slate-500">{vendor.owner_name} · {vendor.phone}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-slate-400">{vendor.status} · {vendor.verified ? 'verified' : 'not verified'}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={updateVendorStatus}>
                    <input type="hidden" name="id" value={vendor.id} />
                    <input type="hidden" name="status" value="active" />
                    <input type="hidden" name="verified" value="true" />
                    <button className="rounded-full bg-brand-green px-3 py-1.5 text-xs font-bold text-white">Approve</button>
                  </form>
                  <form action={updateVendorStatus}>
                    <input type="hidden" name="id" value={vendor.id} />
                    <input type="hidden" name="status" value="paused" />
                    <input type="hidden" name="verified" value="false" />
                    <button className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold">Pause</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-black">Products</h2>
          <div className="mt-5 space-y-4">
            {data.products.map((product) => (
              <div key={product.id} className="rounded-2xl bg-slate-50 p-4">
                <Link href={`/marketplace/${product.id}`} className="font-black hover:text-brand-red">{product.title}</Link>
                <p className="text-sm text-slate-500">{product.seller_name} · ${product.price_usd.toFixed(2)}</p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-400">{product.status} · {product.verified_seller ? 'verified seller' : 'unverified seller'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={updateProductStatus}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="status" value="active" />
                    <input type="hidden" name="verified_seller" value="true" />
                    <button className="rounded-full bg-brand-green px-3 py-1.5 text-xs font-bold text-white">Approve</button>
                  </form>
                  <form action={updateProductStatus}>
                    <input type="hidden" name="id" value={product.id} />
                    <input type="hidden" name="status" value="removed" />
                    <input type="hidden" name="verified_seller" value="false" />
                    <button className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold">Remove</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-black">Businesses</h2>
          <div className="mt-5 space-y-4">
            {data.businesses.map((business) => (
              <div key={business.id} className="rounded-2xl bg-slate-50 p-4">
                <Link href={`/businesses/${business.id}`} className="font-black hover:text-brand-red">{business.name}</Link>
                <p className="text-sm text-slate-500">{business.category} · {business.city}</p>
                <p className="mt-1 text-xs font-bold uppercase text-slate-400">{business.verified ? 'verified' : 'not verified'}</p>
                <form action={verifyBusiness} className="mt-3">
                  <input type="hidden" name="id" value={business.id} />
                  <input type="hidden" name="verified" value={business.verified ? 'false' : 'true'} />
                  <button className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold">
                    {business.verified ? 'Unverify' : 'Verify'}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-black">Operations</h2>
          <div className="mt-5 space-y-4">
            {data.deliveryOrders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">Delivery: {order.customer_name}</p>
                <p className="text-sm text-slate-500">{order.delivery_address} · ${order.total_usd.toFixed(2)}</p>
                <form action={updateDeliveryStatus} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={order.id} />
                  <select name="status" defaultValue={order.status} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold">
                    <option value="open">open</option>
                    <option value="accepted">accepted</option>
                    <option value="picked_up">picked up</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold">Update</button>
                </form>
              </div>
            ))}

            {data.taxiRides.map((ride) => (
              <div key={ride.id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-black">Taxi: {ride.customer_name}</p>
                <p className="text-sm text-slate-500">{ride.pickup_address} → {ride.dropoff_address}</p>
                <form action={updateTaxiStatus} className="mt-3 flex gap-2">
                  <input type="hidden" name="id" value={ride.id} />
                  <select name="status" defaultValue={ride.status} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold">
                    <option value="open">open</option>
                    <option value="accepted">accepted</option>
                    <option value="arrived">arrived</option>
                    <option value="in_progress">in progress</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button className="rounded-full bg-slate-200 px-3 py-1.5 text-xs font-bold">Update</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
