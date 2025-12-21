import * as React from "react";
import { Html, Heading } from "@react-email/components";

export default function Welcome({ firstName }: { firstName: string }) {
  return (
    <Html lang="en">
      <Heading>Welcome, {firstName}!</Heading>
    </Html>
  );
}
