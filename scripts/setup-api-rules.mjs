// Setup PocketBase API rules for public access
const BASE_URL = 'http://127.0.0.1:8090'

async function main() {
  // Get admin token
  console.log('Authenticating...')
  const authResponse = await fetch(`${BASE_URL}/api/admins/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: 'admin@facilitypro.sa',
      password: 'admin123456'
    })
  })

  const authData = await authResponse.json()
  const token = authData.token
  console.log('✓ Authenticated')

  // Get collections
  console.log('\nFetching collections...')
  const collectionsResponse = await fetch(`${BASE_URL}/api/collections`, {
    headers: { 'Authorization': token }
  })
  const collectionsData = await collectionsResponse.json()

  // Handle both array and object with items
  const collections = Array.isArray(collectionsData) ? collectionsData : collectionsData.items || []
  console.log(`Found ${collections.length} collections`)

  const targetCollections = ['properties', 'tenants', 'work_orders', 'employees', 'vendors', 'payments', 'canvases', 'leases']

  for (const collection of collections) {
    if (targetCollections.includes(collection.name)) {
      console.log(`Updating ${collection.name}...`)

      await fetch(`${BASE_URL}/api/collections/${collection.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listRule: '',  // Empty string = public access
          viewRule: '',
          createRule: '',
          updateRule: '',
          deleteRule: ''
        })
      })

      console.log(`  ✓ ${collection.name} - public access enabled`)
    }
  }

  // Verify public access
  console.log('\nVerifying public read access (no auth)...')

  for (const name of ['properties', 'tenants', 'work_orders']) {
    const response = await fetch(`${BASE_URL}/api/collections/${name}/records`)
    const data = await response.json()
    console.log(`  ${name}: ${data.totalItems} records`)
  }

  console.log('\n✓ Setup complete!')
}

main().catch(console.error)
