import { addCustomerId, insertSubscriptionDetails, updateSubscriptionDetails } from "@/lib/queries";
import { Environment, EventName } from "@paddle/paddle-node-sdk";
import { Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";

const paddle = new Paddle(process.env.PADDLE_SECRET_TOKEN!, {
  environment: Environment.sandbox,
});

export async function POST(req: Request) {
  const signature = (req.headers.get("paddle-signature") as string) || "";
  const rawRequestBody = (await req.text()) || "";
  const secretKey = process.env.PADDLE_NOTIFICATION_WEBHOOK_SECRET || "";

  try {
    if (signature && rawRequestBody) {
      const eventData = await paddle.webhooks.unmarshal(
        rawRequestBody,
        secretKey,
        signature
      );

      switch (eventData.eventType) {
        case EventName.SubscriptionTrialing:
          await addCustomerId(eventData.data.customerId, "customData" in eventData.data ? (eventData.data.customData as { orgId: string })?.orgId : "");
          await insertSubscriptionDetails(
            eventData.data.id,
            eventData.data.customerId,
            eventData.data.items[0]?.price?.name ?? "",
            eventData.data.billingCycle.interval,
            eventData.data.status,
            true
          );
          return NextResponse.json({ ok: true });
        default:
          await updateSubscriptionDetails(
            eventData.data.id,
            "customerId" in eventData.data && eventData.data.customerId ? eventData.data.customerId : "",
            "items" in eventData.data && "product" in eventData.data.items[0] ? (eventData.data.items[0] as any).price?.name ?? "" : "",
            "billingCycle" in eventData.data && eventData.data.billingCycle ? eventData.data.billingCycle.interval : "",
            "status" in eventData.data ? eventData.data.status : "",
            false
          );
          return NextResponse.json({ ok: true });
      }
    } else {
      console.log("Signature missing in header");
    }
  } catch (e) {
    console.log(e);
  }

}
