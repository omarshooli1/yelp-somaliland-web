'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminSupabase } from '@/lib/admin';
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword
} from './auth';

export const loginAdmin = async (formData: FormData) => {
  const password = String(formData.get('password') || '');

  if (!verifyAdminPassword(password)) {
    redirect('/admin?error=invalid');
  }

  await setAdminSession();
  redirect('/admin');
};

export const logoutAdmin = async () => {
  await clearAdminSession();
  redirect('/admin');
};

const requireAdmin = async () => {
  if (!await isAdminAuthenticated()) {
    redirect('/admin');
  }
};

export const updateVendorStatus = async (formData: FormData) => {
  await requireAdmin();
  if (!adminSupabase) return;

  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  const verified = formData.get('verified') === 'true';

  await adminSupabase.from('vendors').update({ status, verified }).eq('id', id);
  revalidatePath('/admin');
};

export const updateProductStatus = async (formData: FormData) => {
  await requireAdmin();
  if (!adminSupabase) return;

  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  const verifiedSeller = formData.get('verified_seller') === 'true';

  await adminSupabase.from('products').update({ status, verified_seller: verifiedSeller }).eq('id', id);
  revalidatePath('/admin');
};

export const verifyBusiness = async (formData: FormData) => {
  await requireAdmin();
  if (!adminSupabase) return;

  const id = String(formData.get('id'));
  const verified = formData.get('verified') === 'true';

  await adminSupabase.from('businesses').update({ verified }).eq('id', id);
  revalidatePath('/admin');
};

export const updateDeliveryStatus = async (formData: FormData) => {
  await requireAdmin();
  if (!adminSupabase) return;

  const id = String(formData.get('id'));
  const status = String(formData.get('status'));

  await adminSupabase.from('delivery_orders').update({ status }).eq('id', id);
  revalidatePath('/admin');
};

export const updateTaxiStatus = async (formData: FormData) => {
  await requireAdmin();
  if (!adminSupabase) return;

  const id = String(formData.get('id'));
  const status = String(formData.get('status'));

  await adminSupabase.from('taxi_rides').update({ status }).eq('id', id);
  revalidatePath('/admin');
};
