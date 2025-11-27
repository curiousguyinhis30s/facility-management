#!/bin/bash
# Seed script for FacilityPro PocketBase

BASE_URL="http://127.0.0.1:8090"

# Get admin token
echo "Authenticating..."
TOKEN=$(curl -s $BASE_URL/api/admins/auth-with-password -X POST -H "Content-Type: application/json" -d '{"identity":"admin@facilitypro.sa","password":"admin123456"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "Failed to get auth token"
    exit 1
fi
echo "✓ Authenticated"

# Function to create record
create_record() {
    local collection=$1
    local data=$2
    curl -s "$BASE_URL/api/collections/$collection/records" -X POST \
        -H "Authorization: $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$data" > /dev/null
}

echo -e "\nSeeding properties..."
PROP1=$(curl -s "$BASE_URL/api/collections/properties/records" -X POST \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"Sunset Apartments","address":"123 Sunset Boulevard","city":"Riyadh","state":"Riyadh Province","zipCode":"11564","type":"apartment","totalUnits":24,"occupiedUnits":22,"monthlyRevenue":48000,"imageUrl":"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}' | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "  Created: Sunset Apartments ($PROP1)"

create_record "properties" '{"name":"Downtown Condos","address":"456 King Fahd Road","city":"Riyadh","state":"Riyadh Province","zipCode":"11432","type":"condo","totalUnits":18,"occupiedUnits":18,"monthlyRevenue":72000,"imageUrl":"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"}'
echo "  Created: Downtown Condos"

create_record "properties" '{"name":"Commerce Warehouse","address":"789 Industrial Zone","city":"Dammam","state":"Eastern Province","zipCode":"31411","type":"warehouse","totalUnits":8,"occupiedUnits":6,"monthlyRevenue":32000,"imageUrl":"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800"}'
echo "  Created: Commerce Warehouse"

create_record "properties" '{"name":"Retail Plaza","address":"321 Olaya Street","city":"Riyadh","state":"Riyadh Province","zipCode":"11523","type":"shoplot","totalUnits":12,"occupiedUnits":10,"monthlyRevenue":45000,"imageUrl":"https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"}'
echo "  Created: Retail Plaza"

create_record "properties" '{"name":"Garden Houses","address":"654 Palm Avenue","city":"Jeddah","state":"Makkah Province","zipCode":"21577","type":"house","totalUnits":6,"occupiedUnits":5,"monthlyRevenue":18000,"imageUrl":"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"}'
echo "  Created: Garden Houses"

echo -e "\nSeeding tenants..."
TENANT1=$(curl -s "$BASE_URL/api/collections/tenants/records" -X POST \
    -H "Authorization: $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Ahmed Al-Rahman\",\"email\":\"ahmed.rahman@email.sa\",\"phone\":\"+966 50 123 4567\",\"property\":\"$PROP1\",\"unit\":\"101\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2200,\"balance\":0,\"status\":\"active\",\"emergencyContact\":\"Fatima Al-Rahman\",\"emergencyPhone\":\"+966 55 987 6543\",\"avatar\":\"https://ui-avatars.com/api/?name=Ahmed+Rahman&background=2563EB&color=fff\"}" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "  Created: Ahmed Al-Rahman ($TENANT1)"

create_record "tenants" "{\"name\":\"Nora Al-Saud\",\"email\":\"nora.saud@email.sa\",\"phone\":\"+966 55 234 5678\",\"property\":\"$PROP1\",\"unit\":\"102\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2500,\"balance\":500,\"status\":\"active\",\"avatar\":\"https://ui-avatars.com/api/?name=Nora+Saud&background=10B981&color=fff\"}"
echo "  Created: Nora Al-Saud"

create_record "tenants" "{\"name\":\"Mohammed Al-Faisal\",\"email\":\"mohammed.faisal@email.sa\",\"phone\":\"+966 50 345 6789\",\"property\":\"$PROP1\",\"unit\":\"201\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2800,\"balance\":0,\"status\":\"active\",\"avatar\":\"https://ui-avatars.com/api/?name=Mohammed+Faisal&background=F59E0B&color=fff\"}"
echo "  Created: Mohammed Al-Faisal"

create_record "tenants" "{\"name\":\"Sara Al-Qahtani\",\"email\":\"sara.qahtani@email.sa\",\"phone\":\"+966 55 456 7890\",\"property\":\"$PROP1\",\"unit\":\"202\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2200,\"balance\":4400,\"status\":\"pending\",\"avatar\":\"https://ui-avatars.com/api/?name=Sara+Qahtani&background=EF4444&color=fff\"}"
echo "  Created: Sara Al-Qahtani"

create_record "tenants" "{\"name\":\"Khalid Al-Harbi\",\"email\":\"khalid.harbi@email.sa\",\"phone\":\"+966 50 567 8901\",\"property\":\"$PROP1\",\"unit\":\"301\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":3000,\"balance\":0,\"status\":\"active\",\"avatar\":\"https://ui-avatars.com/api/?name=Khalid+Harbi&background=8B5CF6&color=fff\"}"
echo "  Created: Khalid Al-Harbi"

create_record "tenants" "{\"name\":\"Layla Al-Mutairi\",\"email\":\"layla.mutairi@email.sa\",\"phone\":\"+966 55 678 9012\",\"property\":\"$PROP1\",\"unit\":\"302\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2600,\"balance\":0,\"status\":\"active\",\"avatar\":\"https://ui-avatars.com/api/?name=Layla+Mutairi&background=EC4899&color=fff\"}"
echo "  Created: Layla Al-Mutairi"

create_record "tenants" "{\"name\":\"Omar Al-Zahrani\",\"email\":\"omar.zahrani@email.sa\",\"phone\":\"+966 50 789 0123\",\"property\":\"$PROP1\",\"unit\":\"401\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2400,\"balance\":2400,\"status\":\"expired\",\"avatar\":\"https://ui-avatars.com/api/?name=Omar+Zahrani&background=6366F1&color=fff\"}"
echo "  Created: Omar Al-Zahrani"

create_record "tenants" "{\"name\":\"Fatima Al-Rashid\",\"email\":\"fatima.rashid@email.sa\",\"phone\":\"+966 55 890 1234\",\"property\":\"$PROP1\",\"unit\":\"402\",\"leaseStart\":\"2024-01-01\",\"leaseEnd\":\"2025-12-31\",\"monthlyRent\":2700,\"balance\":0,\"status\":\"active\",\"avatar\":\"https://ui-avatars.com/api/?name=Fatima+Rashid&background=14B8A6&color=fff\"}"
echo "  Created: Fatima Al-Rashid"

echo -e "\nSeeding work orders..."
create_record "work_orders" "{\"title\":\"AC Not Cooling\",\"description\":\"Air conditioning unit in bedroom not cooling properly. Needs inspection and possible repair.\",\"property\":\"$PROP1\",\"unit\":\"101\",\"category\":\"hvac\",\"priority\":\"high\",\"status\":\"open\",\"assignedTo\":\"Ahmed Technical Services\",\"reportedBy\":\"Ahmed Al-Rahman\",\"estimatedCost\":500}"
echo "  Created: AC Not Cooling"

create_record "work_orders" "{\"title\":\"Leaking Faucet\",\"description\":\"Kitchen faucet has been dripping for 3 days. Water wastage concern.\",\"property\":\"$PROP1\",\"unit\":\"202\",\"category\":\"plumbing\",\"priority\":\"medium\",\"status\":\"in_progress\",\"assignedTo\":\"Mohammed Plumbing\",\"reportedBy\":\"Sara Al-Qahtani\",\"estimatedCost\":150}"
echo "  Created: Leaking Faucet"

create_record "work_orders" "{\"title\":\"Electrical Outlet Sparking\",\"description\":\"Living room outlet sparks when plugging in appliances. Safety hazard.\",\"property\":\"$PROP1\",\"unit\":\"301\",\"category\":\"electrical\",\"priority\":\"urgent\",\"status\":\"open\",\"assignedTo\":\"Elite Electrical Co.\",\"reportedBy\":\"Khalid Al-Harbi\",\"estimatedCost\":300}"
echo "  Created: Electrical Outlet Sparking"

create_record "work_orders" "{\"title\":\"Dishwasher Not Draining\",\"description\":\"Dishwasher leaves standing water after cycle. May be clogged drain.\",\"property\":\"$PROP1\",\"unit\":\"102\",\"category\":\"appliance\",\"priority\":\"low\",\"status\":\"completed\",\"assignedTo\":\"Appliance Masters\",\"reportedBy\":\"Nora Al-Saud\",\"estimatedCost\":200,\"actualCost\":175}"
echo "  Created: Dishwasher Not Draining"

create_record "work_orders" "{\"title\":\"Broken Window Seal\",\"description\":\"Bedroom window seal is broken, causing draft and dust entry.\",\"property\":\"$PROP1\",\"unit\":\"401\",\"category\":\"structural\",\"priority\":\"medium\",\"status\":\"open\",\"reportedBy\":\"Omar Al-Zahrani\",\"estimatedCost\":400}"
echo "  Created: Broken Window Seal"

create_record "work_orders" "{\"title\":\"Water Heater Replacement\",\"description\":\"Water heater is 15 years old and needs replacement. Tenant reporting lukewarm water.\",\"property\":\"$PROP1\",\"unit\":\"201\",\"category\":\"plumbing\",\"priority\":\"high\",\"status\":\"in_progress\",\"assignedTo\":\"Saudi Plumbing Solutions\",\"reportedBy\":\"Mohammed Al-Faisal\",\"estimatedCost\":2500}"
echo "  Created: Water Heater Replacement"

echo -e "\nSeeding employees..."
create_record "employees" '{"name":"Abdullah Al-Farsi","email":"abdullah.farsi@facilitypro.sa","phone":"+966 50 111 2222","role":"Property Manager","department":"Operations","status":"active","hireDate":"2023-01-15","salary":15000,"skills":["Property Management","Tenant Relations","Budgeting"],"assignedProperties":["Sunset Apartments","Downtown Condos"],"avatar":"https://ui-avatars.com/api/?name=Abdullah+Farsi&background=171717&color=fff"}'
echo "  Created: Abdullah Al-Farsi"

create_record "employees" '{"name":"Maryam Al-Dosari","email":"maryam.dosari@facilitypro.sa","phone":"+966 55 333 4444","role":"Maintenance Supervisor","department":"Maintenance","status":"active","hireDate":"2023-03-01","salary":12000,"skills":["HVAC","Plumbing","Electrical"],"avatar":"https://ui-avatars.com/api/?name=Maryam+Dosari&background=22C55E&color=fff"}'
echo "  Created: Maryam Al-Dosari"

create_record "employees" '{"name":"Yousef Al-Otaibi","email":"yousef.otaibi@facilitypro.sa","phone":"+966 50 555 6666","role":"Electrician","department":"Maintenance","status":"active","hireDate":"2023-06-10","salary":8000,"skills":["Electrical","Solar Panels"],"certifications":["Licensed Electrician","Safety Training"],"avatar":"https://ui-avatars.com/api/?name=Yousef+Otaibi&background=F59E0B&color=fff"}'
echo "  Created: Yousef Al-Otaibi"

create_record "employees" '{"name":"Noura Al-Qahtani","email":"noura.qahtani@facilitypro.sa","phone":"+966 55 777 8888","role":"Accountant","department":"Finance","status":"active","hireDate":"2022-11-01","salary":13000,"avatar":"https://ui-avatars.com/api/?name=Noura+Qahtani&background=8B5CF6&color=fff"}'
echo "  Created: Noura Al-Qahtani"

create_record "employees" '{"name":"Faisal Al-Harbi","email":"faisal.harbi@facilitypro.sa","phone":"+966 50 999 0000","role":"Plumber","department":"Maintenance","status":"on_leave","hireDate":"2023-08-01","salary":7500,"skills":["Plumbing","Pipe Fitting"],"avatar":"https://ui-avatars.com/api/?name=Faisal+Harbi&background=EF4444&color=fff"}'
echo "  Created: Faisal Al-Harbi"

echo -e "\nSeeding vendors..."
create_record "vendors" '{"name":"Saudi HVAC Specialists","type":"HVAC Services","contact":"Ali Hassan","phone":"+966 11 234 5678","email":"info@saudihvac.sa","status":"active","monthlyRate":5000}'
echo "  Created: Saudi HVAC Specialists"

create_record "vendors" '{"name":"Green Landscape Co.","type":"Landscaping","contact":"Ibrahim Al-Zahrani","phone":"+966 12 345 6789","email":"contact@greenlandscape.sa","status":"active","monthlyRate":3500}'
echo "  Created: Green Landscape Co."

create_record "vendors" '{"name":"Elite Cleaning Services","type":"Cleaning","contact":"Maha Al-Qahtani","phone":"+966 13 456 7890","email":"service@eliteclean.sa","status":"active","monthlyRate":4200}'
echo "  Created: Elite Cleaning Services"

create_record "vendors" '{"name":"SafeGuard Security","type":"Security","contact":"Nasser Al-Dosari","phone":"+966 14 567 8901","email":"info@safeguard.sa","status":"active","monthlyRate":8000}'
echo "  Created: SafeGuard Security"

echo -e "\nSeeding payments..."
create_record "payments" "{\"tenant\":\"$TENANT1\",\"property\":\"$PROP1\",\"unit\":\"101\",\"amount\":2200,\"type\":\"rent\",\"method\":\"bank_transfer\",\"status\":\"completed\",\"dueDate\":\"2025-11-01\",\"paidDate\":\"2025-11-01\",\"receiptNumber\":\"RCP-2025-001\"}"
echo "  Created: Rent payment"

create_record "payments" "{\"tenant\":\"$TENANT1\",\"property\":\"$PROP1\",\"unit\":\"102\",\"amount\":2500,\"type\":\"rent\",\"method\":\"cash\",\"status\":\"completed\",\"dueDate\":\"2025-11-01\",\"paidDate\":\"2025-11-03\",\"receiptNumber\":\"RCP-2025-002\"}"
echo "  Created: Cash rent payment"

create_record "payments" "{\"property\":\"$PROP1\",\"unit\":\"201\",\"amount\":2800,\"type\":\"rent\",\"method\":\"bank_transfer\",\"status\":\"pending\",\"dueDate\":\"2025-11-01\"}"
echo "  Created: Pending rent"

create_record "payments" "{\"property\":\"$PROP1\",\"unit\":\"202\",\"amount\":500,\"type\":\"late_fee\",\"method\":\"bank_transfer\",\"status\":\"overdue\",\"dueDate\":\"2025-10-15\"}"
echo "  Created: Overdue late fee"

create_record "payments" "{\"property\":\"$PROP1\",\"unit\":\"301\",\"amount\":6000,\"type\":\"security_deposit\",\"method\":\"bank_transfer\",\"status\":\"completed\",\"dueDate\":\"2024-12-28\",\"paidDate\":\"2024-12-28\",\"receiptNumber\":\"RCP-2024-089\"}"
echo "  Created: Security deposit"

echo -e "\n✓ Database seeded successfully!"
echo "Admin UI: http://127.0.0.1:8090/_/"
