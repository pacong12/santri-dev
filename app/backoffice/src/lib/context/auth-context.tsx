'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setUnauthorizedHandler } from '../api-client';
import type { User, Membership } from '@org/domain-user';
import { TenantRole } from '@org/shared-enums';

interface AuthContextType {
  user: User | null;
  token: string | null;
  memberships: Membership[];
  activeTenantId: string | null;
  activeRole: TenantRole | null;
  isLoading: boolean;
  login: (token: string, user: User, memberships: Membership[]) => void;
  logout: () => void;
  switchTenant: (tenantId: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [activeTenantId, setActiveTenantId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<TenantRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load auth states from localStorage on mount
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedMemberships = localStorage.getItem('memberships');
    const savedActiveTenantId = localStorage.getItem('activeTenantId');

    if (savedToken && savedUser && savedMemberships) {
      try {
        const parsedUser = JSON.parse(savedUser);
        const parsedMemberships = JSON.parse(savedMemberships) as Membership[];
        
        setToken(savedToken);
        setUser(parsedUser);
        setMemberships(parsedMemberships);

        // Resolve active tenant ID
        let resolvedTenantId = savedActiveTenantId;
        if (!resolvedTenantId && parsedMemberships.length > 0) {
          resolvedTenantId = parsedMemberships[0].tenantId;
          localStorage.setItem('activeTenantId', resolvedTenantId);
        }
        setActiveTenantId(resolvedTenantId);

        // Resolve active role
        if (resolvedTenantId) {
          const activeMembership = parsedMemberships.find(m => m.tenantId === resolvedTenantId);
          setActiveRole(activeMembership ? activeMembership.role : null);
        }
      } catch (e) {
        console.error('Error loading auth from localStorage:', e);
        // If data is corrupt, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('memberships');
        localStorage.removeItem('activeTenantId');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User, newMemberships: Membership[]) => {
    setToken(newToken);
    setUser(newUser);
    setMemberships(newMemberships);

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('memberships', JSON.stringify(newMemberships));

    // Choose default active tenant
    if (newMemberships.length > 0) {
      const defaultTenantId = newMemberships[0].tenantId;
      setActiveTenantId(defaultTenantId);
      setActiveRole(newMemberships[0].role);
      localStorage.setItem('activeTenantId', defaultTenantId);
    } else {
      setActiveTenantId(null);
      setActiveRole(null);
      localStorage.removeItem('activeTenantId');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMemberships([]);
    setActiveTenantId(null);
    setActiveRole(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('memberships');
    localStorage.removeItem('activeTenantId');
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      router.push('/auth');
    });
  }, [router]);

  const switchTenant = (tenantId: string) => {
    const membership = memberships.find((m) => m.tenantId === tenantId);
    if (!membership) {
      console.warn(`No membership found for tenant ${tenantId}`);
      return;
    }
    setActiveTenantId(tenantId);
    setActiveRole(membership.role);
    localStorage.setItem('activeTenantId', tenantId);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        memberships,
        activeTenantId,
        activeRole,
        isLoading,
        login,
        logout,
        switchTenant,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
