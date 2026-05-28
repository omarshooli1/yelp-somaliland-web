import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';

const cookieName = 'ys_admin_session';

const getAdminPassword = () => process.env.ADMIN_PASSWORD || '';

const getToken = () => {
  const password = getAdminPassword();
  if (!password) return '';
  return createHash('sha256').update(`ys-admin:${password}`).digest('hex');
};

export const isAdminConfigured = () => Boolean(getAdminPassword());

export const isAdminAuthenticated = async () => {
  const cookieStore = await cookies();
  return Boolean(getToken() && cookieStore.get(cookieName)?.value === getToken());
};

export const setAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, getToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8
  });
};

export const clearAdminSession = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
};

export const verifyAdminPassword = (password: string) => {
  return Boolean(getAdminPassword() && password === getAdminPassword());
};
