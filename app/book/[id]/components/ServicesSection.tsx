"use client";

import { useEffect, useState } from "react";
import { singleProvider } from "../../actions/actions";
import MainButton from "@/app/components/MainButton";
import Modal from "@/app/profile/components/Modal";

export default function ServiceSection({
  provider,
  userName,
  userEmail,
}: {
  provider: singleProvider;
  userName: string;
  userEmail: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsSubmitted(false);
  };

  return (
    <>
      <div className="mt-8 rounded-2xl border border-slate-700/50 bg-background shadow-xl backdrop-blur-sm p-6 md:p-8">
        <div className="mb-4">
          <div className="h-1 w-12 bg-primary rounded-full mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            About Our Services
          </h2>
        </div>
        <p className="text-base leading-relaxed text-foreground mb-8">
          {provider.description}
        </p>
        <MainButton
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => setIsOpen(true)}
        >
          Contact Provider
        </MainButton>
      </div>

      <Modal isOpen={isOpen} onClose={handleClose}>
        {isSubmitted ? (
          <div className="text-center py-6">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Message sent!
            </h3>
            <p className="text-foreground mb-6">
              Thanks for reaching out. The provider will get back to you soon.
            </p>
            <MainButton onClick={handleClose}>Close</MainButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">
              Contact Provider
            </h3>

            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Name
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                defaultValue={userName}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                defaultValue={userEmail}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                required
                placeholder="What is your message about?"
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                placeholder="Write your message to the provider here..."
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <MainButton type="submit" variant="primary">
                Send Message
              </MainButton>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
