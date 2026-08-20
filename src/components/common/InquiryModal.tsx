import { Formik, Form } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { LuX, LuSend, LuMapPin, LuCar, LuCompass, LuSparkles } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useCreateInquiryMutation } from '../../redux/slices/inquiryApiSlice';
import { FormikInput, FormikTextarea } from './formik';

export interface InquiryItem {
  id?: string;
  title: string;
  subtitle?: string;
  type?: 'tour' | 'cab' | 'vehicle' | 'general';
  price?: number | string;
  photo?: string;
  capacity?: number | string;
  duration?: string;
  destination?: string;
}

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InquiryItem | null;
}

export const InquiryModal = ({ isOpen, onClose, item }: InquiryModalProps) => {
  const [createInquiry, { isLoading }] = useCreateInquiryMutation();

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const details = [];
    if (values.travelDate) details.push(`Travel Date: ${values.travelDate}`);
    if (values.passengers) details.push(`Passengers: ${values.passengers}`);
    if (item?.duration) details.push(`Duration: ${item.duration}`);
    if (item?.capacity) details.push(`Capacity: ${item.capacity} Seats`);
    if (item?.price) details.push(`Estimated Price/Rate: ₹${item.price}`);
    if (values.message) details.push(`Message: ${values.message}`);

    const compiledMessage = details.join(' | ');

    const payload = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      planId: item?.id || '',
      planTitle: item?.title || 'General Inquiry',
      message: compiledMessage,
    };

    try {
      await createInquiry(payload).unwrap();
      toast.success('Inquiry submitted successfully! Our agent will contact you shortly.');
      resetForm();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to submit inquiry. Please try again.');
    }
  };

  const getTypeName = () => {
    switch (item?.type) {
      case 'tour':
        return 'Tour Package Booking';
      case 'cab':
        return 'Cab Booking Inquiry';
      case 'vehicle':
        return 'Fleet Charter Inquiry';
      default:
        return 'Booking & Trip Inquiry';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      slotProps={{
        backdrop: {
          className: '!bg-zinc-950/80 !backdrop-blur-md',
        },
        paper: {
          className:
            '!rounded-3xl !border !border-zinc-200 dark:!border-zinc-800 !bg-white dark:!bg-zinc-900 !text-zinc-900 dark:!text-white !shadow-2xl !overflow-hidden !m-4',
          style: {
            maxHeight: 'calc(100vh - 48px)',
          },
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle className="!flex !items-center !justify-between !border-b !border-zinc-150 dark:!border-zinc-800 !bg-zinc-50/70 dark:!bg-zinc-950/40 !p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500 dark:text-amber-400">
            {item?.type === 'vehicle' ? (
              <LuCompass size={20} />
            ) : item?.type === 'cab' ? (
              <LuCar size={20} />
            ) : (
              <LuSparkles size={20} />
            )}
          </div>
          <div>
            <span className="block text-[10px] font-bold tracking-wider text-amber-500 uppercase dark:text-amber-400">
              {getTypeName()}
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {item?.title || 'Fast Booking Inquiry'}
            </h3>
          </div>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          className="!rounded-xl !border !border-zinc-200 dark:!border-zinc-800 !bg-white dark:!bg-zinc-800 !text-zinc-400 hover:!text-zinc-900 dark:hover:!text-white !p-2"
        >
          <LuX size={16} />
        </IconButton>
      </DialogTitle>

      {/* Selected Item Preview Bar */}
      {item && (
        <div className="border-b border-zinc-150 bg-amber-400/5 px-6 py-3 dark:border-zinc-800/80 dark:bg-amber-400/[0.02]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate text-xs font-bold text-zinc-900 dark:text-white">
                  {item.title}
                </span>
                {item.destination && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                    <LuMapPin size={10} /> {item.destination}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500 dark:text-zinc-400">
                {item.duration && (
                  <span>
                    Duration: <strong className="text-zinc-700 dark:text-zinc-300">{item.duration}</strong>
                  </span>
                )}
                {item.capacity && (
                  <span>
                    Capacity: <strong className="text-zinc-700 dark:text-zinc-300">{item.capacity} Seats</strong>
                  </span>
                )}
              </div>
            </div>
            {item.price && (
              <div className="shrink-0 text-right">
                <span className="block text-[9px] font-semibold text-zinc-400 uppercase">Est. Rate</span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  ₹{typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : item.price}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Formik Form Container */}
      <Formik
        initialValues={{
          name: '',
          phone: '',
          email: '',
          travelDate: '',
          passengers: '',
          message: '',
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="flex flex-1 flex-col overflow-hidden">
            <DialogContent className="!space-y-4 !overflow-y-auto !p-6 text-xs text-zinc-700 dark:text-zinc-300">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikInput
                  name="name"
                  label="Your Full Name"
                  placeholder="e.g. Rahul Sharma"
                  required
                />
                <FormikInput
                  name="phone"
                  type="tel"
                  label="Contact Phone Number"
                  placeholder="e.g. +91 98765 43210"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikInput
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="e.g. rahul@example.com"
                  required
                />
                <FormikInput
                  name="travelDate"
                  type="date"
                  label="Preferred Travel Date"
                />
              </div>

              <FormikInput
                name="passengers"
                type="number"
                label="Number of Travelers / Passengers"
                placeholder="e.g. 4 or 35"
                min={1}
              />

              <FormikTextarea
                name="message"
                label="Special Requests / Custom Itinerary"
                rows={3}
                placeholder="Mention pickup point, drop location, hotel preferences, or any specific requirements..."
              />
            </DialogContent>

            {/* Modal Actions */}
            <DialogActions className="!flex !items-center !justify-end !gap-3 !border-t !border-zinc-150 dark:!border-zinc-800 !bg-zinc-50/70 dark:!bg-zinc-950/40 !px-6 !py-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2.5 text-xs font-bold text-zinc-950 shadow-md shadow-amber-400/10 transition-colors hover:bg-amber-300 disabled:opacity-50"
              >
                <LuSend size={13} />
                {isLoading ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
export default InquiryModal;
