'use client';

import { motion } from 'framer-motion';
import { Mail, MessageCircle, MapPin, Send, Sparkles, Globe } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise(r => setTimeout(r, 1500));
    alert('Thank you! Your message has been sent. We will get back to you soon.');
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="gradient-hero py-20 relative overflow-hidden text-center">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="container relative z-10 max-w-4xl">
          <div className="flex items-center justify-center gap-2 mb-6 text-primary-300 font-black text-[10px] uppercase tracking-[0.3em]">
            <Globe className="h-3 w-3" /> Get In Touch
          </div>
          <h1 className="font-instrument-serif text-5xl md:text-7xl text-white mb-6 tracking-tight">
            Connect With <span className="italic opacity-80">Us</span>
          </h1>
          <p className="text-blue-100/80 text-lg font-medium leading-relaxed max-w-2xl mx-auto">
            Have questions about internships, certificates, or partnerships? 
            Our regional support team is here to assist the next generation of Pakistan.
          </p>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto -mt-10 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-8 border-none shadow-premium bg-white/80 backdrop-blur-md"
            >
              <h3 className="text-xs font-black text-primary-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> Regional Support
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">General Inquiries</p>
                    <p className="text-sm font-bold text-gray-900">hello@internhub.pk</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">WhatsApp Support</p>
                    <p className="text-sm font-bold text-gray-900">+92 300 0000000</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Mon-Fri · 9AM - 6PM PKT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Our Presence</p>
                    <p className="text-sm font-bold text-gray-900">100% Remote Operations</p>
                    <p className="text-[10px] text-gray-400 font-medium mt-1">Coordinated from Islamabad, PK</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl bg-primary-900 p-8 text-white shadow-2xl overflow-hidden relative"
            >
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Student Verification</h4>
                <p className="text-xs text-blue-200/70 mb-6 leading-relaxed">
                  Need to verify a certificate for employment? Visit our lookup portal.
                </p>
                <a href="/verify" className="inline-flex h-10 items-center justify-center px-6 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-xs font-bold uppercase tracking-widest">
                  Verify Portal →
                </a>
              </div>
              <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-10 border-none shadow-premium bg-white h-full"
            >
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input required type="text" placeholder="e.g. Ali Ahmed" className="input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input required type="email" placeholder="ali@example.com" className="input" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                    <select className="input">
                      <option>Internship Inquiry</option>
                      <option>Certificate Verification</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Order # (Optional)</label>
                    <input type="text" placeholder="e.g. CERT-12345" className="input" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea required rows={5} placeholder="How can we help you today?" className="input resize-none" />
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="btn-primary w-full py-4 text-base shadow-xl shadow-primary-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    'Sending Message...'
                  ) : (
                    <>Submit Inquiry <Send size={18} className="transition-transform group-hover:translate-x-1" /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
