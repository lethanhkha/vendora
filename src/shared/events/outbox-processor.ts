import { db, outboxEvents } from "@/shared/db";
import { eq } from "drizzle-orm";
import { eventBus } from "./event-bus";

export async function recordOutboxEvent(
  eventType: string,
  aggregateType: string,
  aggregateId: string,
  payload: Record<string, any>,
  client = db
) {
  const [record] = await client
    .insert(outboxEvents)
    .values({
      eventType,
      aggregateType,
      aggregateId,
      payload,
      status: "PENDING",
    })
    .returning();

  return record;
}

export async function processOutboxEvent(eventId: string) {
  const [event] = await db
    .select()
    .from(outboxEvents)
    .where(eq(outboxEvents.id, eventId));

  if (!event || event.status === "PROCESSED") return;

  try {
    await eventBus.publish(
      event.eventType,
      event.payload as Record<string, any>,
      event.aggregateId
    );

    await db
      .update(outboxEvents)
      .set({
        status: "PROCESSED",
        processedAt: new Date(),
      })
      .where(eq(outboxEvents.id, eventId));

    console.log(`[Outbox] ✅ Event ${eventId} (${event.eventType}) marked PROCESSED`);
  } catch (error: any) {
    console.error(`[Outbox] ❌ Failed to process event ${eventId}:`, error.message);
    await db
      .update(outboxEvents)
      .set({
        status: "FAILED",
        retryCount: event.retryCount + 1,
      })
      .where(eq(outboxEvents.id, eventId));
    throw error;
  }
}
