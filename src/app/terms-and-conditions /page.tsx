'use client';

import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-8 md:px-20 lg:px-40">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-6 text-center">
          Terms & Conditions
        </h1>

        <section className="space-y-6 text-base leading-7 text-gray-800">
          <p>
            This website is an online service owned and managed by <strong>Amraj Wellness LLC</strong> (we, us, or AMRAJ). By accessing or using our website (<strong>www.amraj.in</strong>), you agree to be legally bound by the terms and conditions described in this User Agreement. These terms apply indefinitely and may be revised at any time without prior notice.
          </p>

          <p>
            By using this site, you confirm that you are of legal age and that you understand and agree to comply with these Terms. If you do not agree to any of the terms, we kindly ask that you discontinue use of the site.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">Order Verification (Calls/SMS)</h2>
          <p>
            We may make verification calls or send SMS for Cash on Delivery (COD) orders through a trusted third-party platform to confirm your intent and details before processing.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">Amendments to Terms</h2>
          <p>
            AMRAJ reserves the right to modify, update, or change these terms at its sole discretion without any obligation to notify users. Please review this page periodically to stay updated.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">Contact Us</h2>
          <p>
            For any questions, feedback, or complaints related to these Terms, please contact us at <strong>support@amrajwellness.com</strong>.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">DND Compliance</h2>
          <p>
            By providing your phone number on our website, you authorize AMRAJ to override the Do-Not-Disturb (DND) registry. Even if your number is registered under the National Consumer Preference Register (NCPR/NDNC), you voluntarily consent to receive messages, calls, and notifications from us regarding your orders and wellness-related updates.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">Customer Commitment</h2>
          <p>
            If you do not observe any noticeable results after using Apple Cider Vinegar (ACV) continuously for 3 months, we’ll send you a surprise gift as a goodwill gesture.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">Jurisdiction & Governing Law</h2>
          <p>
            These Terms and any separate agreements through which AMRAJ provides services shall be governed by and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in India.
          </p>

          <h2 className="text-xl font-semibold text-orange-500 mt-6">Legal Disclaimer</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>We are not liable for any health concerns that arise after the product has been received and consumed.</li>
            <li>Our products are not intended to diagnose, treat, cure, or prevent any disease.</li>
            <li>All users are advised to consult with a healthcare professional before starting any new supplement or wellness product.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
