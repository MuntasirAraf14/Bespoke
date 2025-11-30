import React from "react";
import Title from "../components/Title";

const Terms = () => {
  return (
    <div className="pt-10 border-t">
      <div className="text-2xl mb-3">
        <Title text1={"TERMS"} text2={"& CONDITIONS"} />
      </div>
      <div className="my-10 flex flex-col gap-6 text-gray-600 text-sm">
        <p>
          Welcome to Bespoke. These Terms and Conditions govern your use of our
          website and the purchase of products from us.
        </p>

        <h3 className="font-bold text-gray-800 text-base">
          1. Acceptance of Terms
        </h3>
        <p>
          By accessing our website, you agree to be bound by these Terms and
          Conditions. If you do not agree, please do not use our site.
        </p>

        <h3 className="font-bold text-gray-800 text-base">
          2. Product Information
        </h3>
        <p>
          We strive to display our products as accurately as possible. However,
          we cannot guarantee that your monitor's display of any color will be
          accurate.
        </p>

        <h3 className="font-bold text-gray-800 text-base">
          3. Pricing and Availability
        </h3>
        <p>
          All prices are subject to change without notice. We reserve the right
          to limit the quantity of products we supply.
        </p>

        <h3 className="font-bold text-gray-800 text-base">4. Governing Law</h3>
        <p>
          These Terms and Conditions are governed by and construed in accordance
          with the laws of the jurisdiction in which we operate.
        </p>
      </div>
    </div>
  );
};

export default Terms;
