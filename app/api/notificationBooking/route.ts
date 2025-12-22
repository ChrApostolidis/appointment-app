import NotificationBooking from "@/app/emails/NotifactionBooking";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, startAt, endAt, businessName, serviceCategory,name } =
    await request.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Welcome to AppointMe!",
      react: NotificationBooking({
        name,
        startAt,
        endAt,
        businessName,
        serviceCategory,
      }),
    });

    if (error) {
      console.error("Resend send failed in handler", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Resend send threw", error);
    return Response.json({ error }, { status: 500 });
  }
}
