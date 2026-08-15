import { useState } from 'react';
import { useGetTourPlansQuery } from '../redux/slices/tourApiSlice';
import { useGetCabPlansQuery } from '../redux/slices/cabApiSlice';
import { useCreateInquiryMutation } from '../redux/slices/inquiryApiSlice';
import { LuClock, LuCheck, LuMapPin, LuInfo, LuX, LuCar } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea } from '../components/common/formik';

import { CAB_PLANS } from '../utils/constants';

export const TravelPlans = () => {
  const { data: tourData } = useGetTourPlansQuery();
  const { data: cabData } = useGetCabPlansQuery();
  const tourPlans = (tourData?.data as any[]) || [];
  const liveCabPlans = (cabData?.data as any[]) || [];
  const cabPlansToDisplay = liveCabPlans.length > 0 ? liveCabPlans : CAB_PLANS;
  const plans = tourPlans;
  const [createInquiry] = useCreateInquiryMutation();
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'tours' | 'cabs'>('tours');

  const handleOpenInquiry = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleCloseInquiry = () => {
    setSelectedPlan(null);
    setShowModal(false);
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const newInquiry = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      planId: selectedPlan?.id,
      planTitle: selectedPlan?.title || selectedPlan?.packageName || 'Custom Inquiry',
      message: values.message,
    };

    try {
      await createInquiry(newInquiry).unwrap();
      toast.success('Inquiry submitted successfully! Our agent will contact you shortly.');
      resetForm();
      handleCloseInquiry();
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again later.');
    }
  };

  return (
    <div className="animate-in mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-black text-zinc-900 sm:text-5xl dark:text-white">
          {activeTab === 'tours' ? 'Tour Packages' : 'Cab Trip Plans'}
        </h1>
        <p className="text-zinc-550 mx-auto max-w-xl text-sm font-light dark:text-zinc-400">
          {activeTab === 'tours'
            ? 'Handpicked premium holiday packages, tailored for absolute comfort and unforgettable travel experiences.'
            : 'Direct cab routes and custom travel options with professional drivers. Slogan: ટ્રીપ તમારી કાર અમારી (Trip Tamari, Car Amari).'}
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-zinc-200 bg-zinc-100 p-1 shadow-inner dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab('tours')}
            className={`cursor-pointer rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-200 ${activeTab === 'tours'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
          >
            Tour Packages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cabs')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-200 ${activeTab === 'cabs'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
          >
            <LuCar size={14} /> Cab Trip Plans
          </button>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {(activeTab === 'tours' ? plans : cabPlansToDisplay).map((plan: any) => (
          <div
            key={plan.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:border-amber-400/30 dark:border-zinc-800/85 dark:bg-zinc-900 dark:shadow-lg"
          >
            {/* Cover photo */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={
                  (plan as any).photo ||
                  'https://images.unsplash.com/photo-1599661046289-e31897846e41'
                }
                alt={(plan as any).title || plan.packageName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
                <LuClock size={12} />
                {(plan as any).duration || `${plan.days} Days / ${plan.nights} Nights`}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col justify-between space-y-6 p-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-amber-500 uppercase dark:text-amber-400/80">
                    <LuMapPin size={12} />
                    {(plan as any).destination || plan.tripRoute}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                    {(plan as any).title || plan.packageName}
                  </h3>
                </div>

                <p className="text-zinc-650 text-xs leading-relaxed font-light dark:text-zinc-400">
                  {(plan as any).description || ''}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-zinc-555 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase dark:text-zinc-500">
                    <LuInfo size={11} className="text-amber-400" />{' '}
                    {activeTab === 'tours' ? 'Package Highlights' : 'Service Highlights'}
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {((plan as any).highlights || ['Comfortable journey', 'Professional guide'])
                      .slice(0, 3)
                      .map((item: string, idx: number) => (
                        <span
                          key={idx}
                          className="flex items-center gap-2 text-xs font-light text-zinc-700 dark:text-zinc-300"
                        >
                          <LuCheck
                            size={12}
                            className="flex-shrink-0 text-amber-500 dark:text-amber-400"
                          />
                          {item}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="border-zinc-150 flex items-center justify-between border-t pt-4 dark:border-zinc-800">
                <div>
                  <span className="text-zinc-555 block text-[10px] font-semibold tracking-wider uppercase dark:text-zinc-500">
                    {activeTab === 'tours' ? 'Price Per Person' : 'Price Starts At'}
                  </span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    ₹{((plan as any).price || plan.pricePerPerson || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenInquiry(plan)}
                  className="text-zinc-955 cursor-pointer rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold shadow-lg shadow-amber-400/10 transition-all hover:bg-amber-300"
                >
                  Book / Enquire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Booking Inquiry Modal ── */}
      {showModal && selectedPlan && (
        <div className="animate-in text-theme-primary fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <div className="bg-theme-card border-theme-muted relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border shadow-2xl">
            {/* Modal Header */}
            <div className="border-theme-muted flex items-center justify-between border-b px-6 py-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-amber-500 uppercase dark:text-amber-400">
                  Submit Inquiry
                </span>
                <h3 className="text-theme-primary mt-0.5 text-lg font-bold">
                  {selectedPlan.title || selectedPlan.packageName}
                </h3>
              </div>
              <button
                onClick={handleCloseInquiry}
                className="bg-theme-input hover:bg-theme-hover text-theme-secondary hover:text-theme-primary cursor-pointer rounded p-1 transition-colors"
              >
                <LuX size={18} />
              </button>
            </div>

            <Formik
              initialValues={{ name: '', email: '', phone: '', message: '' }}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="flex-grow space-y-4 overflow-y-auto p-6 text-xs">
                  <div className="mb-2 space-y-1">
                    <label className="text-theme-secondary block font-semibold">
                      Selected Package
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${selectedPlan.title || selectedPlan.packageName} (${selectedPlan.duration || `${selectedPlan.days} Days / ${selectedPlan.nights} Nights`})`}
                      className="bg-theme-input border-theme-muted text-theme-muted w-full rounded-xl border px-3 py-2.5 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormikInput
                      name="name"
                      label="Name"
                      placeholder="Enter your name"
                      required
                      className="!bg-theme-input !border-theme-muted !text-theme-primary !rounded-xl !px-3 !py-2.5"
                    />
                    <FormikInput
                      name="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      required
                      className="!bg-theme-input !border-theme-muted !text-theme-primary !rounded-xl !px-3 !py-2.5"
                    />
                  </div>

                  <FormikInput
                    name="email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter email address"
                    required
                    className="!bg-theme-input !border-theme-muted !text-theme-primary !rounded-xl !px-3 !py-2.5"
                  />

                  <FormikTextarea
                    name="message"
                    label="Special Requests / Message"
                    rows={4}
                    placeholder="Tell us about passenger count, custom dates, or any special requirements..."
                    className="!bg-theme-input !border-theme-muted !text-theme-primary !resize-none !rounded-xl !px-3 !py-2.5"
                  />

                  <div className="border-theme-muted mt-4 flex items-center justify-end gap-3 border-t pt-4">
                    <button
                      type="button"
                      onClick={handleCloseInquiry}
                      className="border-theme-muted hover:bg-theme-input text-theme-secondary cursor-pointer rounded-xl border px-4 py-2 font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer rounded-xl bg-amber-400 px-5 py-2 font-bold text-zinc-950 shadow-md transition-colors hover:bg-amber-300"
                    >
                      Submit Inquiry
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};
export default TravelPlans;
