import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

// Sample data for seeding
const properties = [
  {
    name: 'Sunset Apartments',
    address: '123 Sunset Boulevard',
    city: 'Riyadh',
    state: 'Riyadh Province',
    zipCode: '11564',
    type: 'apartment',
    totalUnits: 24,
    occupiedUnits: 22,
    monthlyRevenue: 48000,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
  },
  {
    name: 'Downtown Condos',
    address: '456 King Fahd Road',
    city: 'Riyadh',
    state: 'Riyadh Province',
    zipCode: '11432',
    type: 'condo',
    totalUnits: 18,
    occupiedUnits: 18,
    monthlyRevenue: 72000,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
  },
  {
    name: 'Commerce Warehouse',
    address: '789 Industrial Zone',
    city: 'Dammam',
    state: 'Eastern Province',
    zipCode: '31411',
    type: 'warehouse',
    totalUnits: 8,
    occupiedUnits: 6,
    monthlyRevenue: 32000,
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
  },
  {
    name: 'Retail Plaza',
    address: '321 Olaya Street',
    city: 'Riyadh',
    state: 'Riyadh Province',
    zipCode: '11523',
    type: 'shoplot',
    totalUnits: 12,
    occupiedUnits: 10,
    monthlyRevenue: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
  },
  {
    name: 'Garden Houses',
    address: '654 Palm Avenue',
    city: 'Jeddah',
    state: 'Makkah Province',
    zipCode: '21577',
    type: 'house',
    totalUnits: 6,
    occupiedUnits: 5,
    monthlyRevenue: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  },
]

const tenants = [
  {
    name: 'Ahmed Al-Rahman',
    email: 'ahmed.rahman@email.sa',
    phone: '+966 50 123 4567',
    unit: '101',
    monthlyRent: 2200,
    balance: 0,
    status: 'active',
    emergencyContact: 'Fatima Al-Rahman',
    emergencyPhone: '+966 55 987 6543',
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+Rahman&background=2563EB&color=fff',
  },
  {
    name: 'Nora Al-Saud',
    email: 'nora.saud@email.sa',
    phone: '+966 55 234 5678',
    unit: '102',
    monthlyRent: 2500,
    balance: 500,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Nora+Saud&background=10B981&color=fff',
  },
  {
    name: 'Mohammed Al-Faisal',
    email: 'mohammed.faisal@email.sa',
    phone: '+966 50 345 6789',
    unit: '201',
    monthlyRent: 2800,
    balance: 0,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Mohammed+Faisal&background=F59E0B&color=fff',
  },
  {
    name: 'Sara Al-Qahtani',
    email: 'sara.qahtani@email.sa',
    phone: '+966 55 456 7890',
    unit: '202',
    monthlyRent: 2200,
    balance: 4400,
    status: 'pending',
    avatar: 'https://ui-avatars.com/api/?name=Sara+Qahtani&background=EF4444&color=fff',
  },
  {
    name: 'Khalid Al-Harbi',
    email: 'khalid.harbi@email.sa',
    phone: '+966 50 567 8901',
    unit: '301',
    monthlyRent: 3000,
    balance: 0,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Khalid+Harbi&background=8B5CF6&color=fff',
  },
  {
    name: 'Layla Al-Mutairi',
    email: 'layla.mutairi@email.sa',
    phone: '+966 55 678 9012',
    unit: '302',
    monthlyRent: 2600,
    balance: 0,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Layla+Mutairi&background=EC4899&color=fff',
  },
  {
    name: 'Omar Al-Zahrani',
    email: 'omar.zahrani@email.sa',
    phone: '+966 50 789 0123',
    unit: '401',
    monthlyRent: 2400,
    balance: 2400,
    status: 'expired',
    avatar: 'https://ui-avatars.com/api/?name=Omar+Zahrani&background=6366F1&color=fff',
  },
  {
    name: 'Fatima Al-Rashid',
    email: 'fatima.rashid@email.sa',
    phone: '+966 55 890 1234',
    unit: '402',
    monthlyRent: 2700,
    balance: 0,
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Fatima+Rashid&background=14B8A6&color=fff',
  },
]

const workOrders = [
  {
    title: 'AC Not Cooling',
    description: 'Air conditioning unit in bedroom not cooling properly. Needs inspection and possible repair.',
    unit: '101',
    category: 'hvac',
    priority: 'high',
    status: 'open',
    assignedTo: 'Ahmed Technical Services',
    reportedBy: 'Ahmed Al-Rahman',
    estimatedCost: 500,
  },
  {
    title: 'Leaking Faucet',
    description: 'Kitchen faucet has been dripping for 3 days. Water wastage concern.',
    unit: '202',
    category: 'plumbing',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'Mohammed Plumbing',
    reportedBy: 'Sara Al-Qahtani',
    estimatedCost: 150,
  },
  {
    title: 'Electrical Outlet Sparking',
    description: 'Living room outlet sparks when plugging in appliances. Safety hazard.',
    unit: '301',
    category: 'electrical',
    priority: 'urgent',
    status: 'open',
    assignedTo: 'Elite Electrical Co.',
    reportedBy: 'Khalid Al-Harbi',
    estimatedCost: 300,
  },
  {
    title: 'Dishwasher Not Draining',
    description: 'Dishwasher leaves standing water after cycle. May be clogged drain.',
    unit: '102',
    category: 'appliance',
    priority: 'low',
    status: 'completed',
    assignedTo: 'Appliance Masters',
    reportedBy: 'Nora Al-Saud',
    estimatedCost: 200,
    actualCost: 175,
  },
  {
    title: 'Broken Window Seal',
    description: 'Bedroom window seal is broken, causing draft and dust entry.',
    unit: '401',
    category: 'structural',
    priority: 'medium',
    status: 'open',
    reportedBy: 'Omar Al-Zahrani',
    estimatedCost: 400,
  },
  {
    title: 'Water Heater Replacement',
    description: 'Water heater is 15 years old and needs replacement. Tenant reporting lukewarm water.',
    unit: '201',
    category: 'plumbing',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'Saudi Plumbing Solutions',
    reportedBy: 'Mohammed Al-Faisal',
    estimatedCost: 2500,
  },
]

const employees = [
  {
    name: 'Abdullah Al-Farsi',
    email: 'abdullah.farsi@facilitypro.sa',
    phone: '+966 50 111 2222',
    role: 'Property Manager',
    department: 'Operations',
    status: 'active',
    hireDate: '2023-01-15',
    salary: 15000,
    assignedProperties: ['Sunset Apartments', 'Downtown Condos'],
    avatar: 'https://ui-avatars.com/api/?name=Abdullah+Farsi&background=171717&color=fff',
  },
  {
    name: 'Maryam Al-Dosari',
    email: 'maryam.dosari@facilitypro.sa',
    phone: '+966 55 333 4444',
    role: 'Maintenance Supervisor',
    department: 'Maintenance',
    status: 'active',
    hireDate: '2023-03-01',
    salary: 12000,
    skills: ['HVAC', 'Plumbing', 'Electrical'],
    avatar: 'https://ui-avatars.com/api/?name=Maryam+Dosari&background=22C55E&color=fff',
  },
  {
    name: 'Yousef Al-Otaibi',
    email: 'yousef.otaibi@facilitypro.sa',
    phone: '+966 50 555 6666',
    role: 'Electrician',
    department: 'Maintenance',
    status: 'active',
    hireDate: '2023-06-10',
    salary: 8000,
    skills: ['Electrical', 'Solar Panels'],
    certifications: ['Licensed Electrician', 'Safety Training'],
    avatar: 'https://ui-avatars.com/api/?name=Yousef+Otaibi&background=F59E0B&color=fff',
  },
  {
    name: 'Noura Al-Qahtani',
    email: 'noura.qahtani@facilitypro.sa',
    phone: '+966 55 777 8888',
    role: 'Accountant',
    department: 'Finance',
    status: 'active',
    hireDate: '2022-11-01',
    salary: 13000,
    avatar: 'https://ui-avatars.com/api/?name=Noura+Qahtani&background=8B5CF6&color=fff',
  },
  {
    name: 'Faisal Al-Harbi',
    email: 'faisal.harbi@facilitypro.sa',
    phone: '+966 50 999 0000',
    role: 'Plumber',
    department: 'Maintenance',
    status: 'on_leave',
    hireDate: '2023-08-01',
    salary: 7500,
    skills: ['Plumbing', 'Pipe Fitting'],
    avatar: 'https://ui-avatars.com/api/?name=Faisal+Harbi&background=EF4444&color=fff',
  },
]

const vendors = [
  {
    name: 'Saudi HVAC Specialists',
    type: 'HVAC Services',
    contact: 'Ali Hassan',
    phone: '+966 11 234 5678',
    email: 'info@saudihvac.sa',
    status: 'active',
    monthlyRate: 5000,
  },
  {
    name: 'Green Landscape Co.',
    type: 'Landscaping',
    contact: 'Ibrahim Al-Zahrani',
    phone: '+966 12 345 6789',
    email: 'contact@greenlandscape.sa',
    status: 'active',
    monthlyRate: 3500,
  },
  {
    name: 'Elite Cleaning Services',
    type: 'Cleaning',
    contact: 'Maha Al-Qahtani',
    phone: '+966 13 456 7890',
    email: 'service@eliteclean.sa',
    status: 'active',
    monthlyRate: 4200,
  },
  {
    name: 'SafeGuard Security',
    type: 'Security',
    contact: 'Nasser Al-Dosari',
    phone: '+966 14 567 8901',
    email: 'info@safeguard.sa',
    status: 'active',
    monthlyRate: 8000,
  },
]

const payments = [
  {
    unit: '101',
    amount: 2200,
    type: 'rent',
    method: 'bank_transfer',
    status: 'completed',
    dueDate: '2025-11-01',
    paidDate: '2025-11-01',
    receiptNumber: 'RCP-2025-001',
  },
  {
    unit: '102',
    amount: 2500,
    type: 'rent',
    method: 'cash',
    status: 'completed',
    dueDate: '2025-11-01',
    paidDate: '2025-11-03',
    receiptNumber: 'RCP-2025-002',
  },
  {
    unit: '201',
    amount: 2800,
    type: 'rent',
    method: 'bank_transfer',
    status: 'pending',
    dueDate: '2025-11-01',
  },
  {
    unit: '202',
    amount: 500,
    type: 'late_fee',
    method: 'bank_transfer',
    status: 'overdue',
    dueDate: '2025-10-15',
  },
  {
    unit: '301',
    amount: 6000,
    type: 'security_deposit',
    method: 'bank_transfer',
    status: 'completed',
    dueDate: '2024-12-28',
    paidDate: '2024-12-28',
    receiptNumber: 'RCP-2024-089',
  },
]

async function seedDatabase() {
  console.log('Starting database seeding...')

  try {
    // Authenticate as admin
    await pb.admins.authWithPassword('admin@facilitypro.sa', 'admin123456')
    console.log('Authenticated as admin')

    // Seed Properties
    console.log('Seeding properties...')
    const createdProperties: Record<string, string> = {}
    for (const property of properties) {
      try {
        const record = await pb.collection('properties').create(property)
        createdProperties[property.name] = record.id
        console.log(`  Created property: ${property.name}`)
      } catch (e) {
        console.log(`  Property ${property.name} may already exist, skipping...`)
      }
    }

    // Seed Tenants (linked to first property)
    console.log('Seeding tenants...')
    const firstPropertyId = Object.values(createdProperties)[0]
    const createdTenants: Record<string, string> = {}
    for (const tenant of tenants) {
      try {
        const tenantData = {
          ...tenant,
          property: firstPropertyId,
          leaseStart: '2024-01-01',
          leaseEnd: '2025-12-31',
        }
        const record = await pb.collection('tenants').create(tenantData)
        createdTenants[tenant.name] = record.id
        console.log(`  Created tenant: ${tenant.name}`)
      } catch (e) {
        console.log(`  Tenant ${tenant.name} may already exist, skipping...`)
      }
    }

    // Seed Work Orders
    console.log('Seeding work orders...')
    for (const workOrder of workOrders) {
      try {
        const workOrderData = {
          ...workOrder,
          property: firstPropertyId,
        }
        await pb.collection('work_orders').create(workOrderData)
        console.log(`  Created work order: ${workOrder.title}`)
      } catch (e) {
        console.log(`  Work order ${workOrder.title} may already exist, skipping...`)
      }
    }

    // Seed Employees
    console.log('Seeding employees...')
    for (const employee of employees) {
      try {
        const employeeData = {
          ...employee,
          skills: JSON.stringify(employee.skills || []),
          certifications: JSON.stringify(employee.certifications || []),
          assignedProperties: JSON.stringify(employee.assignedProperties || []),
        }
        await pb.collection('employees').create(employeeData)
        console.log(`  Created employee: ${employee.name}`)
      } catch (e) {
        console.log(`  Employee ${employee.name} may already exist, skipping...`)
      }
    }

    // Seed Vendors
    console.log('Seeding vendors...')
    for (const vendor of vendors) {
      try {
        await pb.collection('vendors').create(vendor)
        console.log(`  Created vendor: ${vendor.name}`)
      } catch (e) {
        console.log(`  Vendor ${vendor.name} may already exist, skipping...`)
      }
    }

    // Seed Payments
    console.log('Seeding payments...')
    const firstTenantId = Object.values(createdTenants)[0]
    for (const payment of payments) {
      try {
        const paymentData = {
          ...payment,
          tenant: firstTenantId,
          property: firstPropertyId,
        }
        await pb.collection('payments').create(paymentData)
        console.log(`  Created payment: ${payment.type} - ${payment.amount}`)
      } catch (e) {
        console.log(`  Payment may already exist, skipping...`)
      }
    }

    console.log('\nSeeding completed successfully!')
  } catch (error) {
    console.error('Seeding error:', error)
  }
}

seedDatabase()
