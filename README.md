# BulbThings JavaScript SDK

## Installation

### package.json

In `dependencies`, put `"bulbthings-javascript-sdk": "https://cb76b2588e677ad6f2a2010a610f2dffd534f609@github.com/Bulbthings/bulbthings-javascript-sdk.git#0.1.0",`

Update version accordingly.

### TODO: npm package

## Usage

```typescript
import BulbThings from 'bulbthings-javascript-sdk';
const bulbthings = new BulbThings();
```

## Resource

### Find all

```typescript
const { data: entities, meta } = await bulbthings.entities.findAll({
    filter: `and(
        gt(attributes.mileage.km, 10000),
        ne(attributes.license, null)
    )`,
    include: ['entitytype'],
    page: { limit: 3 }
});
```

### Find by identifier

```typescript
const entity = await bulbthings.entities.findById('1', {
    include: ['entitytype']
});
```

### TODO: Create

```typescript
const created = await bulbthings.measurements.create({
    targetEntityId: entity.id,
    attributeTypeId: '70',
    value: 'test',
    period: {
        from: new Date(),
        to: new Date()
    },
    unitId: '102'
});
```

### TODO: Refresh

```typescript
await created.refresh({
    include: ['targetEntity']
});
```

### TODO: Update

```typescript
const updated = await bulbthings.measurements.update(created.id, {
    value: 'edited'
});
// Shortcut method:
created.value = 'edited';
await created.save();
```

### TODO: Delete

```typescript
await bulbthings.entities.deleteById(entity.id);
// Shortcut method:
await entity.delete();
```
