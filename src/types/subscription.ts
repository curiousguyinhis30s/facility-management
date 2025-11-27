/**
 * Subscription Plans and Feature Access Control
 * Defines subscription tiers and their feature permissions
 */

export type SubscriptionPlan = 'free' | 'basic' | 'professional' | 'enterprise'

export interface SubscriptionFeatures {
  // Core Limits
  maxProperties: number
  maxTenants: number
  maxEmployees: number
  maxUnitsPerProperty: number

  // Module Access
  properties: boolean
  tenants: boolean
  leases: boolean
  payments: boolean
  maintenance: boolean
  workOrders: boolean
  facilities: boolean
  workforce: boolean
  reports: boolean

  // Advanced Features
  advancedReports: boolean
  exportData: boolean
  bulkOperations: boolean
  automation: boolean
  apiAccess: boolean
  customBranding: boolean
  multiUser: boolean
  prioritySupport: boolean

  // Integration Features
  paymentGateway: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  documentManagement: boolean
  calendar: boolean
  mobileApp: boolean
}

export interface Subscription {
  plan: SubscriptionPlan
  status: 'active' | 'cancelled' | 'past_due' | 'trial'
  startDate: Date
  endDate: Date
  trialEndsAt?: Date
  autoRenew: boolean
  features: SubscriptionFeatures
}

export interface PlanDetails {
  name: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  features: SubscriptionFeatures
  popular?: boolean
  description: string
}

// Plan Configurations
export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, PlanDetails> = {
  free: {
    name: 'Free',
    price: 0,
    currency: 'SAR',
    billingCycle: 'monthly',
    description: 'Perfect for getting started with basic property management',
    features: {
      maxProperties: 2,
      maxTenants: 10,
      maxEmployees: 2,
      maxUnitsPerProperty: 5,
      properties: true,
      tenants: true,
      leases: true,
      payments: false,
      maintenance: false,
      workOrders: false,
      facilities: false,
      workforce: false,
      reports: false,
      advancedReports: false,
      exportData: false,
      bulkOperations: false,
      automation: false,
      apiAccess: false,
      customBranding: false,
      multiUser: false,
      prioritySupport: false,
      paymentGateway: false,
      emailNotifications: true,
      smsNotifications: false,
      documentManagement: false,
      calendar: false,
      mobileApp: false,
    },
  },
  basic: {
    name: 'Basic',
    price: 299,
    currency: 'SAR',
    billingCycle: 'monthly',
    description: 'Essential features for small property managers',
    features: {
      maxProperties: 10,
      maxTenants: 100,
      maxEmployees: 5,
      maxUnitsPerProperty: 20,
      properties: true,
      tenants: true,
      leases: true,
      payments: true,
      maintenance: true,
      workOrders: true,
      facilities: false,
      workforce: false,
      reports: true,
      advancedReports: false,
      exportData: true,
      bulkOperations: true,
      automation: false,
      apiAccess: false,
      customBranding: false,
      multiUser: true,
      prioritySupport: false,
      paymentGateway: true,
      emailNotifications: true,
      smsNotifications: false,
      documentManagement: true,
      calendar: true,
      mobileApp: false,
    },
  },
  professional: {
    name: 'Professional',
    price: 799,
    currency: 'SAR',
    billingCycle: 'monthly',
    description: 'Advanced features for growing property management businesses',
    popular: true,
    features: {
      maxProperties: 50,
      maxTenants: 500,
      maxEmployees: 20,
      maxUnitsPerProperty: 100,
      properties: true,
      tenants: true,
      leases: true,
      payments: true,
      maintenance: true,
      workOrders: true,
      facilities: true,
      workforce: true,
      reports: true,
      advancedReports: true,
      exportData: true,
      bulkOperations: true,
      automation: true,
      apiAccess: false,
      customBranding: true,
      multiUser: true,
      prioritySupport: true,
      paymentGateway: true,
      emailNotifications: true,
      smsNotifications: true,
      documentManagement: true,
      calendar: true,
      mobileApp: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 1999,
    currency: 'SAR',
    billingCycle: 'monthly',
    description: 'Full-featured solution for large property management companies',
    features: {
      maxProperties: -1, // Unlimited
      maxTenants: -1, // Unlimited
      maxEmployees: -1, // Unlimited
      maxUnitsPerProperty: -1, // Unlimited
      properties: true,
      tenants: true,
      leases: true,
      payments: true,
      maintenance: true,
      workOrders: true,
      facilities: true,
      workforce: true,
      reports: true,
      advancedReports: true,
      exportData: true,
      bulkOperations: true,
      automation: true,
      apiAccess: true,
      customBranding: true,
      multiUser: true,
      prioritySupport: true,
      paymentGateway: true,
      emailNotifications: true,
      smsNotifications: true,
      documentManagement: true,
      calendar: true,
      mobileApp: true,
    },
  },
}

// Feature Display Names
export const FEATURE_LABELS: Record<keyof SubscriptionFeatures, string> = {
  maxProperties: 'Maximum Properties',
  maxTenants: 'Maximum Tenants',
  maxEmployees: 'Maximum Employees',
  maxUnitsPerProperty: 'Units per Property',
  properties: 'Properties Management',
  tenants: 'Tenants Management',
  leases: 'Lease Management',
  payments: 'Payment Processing',
  maintenance: 'Maintenance Tracking',
  workOrders: 'Work Orders',
  facilities: 'Facilities Management',
  workforce: 'Workforce Management',
  reports: 'Basic Reports',
  advancedReports: 'Advanced Analytics',
  exportData: 'Data Export (CSV/PDF)',
  bulkOperations: 'Bulk Operations',
  automation: 'Workflow Automation',
  apiAccess: 'API Access',
  customBranding: 'Custom Branding',
  multiUser: 'Multi-User Access',
  prioritySupport: '24/7 Priority Support',
  paymentGateway: 'Payment Gateway Integration',
  emailNotifications: 'Email Notifications',
  smsNotifications: 'SMS Notifications',
  documentManagement: 'Document Management',
  calendar: 'Calendar Integration',
  mobileApp: 'Mobile App Access',
}
