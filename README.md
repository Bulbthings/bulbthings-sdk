# Bulbthings SDK

![npm](https://img.shields.io/npm/v/@bulbthings/bulbthings-sdk)

The Bulbthings SDK allows you to conveniently interact with the Bulbthings API. The SDK is compatible with any environment where JavaScript/TypeScript is supported, including web browsers, React Native or Node.js applications.

Learn more about Bulbthings on our website: [https://bulbthings.com](https://bulbthings.com)

## Full documentation

-   [HTTP API reference](https://api.bulbthings.com)
-   [Wiki documentation](https://github.com/Bulbthings/bulbthings-sdk/wiki)

## Installation

```shell
npm install @bulbthings/bulbthings-sdk
```

## Authentication

```TypeScript
import { Bulbthings } from '@bulbthings/bulbthings-sdk';

const bulbthings = new Bulbthings({ apiToken: '83945b4eaf...7a37a' });

// Authentication can also be overridden per request
bulbthings.entities.findAll({ apiToken: '83945b4eaf...7a37a' });
```

## Quick start example

```TypeScript
// Fetch your workspace
const workspace = await bulbthings.companies.findById('WORKSPACE_ID');

// Create a category of entities
const customCategory = await bulbthings.entityTypes.create({
    companyId: workspace.id,
    label: 'Category',
});

// Show the category in the workspace
await bulbthings.catalogMappings.create({
    companyId: workspace.id,
    entityTypeId: customCategory.id,
    catalogId: workspace.catalogId,
});

// Create an entity
const entity = await bulbthings.entities.create({
    companyId: workspace.id,
    entityTypeId: customCategory.id,
});

// Create a custom field
const customField = await bulbthings.attributeTypes.create({
    companyId: workspace.id,
    schema: { title: 'Custom property', type: 'string' },
});

// Show the field on the category profiles
await bulbthings.entityTypeMappings.create({
    companyId: workspace.id,
    entityTypeId: customCategory.id,
    type: 'attributeType',
    attributeTypeId: customField.id,
});

// Update the field value for the entity
await bulbthings.measurements.create({
    entityId: entity.id,
    attributeTypeId: customField.id,
    value: 'test',
});
```

## API resources

Most API resources follow the same CRUD model with the following methods:

### findAll

This method returns a list of resources.

```typescript
const entities = await bulbthings.entities.findAll({
    filter: `and(
        gt(attributes.mileage.km, 10000),
        ne(attributes.license, null)
    )`,
    include: ['entityType'],
    page: { limit: 3 },
});

// Or with pagination metadata
const { data: entities, meta } = await bulbthings.entities.findAll(
    { page: { limit: 3 } },
    true
);
```

### findById

This method returns a single resource, using its identifier:

```typescript
const entity = await bulbthings.entities.findById('31845...c8ad6e', {
    include: ['entityType'],
});
```

### create

This method creates a new resource:

```typescript
const measurement = await bulbthings.measurements.create({
    entityId: entity.id,
    attributeTypeId: 'mileage',
    value: 42000,
    period: {
        from: new Date(),
        to: new Date(),
    },
    unitId: 'km',
});
```

### updateById

This method updates a resource:

```typescript
const updatedMeasurement = await bulbthings.measurements.update(
    measurement.id,
    { value: 43000 }
);
```

### deleteById

This method deletes a resource:

```typescript
await bulbthings.entities.deleteById(entity.id);
```

## Events

Every creation, modification or deletion of resources will trigger system events (not to be confused with the actual `events` _resource_) that you can receive and react to in real-time using the SDK.

### Example usage

```typescript
// Event types follow the format: [resource][Created|Updated|Deleted]
const eventType = 'entityCreated';

bulbthings.on([eventType], (event) => {
    // `data.resource` contains the resource described by the event
    // In case of an update event, `data.previousData` contains
    // the values of updated properties before the change
    const entity = event.data.resource as Entity;
});
```
