'use client'

import { useState, useEffect, useCallback } from 'react'
import * as pb from '@/lib/pocketbase-client'

export interface PocketBaseData {
  properties: pb.PropertyRecord[]
  tenants: pb.TenantRecord[]
  workOrders: pb.WorkOrderRecord[]
  employees: pb.EmployeeRecord[]
  vendors: pb.VendorRecord[]
  payments: pb.PaymentRecord[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePocketBase(): PocketBaseData {
  const [properties, setProperties] = useState<pb.PropertyRecord[]>([])
  const [tenants, setTenants] = useState<pb.TenantRecord[]>([])
  const [workOrders, setWorkOrders] = useState<pb.WorkOrderRecord[]>([])
  const [employees, setEmployees] = useState<pb.EmployeeRecord[]>([])
  const [vendors, setVendors] = useState<pb.VendorRecord[]>([])
  const [payments, setPayments] = useState<pb.PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if PocketBase is available
      const isHealthy = await pb.checkHealth()
      if (!isHealthy) {
        throw new Error('PocketBase server is not available')
      }

      // Fetch all data in parallel
      const [
        propertiesData,
        tenantsData,
        workOrdersData,
        employeesData,
        vendorsData,
        paymentsData,
      ] = await Promise.all([
        pb.getAll<pb.PropertyRecord>(pb.Collections.PROPERTIES),
        pb.getAll<pb.TenantRecord>(pb.Collections.TENANTS),
        pb.getAll<pb.WorkOrderRecord>(pb.Collections.WORK_ORDERS),
        pb.getAll<pb.EmployeeRecord>(pb.Collections.EMPLOYEES),
        pb.getAll<pb.VendorRecord>(pb.Collections.VENDORS),
        pb.getAll<pb.PaymentRecord>(pb.Collections.PAYMENTS),
      ])

      setProperties(propertiesData)
      setTenants(tenantsData)
      setWorkOrders(workOrdersData)
      setEmployees(employeesData)
      setVendors(vendorsData)
      setPayments(paymentsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
      console.error('PocketBase fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    properties,
    tenants,
    workOrders,
    employees,
    vendors,
    payments,
    isLoading,
    error,
    refetch: fetchData,
  }
}

// Individual collection hooks for more granular usage
export function useProperties() {
  const [data, setData] = useState<pb.PropertyRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pb.getAll<pb.PropertyRecord>(pb.Collections.PROPERTIES)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}

export function useTenants() {
  const [data, setData] = useState<pb.TenantRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pb.getAll<pb.TenantRecord>(pb.Collections.TENANTS)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}

export function useWorkOrders() {
  const [data, setData] = useState<pb.WorkOrderRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pb.getAll<pb.WorkOrderRecord>(pb.Collections.WORK_ORDERS)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}

export function useEmployees() {
  const [data, setData] = useState<pb.EmployeeRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pb.getAll<pb.EmployeeRecord>(pb.Collections.EMPLOYEES)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}

export function useVendors() {
  const [data, setData] = useState<pb.VendorRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    pb.getAll<pb.VendorRecord>(pb.Collections.VENDORS)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}
