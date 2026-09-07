import { IEventBus, DomainEvent } from '../event-bus.interface';
import { ICacheProvider } from '../../cache/interfaces/cache-provider.interface';
import { defaultEventBus } from '../memory-event-bus';
import { cacheProvider } from '../../cache/cache.factory';
import { logger } from '../../logger';

export type TagExtractor<T = any> = (event: DomainEvent<T>) => string[] | string;

/**
 * Low-Level Design (LLD): Event-Driven Cache Invalidation Bridge
 * Subscribes to Domain Events and automatically invalidates associated Cache Tags in Component 3.
 */
export class CacheInvalidationBridge {
  constructor(
    private eventBus: IEventBus = defaultEventBus,
    private cache: ICacheProvider = cacheProvider
  ) {}

  /**
   * Registers an automatic cache invalidation rule for a domain event.
   */
  public registerRule<T>(eventName: string, tagExtractor: TagExtractor<T>): void {
    this.eventBus.subscribe(eventName, async (event: DomainEvent<T>) => {
      try {
        const extractedTags = tagExtractor(event);
        const tags = Array.isArray(extractedTags) ? extractedTags : [extractedTags];

        if (tags.length > 0) {
          logger.debug(
            { eventName: event.eventName, tags, eventId: event.id },
            'CacheInvalidationBridge: Invalidating cache tags on domain event'
          );
          await this.cache.invalidateByTags(tags);
        }
      } catch (err: any) {
        logger.error(
          { eventName: event.eventName, error: err?.message },
          'CacheInvalidationBridge: Failed to invalidate cache tags'
        );
      }
    });
  }
}

export const defaultCacheInvalidationBridge = new CacheInvalidationBridge();
