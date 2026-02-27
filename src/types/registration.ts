// src/types/registration.ts
export interface ContactPerson {
  id: string;
  user_name: string;
  phone_number: string;
  position: string;
}

export interface RegistrationFormData {
  company_name: string;
  business_address: string;
  note: string;
  contacts: ContactPerson[];
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
}

export interface RegistrationPayload {
  company_name: string;
  business_address?: string;
  note?: string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  contacts: Array<{
    user_name: string;
    phone_number: string;
    position?: string;
  }>;
}
