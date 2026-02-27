// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { RegistrationPayload } from '@/types/registration';

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationPayload = await request.json();

    // Validate required fields
    if (!body.company_name || !body.contacts || body.contacts.length === 0) {
      return NextResponse.json(
        { error: 'Company name and at least one contact are required' },
        { status: 400 }
      );
    }

    // Validate each contact
    for (const contact of body.contacts) {
      if (!contact.user_name || !contact.phone_number) {
        return NextResponse.json(
          { error: 'Each contact must have a name and phone number' },
          { status: 400 }
        );
      }
    }

    // Insert registration
    const { data: registration, error: registrationError } = await supabase
      .from('registrations')
      .insert({
        company_name: body.company_name,
        business_address: body.business_address || null,
        note: body.note || null,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        map_url: body.map_url || null,
      })
      .select('id')
      .single();

    if (registrationError) {
      console.error('Registration error:', registrationError);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Insert contacts
    const contactsToInsert = body.contacts.map((contact) => ({
      registration_id: registration.id,
      user_name: contact.user_name,
      phone_number: contact.phone_number,
      position: contact.position || null,
    }));

    const { error: contactsError } = await supabase
      .from('registration_contacts')
      .insert(contactsToInsert);

    if (contactsError) {
      console.error('Contacts error:', contactsError);
      // Rollback registration if contacts fail
      await supabase.from('registrations').delete().eq('id', registration.id);
      return NextResponse.json(
        { error: 'Failed to create contacts' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        registration_id: registration.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
