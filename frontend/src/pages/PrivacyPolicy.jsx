import React from "react";
import Title from "../components/Title";

const PrivacyPolicy = () => {
  return (
    <div className="pt-10 border-t">
      <div className="text-2xl mb-3">
        <Title text1={"PRIVACY"} text2={"POLICY"} />
      </div>
      <div className="my-10 flex flex-col gap-6 text-gray-600 text-sm">
        <p>
          At Bespoke, we are committed to protecting your privacy. This Privacy
          Policy explains how we collect, use, and safeguard your personal
          information when you visit our website or make a purchase.
        </p>

        <h3 className="font-bold text-gray-800 text-base">
          1. Information We Collect
        </h3>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, place an order, or contact us. This may include
          your name, email address, shipping address, and payment information.
        </p>

        <h3 className="font-bold text-gray-800 text-base">
          2. How We Use Your Information
        </h3>
        <p>
          We use your information to process your orders, communicate with you,
          and improve our services. We do not sell your personal data to third
          parties.
        </p>

        <h3 className="font-bold text-gray-800 text-base">3. Security</h3>
        <p>
          We implement a variety of security measures to maintain the safety of
          your personal information. Your payment information is encrypted and
          processed securely.
        </p>

        <h3 className="font-bold text-gray-800 text-base">4. Cookies</h3>
        <p>
          We use cookies to enhance your browsing experience and analyze site
          traffic. You can choose to disable cookies through your browser
          settings.
        </p>

        <p>
          If you have any questions about this Privacy Policy, please contact
          us.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
