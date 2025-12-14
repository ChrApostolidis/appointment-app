import Modal from "@/app/profile/components/Modal";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";
import { singleProvider } from "../../actions/actions";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 text-center py-6 px-4">
        <div className="rounded-full bg-primary/10 p-6">
          <CheckCircle className="text-green-500" size={72} />
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary/70">
            Booking Confirmed
          </p>
          <h4 className="text-2xl font-semibold text-foreground">
            Your appointment is locked in
          </h4>
          <p className="text-muted-foreground max-w-sm">
            We&apos;ve emailed the details to you. You can review or reschedule anytime from your profile page.
          </p>
        </div>
        <div className="w-full rounded-2xl border border-border bg-background/60 p-4 text-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <CalendarDays size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Provider
                </p>
                <p className="font-medium text-foreground">Provider Name</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <Clock size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Date &amp; Time
                </p>
                <p className="font-medium text-foreground">Jan 12, 14:00</p>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full rounded-lg bg-primary py-2.5 font-semibold text-background transition hover:bg-primary/90"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
