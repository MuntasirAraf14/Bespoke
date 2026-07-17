import React, { useContext, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Title from "../components/Title";
import NewsletterBox from "../components/NewsletterBox";
import { ShopContext } from "../context/shopContext";

const openRoles = [
  {
    title: "Tailoring Assistant",
    type: "Full-time",
    location: "Aftabnagar, Dhaka",
    description:
      "Support fittings, alterations, measurements, and finishing work for custom garments.",
  },
  {
    title: "Customer Experience Associate",
    type: "Full-time",
    location: "Aftabnagar, Dhaka",
    description:
      "Guide customers through appointments, orders, delivery updates, and after-sales support.",
  },
  {
    title: "Fashion Content Intern",
    type: "Internship",
    location: "Hybrid",
    description:
      "Assist with styling content, product storytelling, social posts, and campaign shoots.",
  },
];

const benefits = [
  "Hands-on training with tailoring and retail operations",
  "A small team where ideas move quickly",
  "Work around local fashion, craft, and customer stories",
];

const Careers = () => {
  const { backendURL } = useContext(ShopContext);
  const [selectedRole, setSelectedRole] = useState(openRoles[0].title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    message: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleApplyClick = (role) => {
    setSelectedRole(role);
    document.getElementById("career-application")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${backendURL}/api/job-application/apply`,
        {
          role: selectedRole,
          ...formData,
        }
      );

      if (response.data.success) {
        toast.success("Application submitted. Our team will review it soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          portfolio: "",
          message: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-10 border-t">
      <div className="text-2xl text-center">
        <Title text1={"CAREERS"} text2={"AT BESPOKE"} />
      </div>

      <section className="my-10 grid gap-10 lg:grid-cols-[1fr_0.8fr] items-start">
        <div className="flex flex-col gap-5">
          <p className="text-sm uppercase tracking-[0.18em] text-gray-500">
            Build with us
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium text-gray-900 leading-tight">
            Help shape a Bangladeshi brand built on fit, craft, and care.
          </h1>
          <p className="text-gray-600 leading-7">
            BESPOKE is growing it's team in Dhaka. We are looking for people who
            enjoy detailed work, thoughtful customer service, and the daily pace
            of a local fashion business.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleApplyClick(selectedRole)}
              className="bg-black text-white px-7 py-3 text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              Apply Now
            </button>
            <Link
              to="/contact"
              className="border border-gray-300 px-7 py-3 text-sm rounded-lg hover:border-black transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="border p-6 sm:p-8 flex flex-col gap-4">
          <p className="font-semibold text-gray-900">What we value</p>
          <p className="text-gray-600 text-sm leading-6">
            Precision, kindness, reliability, and pride in local craftsmanship.
            Experience helps, but curiosity and consistency matter just as much.
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="border py-4 px-2">
              <p className="font-semibold text-gray-900">Dhaka</p>
              <p className="text-gray-500 mt-1">Based</p>
            </div>
            <div className="border py-4 px-2">
              <p className="font-semibold text-gray-900">Local</p>
              <p className="text-gray-500 mt-1">Brand</p>
            </div>
            <div className="border py-4 px-2">
              <p className="font-semibold text-gray-900">Growth</p>
              <p className="text-gray-500 mt-1">Focused</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="text-xl mb-5">
          <Title text1={"OPEN"} text2={"ROLES"} />
        </div>
        <div className="grid gap-5">
          {openRoles.map((role) => (
            <div
              key={role.title}
              className="border p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {role.title}
                  </h2>
                  <span className="text-xs border px-3 py-1 rounded-full text-gray-600">
                    {role.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{role.location}</p>
                <p className="text-sm text-gray-600 mt-3 max-w-2xl leading-6">
                  {role.description}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleApplyClick(role.title)}
                className="border border-black px-6 py-3 text-sm rounded-lg text-center hover:bg-black hover:text-white transition-colors"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="career-application" className="mb-20 border p-5 sm:p-8">
        <div className="text-xl mb-5">
          <Title text1={"SEND"} text2={"APPLICATION"} />
        </div>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Applying For
            </label>
            <select
              value={selectedRole}
              onChange={(event) => setSelectedRole(event.target.value)}
              className="w-full border px-4 py-3 outline-none focus:border-black"
            >
              {openRoles.map((role) => (
                <option key={role.title} value={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border px-4 py-3 outline-none focus:border-black"
              placeholder="Full name"
              required
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border px-4 py-3 outline-none focus:border-black"
              placeholder="Email address"
              type="email"
              required
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border px-4 py-3 outline-none focus:border-black"
              placeholder="Phone number"
              required
            />
            <input
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className="border px-4 py-3 outline-none focus:border-black"
              placeholder="Portfolio or profile link"
            />
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="border px-4 py-3 min-h-36 outline-none focus:border-black"
            placeholder="Tell us about your experience and why you want to join BESPOKE"
            required
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-black text-white px-8 py-3 text-sm rounded-lg transition-colors ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </section>

      <section className="mb-20 grid gap-5 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div key={benefit} className="border px-6 py-8 text-sm text-gray-600">
            {benefit}
          </div>
        ))}
      </section>

      <NewsletterBox />
    </div>
  );
};

export default Careers;
