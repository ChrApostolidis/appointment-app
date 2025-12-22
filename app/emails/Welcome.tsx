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

export default function Welcome({
  firstName,
  role,
}: {
  firstName: string;
  role: "provider" | "user";
}) {
  if (role === "provider") {
    return (
      <Html lang="en">
        <Head />
        <Preview>
          Welcome aboard, {firstName}! Set your working hours to get started 🚀
        </Preview>

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
                  Welcome, {firstName}! 👋
                </Heading>

                <Text className="text-gray-600 leading-6 mb-4">
                  We’re excited to have you join our network of providers. Your
                  account has been successfully created and is almost ready to
                  go.
                </Text>

                <Text className="text-gray-600 leading-6 mb-6">
                  <strong className="text-gray-900">
                    Don’t forget to set up your working hours.
                  </strong>{" "}
                  Clients can only see and book you once your availability is
                  configured.
                </Text>

                {/* Checklist */}
                <Section className="mb-6">
                  <ul className="list-disc pl-5 text-gray-600">
                    <li className="mb-1">⏰ Set your working hours</li>
                    <li className="mb-1">📍 Complete your provider profile</li>
                    <li className="mb-1">💼 Start receiving requests</li>
                  </ul>
                </Section>

                <Text className="text-sm text-gray-500 mt-6">
                  If you have any questions or need help getting started, just
                  reply to this email — our team is here for you.
                </Text>

                <Text className="text-sm text-gray-500 mt-4">
                  Best regards,
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

  if (role === "user") {
    return (
      <Html lang="en">
        <Head />
        <Preview>Welcome to AppointMe, {firstName} 👋</Preview>

        <Tailwind>
          <Body className="bg-gray-100 font-sans">
            <Container className="mx-auto py-8">
              <Section className="text-center mb-4">
                <Heading className="text-2xl font-bold text-gray-900">
                  AppointMe
                </Heading>
              </Section>

              <Section className="bg-white rounded-lg px-8 py-10">
                <Heading className="text-xl font-semibold text-gray-900 mb-3">
                  Welcome, {firstName}! 🎉
                </Heading>

                <Text className="text-gray-600 leading-6 mb-4">
                  We’re excited to have you on board. Your account is ready and
                  waiting.
                </Text>
              </Section>

              <Text className="text-center text-xs text-gray-400 mt-6">
                © {new Date().getFullYear()} AppointMe
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }

  if (role !== "provider" && role !== "user") {
    return (
      <Html lang="en">
        <Head />
        <Preview>Welcome!</Preview>
        <Body>
          <Text>Welcome to AppointMe!</Text>
        </Body>
      </Html>
    );
  }
}
