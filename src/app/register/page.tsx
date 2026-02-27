// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import { Kantumruy_Pro } from 'next/font/google';
import localFont from 'next/font/local';
import { supabase } from '@/lib/supabase/client';

const kantumruyPro = Kantumruy_Pro({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
});

const brownSugar = localFont({
  src: '../../../public/BrownSugar.ttf',
  display: 'swap',
});

export default function EventRegistrationPage() {
  const fontClass = kantumruyPro.className;

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', company: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Clear previous errors

    // 1. Validate Phone (strips spaces/dashes, checks for 9-10 digits)
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!/^\d{9,10}$/.test(cleanPhone)) {
      setErrorMessage('Phone number must be exactly 9 or 10 digits.');
      setIsSubmitting(false);
      return;
    }

    // 2. Validate Email Format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 3. Check for Existing Registration
      const { data: existingUser, error: searchError } = await supabase
        .from('registrations')
        .select('id')
        .or(`email.eq.${formData.email},phone.eq.${cleanPhone}`)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingUser) {
        setErrorMessage('This email or phone number is already registered.');
        setIsSubmitting(false);
        return;
      }

      // 4. Save Registration
      const { error: insertError } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: cleanPhone,
            company: formData.company
          }
        ]);

      if (insertError) throw insertError;
      
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Registration Error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SUCCESS SCREEN
  if (submitSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 bg-[#FAF9F6] text-stone-900 ${fontClass}`}>
        <div className="max-w-xl w-full text-center animate-in fade-in duration-700">
          <h1 className="text-4xl font-normal mb-6 tracking-tight">Reservation Confirmed</h1>
          <p className="text-lg text-stone-500 mb-12 font-light">Thank you. Your place at the event has been secured.</p>
          <button 
            onClick={() => {
              setSubmitSuccess(false);
              setFormData({ fullName: '', phone: '', email: '', company: '' }); // Reset form
            }} 
            className="px-10 py-4 border border-stone-300 text-stone-600 hover:border-stone-900 transition-all text-xs uppercase tracking-[0.2em]"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#FAF9F6] text-stone-900 selection:bg-stone-200 selection:text-stone-900 font-light scroll-smooth ${fontClass}`}>
      
      {/* SECTION 1 — WELCOME HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/tower.png')] bg-cover bg-center scale-105 blur-sm" aria-hidden="true" />
        <div className="absolute inset-0 bg-stone-900/50" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FAF9F6] to-transparent z-10" aria-hidden="true" />
        
        <div className="relative z-20 px-6 md:px-16 lg:px-24 w-full max-w-7xl mx-auto flex flex-col items-center text-center md:items-start md:text-left pt-20 pb-32">
          <p className="text-white text-1xl font-normal mb-4 tracking-tight text-stone-900">
            BARE Exclusive Event
          </p>

          <div className="min-h-[140px] sm:min-h-[180px] md:min-h-[220px] flex items-center justify-center md:justify-start w-full max-w-[340px] md:max-w-[700px] mb-6">
            <h1 className={`text-5xl md:text-7xl lg:text-8xl text-white w-full ${brownSugar.className} leading-[1.08] tracking-wider`}>
              BARE WORKSHOP
            </h1>
          </div>
          <p className="max-w-[320px] md:max-w-[520px] text-base md:text-lg leading-relaxed text-white/90 mb-8">
            Join us for an evening of refined elegance, quiet conversation, and modern luxury.
          </p>
          <div className="mb-12 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 text-white/80">
            <p className="text-[11px] uppercase border-b border-white/20 pb-2 md:border-b-0 md:pb-0 font-medium tracking-[0.25em]">February 15, 2026</p>
            <span className="hidden md:inline text-white/40">•</span>
            <p className="text-[11px] uppercase font-medium tracking-[0.25em]">Phnom Penh, Cambodia</p>
          </div>
          
          <a href="#register" className="px-12 py-4 bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-stone-900 transition-all duration-500 text-xs uppercase font-medium tracking-[0.2em]">
            Reserve Your Place
          </a>
        </div>
      </section>

      {/* SECTION 2 — REGISTRATION FORM */}
      <section id="register" className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <header className="mb-20 text-center">
            <h2 className="text-4xl font-normal mb-4 tracking-tight text-stone-900">Guest Registration</h2>
            <p className="text-stone-600 font-light tracking-wide">Please provide your details to secure your attendance.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-16">
            <div className="grid gap-12">
              <div className="group">
                <label className="block text-[10px] uppercase mb-2 text-stone-500 group-focus-within:text-stone-900 transition-colors font-medium tracking-[0.2em]">Full Name *</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors text-lg text-stone-900 font-light" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="group">
                  <label className="block text-[10px] uppercase mb-2 text-stone-500 group-focus-within:text-stone-900 transition-colors font-medium tracking-[0.2em]">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors text-lg text-stone-900 font-light" required />
                </div>
                <div className="group">
                  <label className="block text-[10px] uppercase mb-2 text-stone-500 group-focus-within:text-stone-900 transition-colors font-medium tracking-[0.2em]">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors text-lg text-stone-900 font-light" required />
                </div>
              </div>
              <div className="group">
                <label className="block text-[10px] uppercase mb-2 text-stone-500 group-focus-within:text-stone-900 transition-colors font-medium tracking-[0.2em]">Company / Organization</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors text-lg text-stone-900 font-light" />
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="text-red-500 text-[10px] uppercase font-medium tracking-[0.2em] text-center pt-4">
                {errorMessage}
              </div>
            )}

            <div className="pt-8">
              <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-stone-900 text-white hover:bg-stone-800 transition-colors text-xs uppercase disabled:opacity-50 font-medium tracking-[0.2em]">
                {isSubmitting ? 'Confirming...' : 'Submit Registration'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* SECTION 3 — EVENT AGENDA */}
      <section className="py-32 px-6 bg-stone-100/40 border-y border-stone-200/50">
        <div className="max-w-3xl mx-auto">
          <header className="mb-16 text-center md:text-left">
            <h2 className="text-[11px] uppercase text-stone-500 mb-4 font-medium tracking-[0.3em]">Event Agenda</h2>
            <p className="text-xl text-stone-800 font-light">A session thoughtfully curated for connection and growth.</p>
          </header>
          
          <div className="space-y-12">
            {[
              { time: "13:00", title: "Check-in & Welcome", desc: "Arrivals and event registration." },
              { time: "14:00", title: "How to Create Effective Video Sessions", desc: "Event kickoff and insights on crafting engaging video content." },
              { time: "15:00", title: "Coffee Break", desc: "A brief 15-minute break for refreshments." },
              { time: "15:25", title: "How to Boost Your Video Right", desc: "Learn the right strategies to promote and boost your videos." },
              { time: "16:00", title: "Group Photo", desc: "Commemorative group photo and networking." },
              { time: "16:30", title: "Event Concludes", desc: "Final remarks and departure." }
            ].map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12 border-b border-stone-300/40 pb-8 last:border-0">
                <div className="w-24 shrink-0 text-[10px] uppercase text-stone-500 font-medium tracking-[0.2em]">
                  {item.time}
                </div>
                <div>
                  <h3 className="text-lg text-stone-900 mb-2">{item.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — MAP */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/3 space-y-8 text-center md:text-left">
            <div>
              <h2 className="text-[11px] uppercase text-stone-500 mb-6 font-medium tracking-[0.3em]">Location</h2>
              <h3 className="text-2xl text-stone-900 mb-2">Vattanac Tower</h3>
              <p className="text-stone-600 font-light">Phnom Penh, Cambodia</p>
            </div>
            
            <a href="https://maps.app.goo.gl/uX8NCm1ffiR649v5A" target="_blank" rel="noopener noreferrer" className="inline-block px-10 py-4 border border-stone-300 text-stone-600 hover:border-stone-900 transition-all text-xs uppercase font-medium tracking-[0.2em]">
              Get Direction
            </a>
          </div>
          <div className="w-full md:w-2/3 aspect-[16/9] md:aspect-[21/9] bg-stone-200 relative overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15634.790211315385!2d104.918571!3d11.573526!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095143a986fc07%3A0xc4976c41ebdc86bf!2sVattanac%20Capital!5e0!3m2!1sen!2skh!4v1772211077965!5m2!1sen!2skh" 
              className="absolute inset-0 w-full h-full" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
            />
          </div>
        </div>
      </section>
    </div>
  );
}