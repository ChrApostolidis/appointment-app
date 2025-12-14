import Modal from "@/app/profile/components/Modal";
import { XCircle } from "lucide-react";

type FailedModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function FailedModal({ isOpen, onClose }: FailedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center gap-6 text-center py-6 px-4">
        <div className="rounded-full bg-primary/10 p-6">
          <XCircle className="text-red-500" size={72} />
        </div>
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-primary/70">
            Booking Failed
          </p>
          <p className="text-2xl font-semibold text-foreground">We are sorry for that</p>
          <h4 className="text-2xl font-semibold text-foreground">
            Your appointment could not be booked
          </h4>
          <p className="text-muted-foreground">
            Please try booking your appointment again later. If the issue persists, contact support for assistance.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full rounded-lg bg-primary py-2.5 font-semibold text-background transition hover:bg-primary/90"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
}
