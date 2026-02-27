# Business Registration Website

A minimal, elegant one-page registration form built with Next.js 14, TypeScript, and Supabase.

## Features

- ✅ Business information collection
- ✅ Dynamic contact person rows (add/remove)
- ✅ Browser geolocation with Google Maps integration
- ✅ Supabase database integration
- ✅ Server-side API route for secure data insertion
- ✅ Luxury monochrome design
- ✅ Mobile-responsive layout
- ✅ Form validation
- ✅ Success/error handling

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Get your project URL and anon key from Settings → API

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── register/
│   │       └── route.ts          # API endpoint for registration
│   ├── register/
│   │   └── page.tsx              # Main registration form
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Redirects to /register
│   └── globals.css               # Global styles
├── lib/
│   └── supabase/
│       └── client.ts             # Supabase client
└── types/
    └── registration.ts           # TypeScript types
```

## Database Schema

### registrations
- `id` (uuid, primary key)
- `company_name` (text, required)
- `business_address` (text, optional)
- `note` (text, optional)
- `map_url` (text, optional)
- `latitude` (double precision, optional)
- `longitude` (double precision, optional)
- `created_at` (timestamp)

### registration_contacts
- `id` (uuid, primary key)
- `registration_id` (uuid, foreign key)
- `user_name` (text, required)
- `phone_number` (text, required)
- `position` (text, optional)
- `created_at` (timestamp)

## Form Features

### Business Information
- Company/Guest Name (required)
- Business Address (optional)
- Note (optional)

### Contact Persons
- Start with 1 contact row
- Add unlimited contacts with "+" button
- Remove contacts (minimum 1 required)
- Each contact requires:
  - Name (required)
  - Phone Number (required)
  - Position (optional)

### Location
- "Get My Location" button uses browser geolocation
- Displays latitude/longitude
- Shows embedded Google Maps preview
- "Open in Google Maps" link for navigation

## API Endpoint

**POST** `/api/register`

Request body:
```json
{
  "company_name": "Acme Corp",
  "business_address": "123 Main St",
  "note": "Special instructions",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "map_url": "https://www.google.com/maps?q=40.7128,-74.0060",
  "contacts": [
    {
      "user_name": "John Doe",
      "phone_number": "+1234567890",
      "position": "CEO"
    }
  ]
}
```

Response (success):
```json
{
  "success": true,
  "registration_id": "uuid-here"
}
```

Response (error):
```json
{
  "error": "Error message here"
}
```

## Design Philosophy

**Luxury Monochrome Aesthetic:**
- Clean black and white color scheme
- Large typography (h1: 6xl, h2: 3xl)
- Generous spacing (24 units between sections)
- Minimal borders (thin gray lines)
- Simple hover states
- Uppercase labels with wide letter spacing
- Light font weights for elegance

## Build for Production

```bash
npm run build
npm start
```

## Technologies

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database
- **Google Maps API** - Location services

## License

MIT
