import { useCreateInquiryMutation } from '../redux/slices/inquiryApiSlice';
import { LuMail, LuPhone, LuMapPin, LuSend, LuClock } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { COMPANY_DETAILS } from '../utils/constants';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea } from '../components/common/formik';

export const Contact = () => {
  const [createInquiry, { isLoading: loading }] = useCreateInquiryMutation();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      await createInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      }).unwrap();

      toast.success('Message sent! Our support team will get back to you shortly.');
      resetForm();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="animate-in text-theme-primary mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-black sm:text-5xl">Contact Us</h1>
        <p className="text-theme-secondary mx-auto max-w-xl text-sm font-light">
          Have queries about tour bookings, customizable charters, or vehicle availability? Reach
          out to {COMPANY_DETAILS.name}.
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Contact Info Cards */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-theme-card border-theme-muted flex items-start gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="bg-amber-450/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-amber-400">
              <LuMapPin size={22} />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold">Our Head Office</h3>
              <p className="text-theme-secondary text-xs leading-relaxed font-light">
                {COMPANY_DETAILS.address}
              </p>
            </div>
          </div>

          <div className="bg-theme-card border-theme-muted flex items-start gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="bg-amber-455/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-amber-400">
              <LuPhone size={22} />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold">Call Booking Desk</h3>
              <p className="text-theme-secondary text-xs leading-relaxed font-light">
                {COMPANY_DETAILS.phoneCab} (Cab Bookings) <br />
                <span className="text-theme-muted text-[10px]">
                  Support/Tours: {COMPANY_DETAILS.phoneTours}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-theme-card border-theme-muted flex items-start gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="bg-amber-455/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-amber-400">
              <LuMail size={22} />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold">Email Queries</h3>
              <p className="text-theme-secondary text-xs leading-relaxed font-light">
                {COMPANY_DETAILS.emailInfo} <br />
                <span className="text-theme-muted text-[10px]">{COMPANY_DETAILS.emailSupport}</span>
              </p>
            </div>
          </div>

          <div className="bg-theme-card border-theme-muted flex items-start gap-4 rounded-2xl border p-6 shadow-sm">
            <div className="bg-amber-450/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-amber-400">
              <LuClock size={22} />
            </div>
            <div>
              <h3 className="mb-1 text-base font-bold">Working Hours</h3>
              <p className="text-theme-secondary text-xs leading-relaxed font-light">
                Monday to Saturday: 09:00 AM - 08:00 PM <br />
                Sunday: 10:00 AM - 04:00 PM
              </p>
            </div>
          </div>
        </div>

        <div className="bg-theme-card border-theme-muted rounded-3xl border p-8 shadow-lg lg:col-span-2">
          <h2 className="mb-6 text-xl font-bold">Send Us a Message</h2>
          <Formik
            initialValues={{ name: '', email: '', phone: '', message: '' }}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4 text-xs">
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
                  label="Your Message"
                  rows={5}
                  placeholder="Write your query or custom itinerary requests..."
                  className="!bg-theme-input !border-theme-muted !text-theme-primary !resize-none !rounded-xl !px-3 !py-2.5"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="text-zinc-955 mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-bold shadow-md transition-colors hover:bg-amber-300"
                >
                  <LuSend size={14} />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
export default Contact;
