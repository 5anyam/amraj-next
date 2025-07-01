'use client';

import React from 'react';

export default function ReturnsRefundPolicy() {
  return (
    <div className="bg-gray-50 py-10 px-4 sm:px-8 md:px-20 lg:px-40">
      <div className="max-w-5xl mx-auto bg-white p-8 shadow-xl rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-teal-600 mb-6 text-center">
          Returns & Refunds Policy
        </h1>
        <p className="text-sm text-gray-500 mb-8 text-center">Please Read Carefully</p>

        <section className="space-y-6 text-base leading-7 text-gray-800">
          <h2 className="text-xl font-semibold text-orange-500">Returns</h2>
          <p>
            All our shipments are carefully inspected before dispatch. If you receive a product in any of the following states, kindly notify us within <strong>30 days</strong>.
          </p>

          <h3 className="font-semibold mt-6">30 DAY RETURN POLICY: ACCEPTABLE REASONS FOR RETURNS</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Damaged, Leaking, Tampered, or Broken Product or Package</li>
            <li>Wrong Product Delivered</li>
            <li>Product Post Expiration Date</li>
            <li>Incomplete Order / Missing Products</li>
          </ul>

          <h3 className="font-semibold mt-6">UNACCEPTABLE REASONS FOR RETURN</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Opened / Used / Altered products</li>
            <li>Missing original packaging (cartons, labels, etc.)</li>
            <li>Return/Replacement request raised after 4 days of delivery</li>
            <li>Damaged/Missing products reported after 4 days</li>
            <li>Returns for reasons other than a manufacturing defect</li>
            <li>Personal issues like stomach upset, headache, taste preferences, etc.</li>
          </ul>

          <h3 className="font-semibold mt-6">IN CASE OF AN ACCEPTABLE RETURN</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Email us with images as proof at <strong>support@amraj.in</strong> within 30 days</li>
            <li>We will review your request within 24 working hours</li>
            <li>If confirmed damaged, you may be asked to discard the product</li>
            <li>Replacement will be initiated as per availability</li>
            <li>If pickup is unavailable at your location, you may need to self-ship — courier cost will be reimbursed</li>
          </ul>

          <h2 className="text-xl font-semibold text-orange-500 mt-10">Refunds</h2>

          <h3 className="font-semibold mt-4">REFUNDS WILL NOT BE ISSUED IF</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>The product is tampered with or misused</li>
            <li>Incorrect shipping address was provided</li>
            <li>You consumed part of the product and then raised a return</li>
            <li>You do not comply with our return policy</li>
          </ul>

          <h3 className="font-semibold mt-4">REFUNDS MAY BE ISSUED UNDER THE FOLLOWING CIRCUMSTANCES</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Product is out of stock</li>
            <li>Shipping address is unserviceable</li>
            <li>Return policy conditions are met</li>
            <li>Product is received in untampered condition</li>
            <li>Double payment made from the same email</li>
          </ul>

          <h2 className="text-xl font-semibold text-orange-500 mt-10">Cancellation & Refunds</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>You can cancel your order before dispatch by emailing <strong>support@amraj.in</strong></li>
            <li>Post-dispatch, cancellations are not allowed</li>
            <li>Refund for cancellations will be processed within 5–7 days to the original payment method</li>
          </ul>

          <h2 className="text-xl font-semibold text-orange-500 mt-10">Additional Refund Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>No processing fee for returns or replacements</li>
            <li>If you replace with a higher-priced product, you will need to pay the difference</li>
            <li>Refunds for prepaid orders go to the same source account</li>
            <li>For COD orders, bank details are required for refund</li>
            <li>Refunds are processed in 3–5 working days post verification</li>
            <li>Replacement products are shipped in 3–5 working days after approval</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
