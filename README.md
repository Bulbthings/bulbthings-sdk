# Bulbthings SDK

-   [🚧 Documentation 🚧](#---documentation---)
-   [Installation](#installation)
    -   [package.json](#packagejson)
    -   [TODO: npm package](#todo--npm-package)
-   [Authentication](#authentication)
-   [API resources](#api-resources)
    -   [findAll](#findall)
    -   [findById](#findbyid)
    -   [create](#create)
    -   [updateById](#updatebyid)
    -   [deleteById](#deletebyid)
-   [Creating notifications](#creating-notifications)
    -   [Event payload](#event-payload)
        -   [data](#data)
        -   [sections](#sections)
        -   [text](#text)
-   [Time Series](#time-series)
    -   [Get a report](#get-a-report)
        -   [Options](#options)
        -   [Explanation](#explanation)
            -   [Step 0: raw data](#step-0--raw-data)
            -   [Step 1: Resampling](#step-1--resampling)
            -   [Step 2: Aggregating](#step-2--aggregating)
        -   [Other examples](#other-examples)
-   [Events](#events)
    -   [Example usage](#example-usage)
    -   [Testing](#testing)

## 🚧 Documentation 🚧

(Work in progress) See full documentation [here](https://api.bulbthings.com)

## Installation

### package.json

In `dependencies`, put `"bulbthings-sdk": "https://cb76b2588e677ad6f2a2010a610f2dffd534f609@github.com/Bulbthings/bulbthings-sdk.git#{RELEASE}",` where `{RELEASE}` should be found in the [releases page](https://github.com/Bulbthings/bulbthings-sdk/releases).

### TODO: npm package

## Authentication

```typescript
import { Bulbthings } from 'bulbthings-sdk';

const bulbthings = new Bulbthings({ apiToken: '83945b4eaf...7a37a' });

// Authentication can also be overridden per request
bulbthings.entities.findAll({ apiToken: '83945b4eaf...7a37a' });
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

## Creating notifications

Notifications are created using the Event resource:

```typescript
const self = await bulbthings.accounts.findById('self');
const text = (raw = true) =>
    raw ? `Hello "${getLabel(opts.asset)}"` : `Hello <#${opts.asset.id}>`;

await bulbthings.events.create({
    // Identifier of the workspace the event belongs to
    companyId: workspaceId,
    // (Optional) Identifier of the entity the event belongs to
    entityId: entityId,
    // Type of event
    eventTypeId: 'message',
    // Level of priority
    priority: 'danger',
    // (Optional) Only show the event to a given account
    privateForAccountId: opts.account.id,
    // See explanation below
    payload: {
        data: null,
        sections: [
            { type: 'text', value: text(false) },
            { type: 'entity', value: opts.attendance.id },
        ],
        text: `${self.label}: ${text(true)}`,
    },
});
```

### Event payload

The event payload is an object containing 3 properties:

#### data

This property can be used to store data associated with the event. For example, consider the following Event type:

```json
{
    "id": "upcomingMaintenance",
    "schema": {
        "title": "Upcoming maintenance",
        "description": "An asset is due for a maintenance soon.",
        "category": "Maintenances",
        "type": "object",
        "properties": {
            "maintenanceDate": {
                "type": "string",
                "format": "date-time"
            }
        },
        "required": ["maintenanceDate"]
    }
}
```

If we then create an event of type `upcomingMaintenance`, we can provide data that will match the format described by the `schema` property:

```typescript
await bulbthings.events.create({
    ...
    eventTypeId: 'upcomingMaintenance',
    payload: {
        data: { maintenanceDate: "2023-04-05T15:41:00.714Z" },
        ...
    },
});
```

#### sections

The `sections` property is an array that describes the content of the notification. It can contain rich content, such as text mentions, images, reports, documents or maps.
Sections of different types can be combined and will be displayed in the same order as they appear.

For example the following sections:

```typescript
const sections = [
    {
        type: 'text',
        value: `This is text section mentioning an entity <#${entityId}>`,
    },
    {
        type: 'text',
        value: `This is text section mentioning an account <@${accountId}>`,
    },
    {
        type: 'entity',
        // The value is the identifier of a Entity resource
        value: `${entityId}`,
    },
    {
        type: 'file',
        // The value is the identifier of a File resource
        value: `${fileId}`,
    },
    {
        type: 'progressBar',
        value: {
            label: 'Mileage consumption',
            // Value should be between 0-100
            value: 83,
            // Optional, color of the progress bar
            color: '#e91c09',
        },
    },
    {
        type: 'code',
        value: `This is a code section`,
    },
    {
        type: 'map',
        value: {
            markers: [{ position: { lat: 51.512536, lng: -0.035122 } }],
            circles: [
                { center: { lat: 51.5007591, lng: 0.0047272 }, radius: 2000 },
            ],
        },
    },
    {
        type: 'report',
        value: {
            id: 'costsByCategoryOvertime',
            category: 'Financials',
            title: 'Actual costs by category',
            description:
                'This report shows the actual costs by category overtime',
            query: {
                resource: 'entities',
                fields: {
                    entities: [
                        `as(dateTrunc(attributes.billDate,"{{period}}",timezone()),"billDate")`,
                        `as(attributes.costCategory,"costCategory")`,
                        `as(sum(attributes.totalGrossAmount.{{yAxisUnitId}}),"totalGrossAmount")`,
                    ],
                },
                filter: `and(${[
                    `contains(entityType.path,["cost"])`,
                    `ne(attributes.billDate,null)`,
                    `eq(attributes.costStatus,"Actual")`,
                    `contains(range("date","{{from}}","{{to}}"),cast(attributes.billDate,"date"))`,
                ]})`,
                group: [
                    `dateTrunc(attributes.billDate,"{{period}}",timezone())`,
                    `attributes.costCategory`,
                ],
            },
            callback: {
                resource: 'entities',
                filter: `and(${[
                    `contains(entityType.path,["cost"])`,
                    `ne(attributes.billDate,null)`,
                    `eq(attributes.costStatus,"Actual")`,
                    `eq(${[
                        `dateTrunc(attributes.billDate,"{{period}}",timezone())`,
                        `"{{x}}"`,
                    ]})`,
                    `eq(attributes.costCategory,"{{z}}")`,
                ]})`,
            },
            callbackEntityTypeId: 'cost',
            chart: {
                type: 'bar',
                subType: 'stacked',
                xAxis: 'billDate',
                xAxisType: 'time',
                yAxis: 'totalGrossAmount',
                yAxisType: 'attributeType',
                zAxis: 'costCategory',
                zAxisType: 'attributeType',
                expectedTrendDirection: 'down',
            },
        },
    },
];
```

Will generate a notification that looks like this:

![Notification example](https://storage.googleapis.com/bulbthings-catalog/bulbthings-sdk/event-example.png)

#### text

Unlike the `sections` property, the `text` property is used in text-only environments where the rich display is not possible, such as push notifications for iOS/Android.
The value of `text` should be a text-only equivalent of the content displayed in sections. It is good practise to prefix the text with the label of the account sending the notification, for example:

```typescript
const self = await bulbthings.accounts.findById('self');
const text = (raw = true) =>
    raw ? `Hello "${getLabel(opts.asset)}"` : `Hello <#${opts.asset.id}>`;

await bulbthings.events.create({
    ...
    payload: {
        data: null,
        sections: [ { type: 'text', value: text(false) } ],
        text: `${self.label}: ${text(true)}`,
    },
});
```

## Time Series

### Get a report

#### Options

```typescript
export interface TimeSeriesOptions extends Omit<JsonApiOptions, 'page'> {
    from: Date;
    to: Date;
    attributeTypeId: string;
    alignmentPeriod:
        | 'second'
        | 'minute'
        | 'hour'
        | 'day'
        | 'week'
        | 'month'
        | 'quarter'
        | 'year';
    alignmentMethod: 'first' | 'last' | 'count' | 'sum' | 'avg' | 'min' | 'max';
    sourceFilter?: string;
    targetFilter?: string;
    unitCode?: string;
}
```

#### Explanation

Let's take as an example a fictional number attribute with a 1-week period. Here are the different steps happening when generating a report:

##### Step 0: raw data

```
            Week 1   Week 2   Week 3    Week 4
Entity 1         0      100       50         0
Entity 2        50       50       10         0
```

##### Step 1: Resampling

During this step, the `alignmentPeriod` and `alignmentMethod` are used to resample the data for each entity and change the period by aggregating the values.

For example, with `alignmentPeriod=month` and `alignmentMethod=sum` we get:

```
            Month 1
Entity 1        150
Entity 2        110
```

##### Step 2: Aggregating

In this step, `reducerMethod` will be used to aggregate all the series into one. For example, with `reducerMethod=avg` the final result is:

```
            Month 1
Average         130
```

#### Other examples

Example: Get the drivers ranked according to their average driver score during the last week:

```typescript
const data = await bulbthings.timeSeries.getReport({
    from: moment().subtract(1, 'week').toDate(),
    to: new Date(),
    attributeTypeId: `${driverScoreAttributeTypeId}`,
    alignmentPeriod: 'week',
    alignmentMethod: 'avg',
    fields: {
        timeSeries: ['time', 'as(value,"avgScore")'],
    },
    sort: ['-value'],
    include: ['targetEntity'],
});

const driversWithScore = data.map((d) => ({
    driver: d.targetEntity,
    avgScore,
}));
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

### Testing

We are using nock to mock the requests response.
You need to run `npm test` to check that all the tests are passing.
To see the debug from nock, use `DEBUG=nock.* npm test`.
