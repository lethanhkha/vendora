export type DomainEvent = {
  id: string;
  type: string;
  timestamp: Date;
  payload: Record<string, any>;
};

export type OrderCreatedPayload = {
  masterOrderId: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  totalAmount: string;
  vendorOrders: {
    vendorOrderId: string;
    subOrderNumber: string;
    vendorId: string;
    items: {
      skuId: string;
      productTitle: string;
      quantity: number;
      unitPrice: string;
    }[];
  }[];
};

type EventHandler<T = any> = (event: DomainEvent & { payload: T }) => Promise<void>;

class LocalEventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe<T = any>(eventType: string, handler: EventHandler<T>) {
    const list = this.handlers.get(eventType) || [];
    list.push(handler);
    this.handlers.set(eventType, list);
  }

  async publish(eventType: string, payload: Record<string, any>, aggregateId: string): Promise<void> {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      type: eventType,
      timestamp: new Date(),
      payload,
    };

    console.log(`[EventBus] 🚀 Dispatched Event: ${eventType} (Aggregate: ${aggregateId})`);

    const handlers = this.handlers.get(eventType) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (err: any) {
        console.error(`[EventBus] ❌ Error in handler for ${eventType}:`, err.message);
        throw err;
      }
    }
  }
}

export const eventBus = new LocalEventBus();
