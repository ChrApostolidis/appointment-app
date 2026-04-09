import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

type AppointmentAutoCancelledProps = {
  name: string;
  businessName: string;
  startAt: string;
  endAt: string;
  serviceCategory: string;
  serviceName?: string;
};

export default function AppointmentAutoCancelled({
  name,
  businessName,
  startAt,
  endAt,
  serviceCategory,
  serviceName,
}: AppointmentAutoCancelledProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your appointment with {businessName} was cancelled</Preview>

      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto py-8 px-4">
            {/* Header */}
            <Section className="text-center mb-6">
              <Heading className="text-2xl font-bold text-gray-900">
                AppointMe
              </Heading>
            </Section>

            {/* Main Card */}
            <Section className="bg-white rounded-lg px-8 py-10">
              <Heading className="text-xl font-semibold text-gray-900 mb-3">
                Appointment Cancelled ❌
              </Heading>

              <Text className="text-gray-600 leading-6 mb-4">
                Hi {name}, unfortunately your appointment was automatically
                cancelled because the provider did not confirm it before the
                scheduled time. Here are the details of the cancelled
                appointment:
              </Text>

              {/* Appointment Details */}
              <Section className="bg-gray-50 rounded-md px-6 py-4 mb-6">
                <Text className="text-gray-700 mb-1">
                  <strong>Company Name:</strong> {businessName}
                </Text>
                <Text className="text-gray-700 mb-1">
                  <strong>Service:</strong> {serviceCategory}
                </Text>
                {serviceName && (
                  <Text className="text-gray-700 mb-1">
                    <strong>Booked Service:</strong> {serviceName}
                  </Text>
                )}
                <Text className="text-gray-700 mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(startAt).toLocaleDateString()}
                </Text>
                <Text className="text-gray-700">
                  <strong>Time: </strong>
                  {new Date(startAt).toLocaleTimeString()} -{" "}
                  {new Date(endAt).toLocaleTimeString()}
                </Text>
              </Section>

              <Text className="text-sm text-gray-500">
                You can book a new appointment with this provider or another
                provider from your dashboard.
              </Text>

              <Text className="text-sm text-gray-500 mt-4">
                We apologise for the inconvenience.
                <br />
                The AppointMe Team
              </Text>
            </Section>

            {/* Footer */}
            <Text className="text-center text-xs text-gray-400 mt-6">
              © {new Date().getFullYear()} AppointMe. All rights reserved.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
