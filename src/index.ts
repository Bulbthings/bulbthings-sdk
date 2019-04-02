import 'reflect-metadata';
import {
    Resource,
    ReadonlyResource,
    ReadonlyCollection
} from './resources/resource';
import {
    Entity,
    EntityType,
    AttributeType,
    Measurement,
    Association,
    AssociationType,
    TimeSeries,
    Unit
} from './models';

const bulbthings = {
    entities: new Resource<Entity>(Entity),
    entityType: new Resource<EntityType>(EntityType),
    attributeTypes: new Resource<AttributeType>(AttributeType),
    measurements: new Resource<Measurement>(Measurement),
    associations: new Resource<Association>(Association),
    associationTypes: new Resource<AssociationType>(AssociationType),
    timeSeries: new ReadonlyCollection<TimeSeries>(TimeSeries),
    units: new ReadonlyResource<Unit>(Unit)
};

const test = async () => {
    // FIND ALL
    const { data: entities, meta } = await bulbthings.entities.findAll({
        filter: `and(
            gt(attributes.mileage.km, 10000),
            ne(attributes.license, null)
        )`,
        include: ['entitytype'],
        page: { limit: 3 }
    });

    // console.log('FIND ALL', entities);

    // FIND BY ID
    const entity = await bulbthings.entities.findById('1', {
        include: ['entitytype']
    });

    // console.log('entity', entity);

    // PARSING
    const { data: associations } = await bulbthings.associations.findAll({
        filter: `eq(targetEntityId,${entity.id})`,
        page: { limit: 1 }
    });

    console.log('associations', associations[0]);

    // CREATE
    // const created = await bulbthings.measurements.create({
    //     targetEntityId: entity.id,
    //     attributeTypeId: '70',
    //     value: 'test',
    //     period: {
    //         from: new Date(),
    //         to: new Date()
    //     },
    //     unitId: '102'
    // });

    // REFRESH
    // await created.refresh({
    //     include: ['targetEntity']
    // });

    // UPDATE
    // const updated = await bulbthings.measurements.update(created.id, {
    //     value: 'edited'
    // });
    // Shortcut method:
    // created.value = 'edited';
    // await created.save();

    // DELETE
    // await bulbthings.entities.deleteById(entity.id);
    // Shortcut method:
    //  await entity.delete();
};

test();
