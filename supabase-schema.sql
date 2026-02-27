-- registrations table
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  business_address TEXT,
  note TEXT,
  map_url TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- registration_contacts table
CREATE TABLE registration_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_registration_contacts_registration_id ON registration_contacts(registration_id);
