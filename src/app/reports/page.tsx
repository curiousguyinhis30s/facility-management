'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { formatCurrency } from '@/lib/utils'

export default function ReportsPage() {
  const [reportType, setReportType] = React.useState('financial')
  const [timeRange, setTimeRange] = React.useState('month')

  // Mock financial data
  const financialData = {
    revenue: {
      total: 485000,
      rent: 425000,
      lateFees: 15000,
      deposits: 45000,
      trend: '+12%',
    },
    expenses: {
      total: 185000,
      maintenance: 85000,
      utilities: 45000,
      salaries: 55000,
      trend: '+3%',
    },
    netIncome: 300000,
    occupancy: {
      rate: 94,
      total: 68,
      occupied: 64,
      vacant: 4,
    },
  }

  // Mock property performance
  const propertyPerformance = [
    { name: 'Sunset Apartments', revenue: 148000, expenses: 65000, occupancy: 92, roi: 12.5 },
    { name: 'Downtown Condos', revenue: 172000, expenses: 58000, occupancy: 100, roi: 15.2 },
    { name: 'Commerce Warehouse', revenue: 92000, expenses: 38000, occupancy: 75, roi: 8.1 },
    { name: 'Garden Houses', revenue: 73000, expenses: 24000, occupancy: 83, roi: 10.3 },
  ]

  // Mock monthly trends (last 6 months)
  const monthlyTrends = [
    { month: 'Jun', revenue: 465000, expenses: 178000 },
    { month: 'Jul', revenue: 472000, expenses: 182000 },
    { month: 'Aug', revenue: 468000, expenses: 175000 },
    { month: 'Sep', revenue: 478000, expenses: 180000 },
    { month: 'Oct', revenue: 482000, expenses: 183000 },
    { month: 'Nov', revenue: 485000, expenses: 185000 },
  ]

  return (
    <DashboardLayout
      title="Reports & Analytics"
      actions={
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
            className="w-40"
          />
          <Button variant="primary">
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export PDF
          </Button>
        </div>
      }
    >
      {/* Report Type Selector */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={reportType === 'financial' ? 'primary' : 'secondary'}
          onClick={() => setReportType('financial')}
        >
          Financial Overview
        </Button>
        <Button
          variant={reportType === 'occupancy' ? 'primary' : 'secondary'}
          onClick={() => setReportType('occupancy')}
        >
          Occupancy Analysis
        </Button>
        <Button
          variant={reportType === 'maintenance' ? 'primary' : 'secondary'}
          onClick={() => setReportType('maintenance')}
        >
          Maintenance Costs
        </Button>
        <Button
          variant={reportType === 'performance' ? 'primary' : 'secondary'}
          onClick={() => setReportType('performance')}
        >
          Property Performance
        </Button>
      </div>

      {/* Financial Overview Report */}
      {reportType === 'financial' && (
        <>
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500">Total Revenue</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {formatCurrency(financialData.revenue.total)}
                </div>
                <div className="mt-2 text-sm text-success">{financialData.revenue.trend} vs last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500">Total Expenses</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">
                  {formatCurrency(financialData.expenses.total)}
                </div>
                <div className="mt-2 text-sm text-warning">{financialData.expenses.trend} vs last month</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500">Net Income</div>
                <div className="mt-2 text-3xl font-semibold text-success">
                  {formatCurrency(financialData.netIncome)}
                </div>
                <div className="mt-2 text-sm text-success">
                  {((financialData.netIncome / financialData.revenue.total) * 100).toFixed(1)}% margin
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-sm text-gray-500">Occupancy Rate</div>
                <div className="mt-2 text-3xl font-semibold text-gray-900">{financialData.occupancy.rate}%</div>
                <div className="mt-2 text-sm text-gray-500">
                  {financialData.occupancy.occupied}/{financialData.occupancy.total} units
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Rent Payments</div>
                      <div className="text-sm text-gray-500">Regular monthly rent</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(financialData.revenue.rent)}</div>
                      <div className="text-sm text-gray-500">
                        {((financialData.revenue.rent / financialData.revenue.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Late Fees</div>
                      <div className="text-sm text-gray-500">Overdue payment penalties</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(financialData.revenue.lateFees)}</div>
                      <div className="text-sm text-gray-500">
                        {((financialData.revenue.lateFees / financialData.revenue.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Security Deposits</div>
                      <div className="text-sm text-gray-500">New tenant deposits</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(financialData.revenue.deposits)}</div>
                      <div className="text-sm text-gray-500">
                        {((financialData.revenue.deposits / financialData.revenue.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Maintenance</div>
                      <div className="text-sm text-gray-500">Repairs and upkeep</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(financialData.expenses.maintenance)}</div>
                      <div className="text-sm text-gray-500">
                        {((financialData.expenses.maintenance / financialData.expenses.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Utilities</div>
                      <div className="text-sm text-gray-500">Water, electricity, gas</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(financialData.expenses.utilities)}</div>
                      <div className="text-sm text-gray-500">
                        {((financialData.expenses.utilities / financialData.expenses.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Salaries & Wages</div>
                      <div className="text-sm text-gray-500">Staff compensation</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{formatCurrency(financialData.expenses.salaries)}</div>
                      <div className="text-sm text-gray-500">
                        {((financialData.expenses.salaries / financialData.expenses.total) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card>
            <CardHeader>
              <CardTitle>6-Month Revenue & Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="pb-3 text-left text-sm font-semibold text-gray-900">Month</th>
                      <th className="pb-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
                      <th className="pb-3 text-right text-sm font-semibold text-gray-900">Expenses</th>
                      <th className="pb-3 text-right text-sm font-semibold text-gray-900">Net Income</th>
                      <th className="pb-3 text-right text-sm font-semibold text-gray-900">Margin %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {monthlyTrends.map((month) => {
                      const netIncome = month.revenue - month.expenses
                      const margin = ((netIncome / month.revenue) * 100).toFixed(1)
                      return (
                        <tr key={month.month} className="hover:bg-gray-50">
                          <td className="py-4 text-sm font-medium text-gray-900">{month.month}</td>
                          <td className="py-4 text-right text-sm text-gray-900">{formatCurrency(month.revenue)}</td>
                          <td className="py-4 text-right text-sm text-gray-900">{formatCurrency(month.expenses)}</td>
                          <td className="py-4 text-right text-sm font-semibold text-success">{formatCurrency(netIncome)}</td>
                          <td className="py-4 text-right text-sm text-gray-600">{margin}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Property Performance Report */}
      {reportType === 'performance' && (
        <Card>
          <CardHeader>
            <CardTitle>Property Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-900">Property</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Expenses</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Net Income</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">Occupancy</th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-900">ROI %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {propertyPerformance.map((property) => {
                    const netIncome = property.revenue - property.expenses
                    return (
                      <tr key={property.name} className="hover:bg-gray-50">
                        <td className="py-4 text-sm font-medium text-gray-900">{property.name}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{formatCurrency(property.revenue)}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{formatCurrency(property.expenses)}</td>
                        <td className="py-4 text-right text-sm font-semibold text-success">{formatCurrency(netIncome)}</td>
                        <td className="py-4 text-right text-sm text-gray-600">{property.occupancy}%</td>
                        <td className="py-4 text-right text-sm font-semibold text-gray-900">{property.roi}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placeholder for other report types */}
      {(reportType === 'occupancy' || reportType === 'maintenance') && (
        <Card>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h3>
              <p className="mt-2 text-sm text-gray-500">This report is under development</p>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
