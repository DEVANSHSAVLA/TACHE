"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ContactFormContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    
    useEffect(() => {
        if (searchParams?.get("success") === "true") {
            setSubmitted(true);
            // Clean up the URL
            router.replace("/contact");
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-white">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-3xl">
                {/* Intro Text */}
                <div className="text-center mb-12">
                    <p className="text-lg text-[#6b3a3a] leading-relaxed mb-10">
                        We&apos;d love to hear from you at TACHÈ! Whether you have a question, need assistance, or want to share feedback, our team is always here to help.
                    </p>

                    <p className="text-lg text-[#6b3a3a] mb-6">
                        <span className="font-semibold">Email:</span>{" "}
                        <a href="mailto:aasthajainokok@gmail.com" className="underline hover:text-[var(--tache-soft-brown)] transition-colors">
                            aasthajainokok@gmail.com
                        </a>
                    </p>

                    <p className="text-lg text-[#6b3a3a] mb-10">
                        <span className="font-semibold">Instagram:</span>{" "}
                        <a href="https://www.instagram.com/tache.in" target="_blank" rel="noreferrer" className="underline hover:text-[var(--tache-soft-brown)] transition-colors">
                            @tache.in
                        </a>
                    </p>

                    <p className="text-lg text-[#6b3a3a] leading-relaxed">
                        We value your feedback and inquiries. Please complete the form below, and we will respond to you as swiftly as possible.
                    </p>
                </div>

                {/* Contact Form */}
                {submitted ? (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-semibold text-[#6b3a3a] mb-4">Thank you!</h2>
                        <p className="text-lg text-gray-600">
                            Your message has been sent. We&apos;ll get back to you as soon as possible.
                        </p>
                        <button onClick={() => setSubmitted(false)} className="mt-8 px-6 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700 transition">
                            Send another message
                        </button>
                    </div>
                ) : (
                    <form action="https://formsubmit.co/aasthajainokok@gmail.com" method="POST" className="space-y-8 max-w-lg mx-auto">
                        {/* Hidden configurations for FormSubmit */}
                        <input type="hidden" name="_next" value="https://tache-art.vercel.app/contact?success=true" />
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_template" value="table" />
                        <input type="hidden" name="_subject" value="New Contact Form Submission from Website" />

                        {/* Name */}
                        <div>
                            <label htmlFor="contact-name" className="block text-base font-semibold text-gray-900 mb-2">
                                Your name <span className="text-red-500">*</span>
                            </label>
                            <input id="contact-name" type="text" name="name" placeholder="Enter your name" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-[var(--tache-soft-brown)] transition-colors bg-white" />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="contact-email" className="block text-base font-semibold text-gray-900 mb-2">
                                Your email <span className="text-red-500">*</span>
                            </label>
                            <input id="contact-email" type="email" name="email" placeholder="Enter your email" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-[var(--tache-soft-brown)] transition-colors bg-white" />
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="contact-message" className="block text-base font-semibold text-gray-900 mb-2">
                                Your message <span className="text-red-500">*</span>
                            </label>
                            <textarea id="contact-message" name="message" placeholder="Enter your message" required rows={5} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-[var(--tache-soft-brown)] transition-colors bg-white resize-vertical" />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button type="submit" className="px-8 py-3 bg-[#a8584c] text-white text-base font-semibold rounded-full hover:bg-[#8f4a3f] transition-colors tracking-wide">
                                Send message
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen text-center py-20">Loading...</div>}>
            <ContactFormContent />
        </Suspense>
    );
}
