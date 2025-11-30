import React from "react";
import Title from "../components/Title";

const RefundPolicy = () => {
  return (
    <div className="pt-10 border-t">
      <div className="text-2xl mb-3">
        <Title text1={"REFUND"} text2={"POLICY"} />
      </div>
      <div className="my-10 flex flex-col gap-6 text-gray-600 text-sm">
        <p>
          We want you to be completely satisfied with your purchase. If you are
          not, we offer a hassle-free return and refund policy.
        </p>

        <h3 className="font-bold text-gray-800 text-base">1. Returns</h3>
        <p>
          You may return items within 30 days of delivery for a full refund.
          Items must be unused and in their original packaging.
        </p>

        <h3 className="font-bold text-gray-800 text-base">2. Refunds</h3>
        <p>
          Once your return is received and inspected, we will notify you of the
          approval or rejection of your refund. If approved, your refund will be
          processed to your original method of payment.
        </p>

        <h3 className="font-bold text-gray-800 text-base">3. Exchanges</h3>
        <p>
          We only replace items if they are defective or damaged. If you need to
          exchange it for the same item, please contact us.
        </p>

        <h3 className="font-bold text-gray-800 text-base">4. Shipping Costs</h3>
        <p>
          You will be responsible for paying for your own shipping costs for
          returning your item. Shipping costs are non-refundable.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
