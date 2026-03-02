import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
    return (
        <Layout>
            <Helmet>
                <title>Contact Us | Daily News Views</title>
                <meta name="description" content="Get in touch with Daily News Views. We value your feedback, tips, and inquiries." />
            </Helmet>

            <div className="bg-zinc-50 min-h-screen pb-20">
                {/* Hero Section */}
                <section className="bg-zinc-950 text-white py-24 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523966211575-eb4a01e7dd51?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
                            Get In <span className="text-red-600">Touch</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                            Have a news tip? A question for our editors? Or just want to say hello?
                            We're here to listen and respond.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 -mt-12 relative z-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center group hover:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Email Us</h3>
                            <p className="text-zinc-500 font-medium mb-4">Direct your inquiries to our team</p>
                            <a href="mailto:contact@dailynewsviews.com" className="text-red-600 font-bold hover:underline">
                                contact@dailynewsviews.com
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center group hover:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-zinc-950 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Phone className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Call Us</h3>
                            <p className="text-zinc-500 font-medium mb-4">Monday - Friday, 9am - 6pm EST</p>
                            <a href="tel:+15551234567" className="text-zinc-950 font-bold hover:underline">
                                +1 (555) 123-4567
                            </a>
                        </div>

                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center group hover:shadow-xl transition-all">
                            <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <MapPin className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Visit Us</h3>
                            <p className="text-zinc-500 font-medium mb-4">Our headquarters in New York</p>
                            <address className="not-italic text-zinc-950 font-bold">
                                42 News Avenue, Media Square<br />New York, NY 10001
                            </address>
                        </div>
                    </div>

                    <div className="mt-16 max-w-4xl mx-auto">
                        <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-zinc-100">
                            <div className="md:w-1/2 p-12 bg-zinc-950 text-white">
                                <h2 className="text-3xl font-black mb-6 uppercase tracking-tighter">Send a Message</h2>
                                <p className="text-zinc-400 mb-8 font-medium leading-relaxed italic">
                                    Fill out the form and our representative will get back to you within 24 hours.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-red-600" />
                                        <span className="text-sm font-bold">Fast response time</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-red-600" />
                                        <span className="text-sm font-bold">Direct access to editorial team</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-300">
                                        <div className="w-2 h-2 rounded-full bg-red-600" />
                                        <span className="text-sm font-bold">Secure and private data handling</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2 p-12 bg-white">
                                <form className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all placeholder:text-zinc-300"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all placeholder:text-zinc-300"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Message</label>
                                        <textarea
                                            rows={4}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-all placeholder:text-zinc-300 resize-none"
                                            placeholder="How can we help you?"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="button"
                                        className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] text-xs hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 group"
                                    >
                                        Send Message
                                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;
