# Tiny Gems School Fees Management System - Database Structure

## Data Storage

This application uses **localStorage** (browser's built-in storage) to persist data. The data is stored in JSON format and can be easily exported/imported as needed.

### Storage Keys
- `tinygems_students` - Student records
- `tinygems_fees` - Fee payment records
- `tinygems_users` - User accounts (mock data)

## Database Schema

### Students Collection

```json
{
  "id": "s1",
  "name": "Aarav Singh",
  "fatherName": "Rajinder Singh",
  "motherName": "Sunita Devi",
  "aadhaar": "123456789012",
  "phone": "9876543210",
  "dob": "2010-05-15",
  "class": "10",
  "section": "A",
  "rollNo": "101"
}
```

### Fee Records Collection

```json
{
  "id": "f-s1-3",
  "studentId": "s1",
  "month": 3,
  "year": 2024,
  "amount": 1500,
  "status": "PAID",
  "paymentDate": "2024-04-10"
}
```

**Fee Status Values:** `"PAID" | "UNPAID" | "ADVANCE"`

### Users Collection

```json
{
  "id": "1",
  "name": "Madhav Gautam",
  "role": "ADMIN"
}
```

**Role Values:** `"ADMIN" | "PRINCIPAL" | "TEACHER"`

## Exporting Data

1. **As Admin User:**
   - Go to Dashboard
   - Click "Export Data" button in sidebar
   - A JSON file will download with all current data

2. **Manual Export:**
   - Open browser Developer Tools (F12)
   - Go to Console tab
   - Run:
     ```javascript
     JSON.stringify({
       students: JSON.parse(localStorage.getItem('tinygems_students')),
       fees: JSON.parse(localStorage.getItem('tinygems_fees')),
       users: JSON.parse(localStorage.getItem('tinygems_users'))
     }, null, 2)
     ```

## Importing Data

1. **As Admin User:**
   - Go to Dashboard
   - Click "Import Data" button in sidebar
   - Select a JSON file (exported from the same system)
   - Data will be loaded into the app

2. **Manual Import:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Prepare your JSON data and run:
     ```javascript
     const data = { /* your JSON data */ };
     localStorage.setItem('tinygems_students', JSON.stringify(data.students));
     localStorage.setItem('tinygems_fees', JSON.stringify(data.fees));
     localStorage.setItem('tinygems_users', JSON.stringify(data.users));
     location.reload();
     ```

## Sample db.json Export

See `sample_db.json` in the project root for a sample export format.
