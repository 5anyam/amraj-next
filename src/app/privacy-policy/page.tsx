'use client';

import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gray-50 text-gray-800 py-10 px-4 sm:px-8 md:px-20 lg:px-40">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">Effective Date: 1st July 2025</p>

        <section className="space-y-6 text-base leading-7">
          <p>
            Amraj Wellness LLC (“Company”, “we”, “our”, or “us”) is committed to protecting your privacy. This Privacy Policy (“Policy”) outlines how we collect, use, disclose, and safeguard your Personal Information through our platforms, including www.amraj.in (the “Platform”), when you browse, access, or purchase from us.
          </p>
          <p>
            We at <strong>AMRAJ</strong> combine modern nutraceutical innovation with the time-tested power of ancient herbal traditions to offer wellness solutions designed for the modern world. As part of our commitment to your well-being, we take your data privacy seriously.
          </p>
          <p>
            By accessing or using our Platform, you agree to the terms of this Privacy Policy and consent to the practices described herein.
          </p>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">1. Personal Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, contact details (email, phone), shipping & billing address</li>
            <li>Date of birth, gender (where applicable)</li>
            <li>Order history and preferences</li>
            <li>Payment information (processed via secure third-party services)</li>
            <li>Device information, IP address, cookies, usage behavior</li>
            <li>Health or wellness-related preferences (if voluntarily provided)</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">2. How We Collect Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>When you make a purchase or create an account</li>
            <li>Through contact forms, newsletter signups, or feedback surveys</li>
            <li>Via cookies and analytics tools</li>
            <li>From third-party partners like payment gateways and couriers</li>
            <li>Social media platforms and affiliate campaigns</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">3. Purpose of Use</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and deliver orders</li>
            <li>Customize product recommendations</li>
            <li>Provide support and respond to inquiries</li>
            <li>Send offers, updates, and wellness tips</li>
            <li>Improve site performance and product experience</li>
            <li>Prevent fraud and ensure compliance</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">4. Sharing of Personal Information</h2>
          <p>
            We may share your data with trusted service providers, analytics partners, and legal authorities (if required). We do <strong>not sell</strong> your personal data.
          </p>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to remember preferences, analyze traffic, and enhance user experience. You can manage cookies via your browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">6. Data Security</h2>
          <p>
            We implement encryption, firewalls, and secure servers to safeguard your data. However, no online transmission is completely secure.
          </p>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">7. Your Rights and Choices</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Request access or correction of your data</li>
            <li>Withdraw consent for marketing</li>
            <li>Request deletion of your personal data</li>
          </ul>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">8. Children’s Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect information from minors.
          </p>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">9. Policy Updates</h2>
          <p>
            We may update this Privacy Policy from time to time. Updates will be reflected with a revised effective date.
          </p>

          <h2 className="text-xl font-semibold mt-10 text-orange-500">10. Contact / Grievance Officer</h2>
          <p>If you have questions or concerns, please contact:</p>
          <div className="pl-4">
            <p><strong>Grievance Officer:</strong> Aman Bhardwaj</p>
            <p><strong>Email:</strong>support@amraj.in</p>
            <p><strong>Address:</strong> Prashant Vihar, Delhi</p>
          </div>
        </section>
      </div>
    </div>
  );
}
