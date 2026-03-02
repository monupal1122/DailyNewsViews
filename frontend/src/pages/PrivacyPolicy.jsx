import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Shield, Eye, Lock, FileText, Bell, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
    return (
        <Layout>
            <Helmet>
                <title>Privacy Policy | Daily News Views</title>
                <meta name="description" content="Read our privacy policy to understand how we collect, use, and protect your personal information." />
            </Helmet>

            <div className="bg-white pb-24">
                {/* Header */}
                <section className="bg-zinc-50 border-b border-zinc-200 py-20">
                    <div className="container mx-auto px-4 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-black uppercase tracking-widest mb-6">
                            <Shield className="w-3 h-3" />
                            Security First
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
                            Privacy <span className="text-red-600">Policy</span>
                        </h1>
                        <p className="text-zinc-500 font-medium max-w-2xl mx-auto italic">
                            Effective Date: February 24, 2026. Your privacy is paramount to us. This policy outlines our commitment to protecting your personal data.
                        </p>
                    </div>
                </section>

                {/* Content */}
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center mb-6">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">Data Collection</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    We collect information you provide directly to us when you subscribe to our newsletter, create an account, or contact us for support.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-zinc-950 text-white rounded-2xl flex items-center justify-center mb-6">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">Data Protection</h3>
                                <p className="text-zinc-600 leading-relaxed">
                                    We implement industry-standard security measures to maintain the safety of your personal information when you access our site.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-zinc lg:prose-xl max-w-none space-y-12">
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1 h-8 bg-red-600 rounded-full" />
                                    <h2 className="text-3xl font-black uppercase tracking-tight m-0">1. Information We Collect</h2>
                                </div>
                                <div className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                                    <p className="text-zinc-600 font-medium leading-relaxed mb-4">
                                        When you visit Daily News Views, we may collect several types of information:
                                    </p>
                                    <ul className="space-y-4 text-zinc-600 font-medium">
                                        <li className="flex gap-3">
                                            <span className="text-red-600 font-black">•</span>
                                            <span><strong>Personal Information:</strong> Name, email address, and any details provided in contact forms.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-red-600 font-black">•</span>
                                            <span><strong>Usage Data:</strong> IP addresses, browser types, device information, and pages visited.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-red-600 font-black">•</span>
                                            <span><strong>Cookies:</strong> Small files stored on your device to enhance user experience and analyze traffic.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1 h-8 bg-red-600 rounded-full" />
                                    <h2 className="text-3xl font-black uppercase tracking-tight m-0">2. How We Use Data</h2>
                                </div>
                                <p className="text-zinc-600 leading-relaxed font-serif text-lg italic bg-zinc-50 p-8 rounded-3xl border-l-4 border-red-600">
                                    "Your data is used solely to improve your experience. We never sell your personal information to third parties."
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                                    {[
                                        { icon: Globe, text: "Personalizing your news feed" },
                                        { icon: Bell, text: "Sending critical breaking news alerts" },
                                        { icon: FileText, text: "Analyzing site traffic and performance" },
                                        { icon: Lock, text: "Maintaining site security and integrity" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors">
                                            <item.icon className="w-5 h-5 text-red-600" />
                                            <span className="font-bold text-zinc-900">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1 h-8 bg-black rounded-full" />
                                    <h2 className="text-3xl font-black uppercase tracking-tight m-0">3. Third-Party Services</h2>
                                </div>
                                <p className="text-zinc-600 leading-relaxed">
                                    We may use third-party tools (like Google Analytics or advertising partners) that collect data as part of their services. Each of these providers has their own privacy policy which we encourage you to review.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1 h-8 bg-black rounded-full" />
                                    <h2 className="text-3xl font-black uppercase tracking-tight m-0">4. Your Rights</h2>
                                </div>
                                <p className="text-zinc-600 leading-relaxed">
                                    You have the right to request access to the data we hold about you, request corrections, or ask for your personal data to be deleted from our systems. To exercise these rights, please contact us at <a href="mailto:privacy@dailynewsviews.com" className="text-red-600 font-bold hover:underline">privacy@dailynewsviews.com</a>.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PrivacyPolicy;
