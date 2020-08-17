import { BulbThings } from '..';
import { Mutex } from 'async-mutex';
import { UINode } from '../interfaces/ui-node';
import { Entity, Association, EntityType } from '../models';
import pluralize from 'pluralize';

export class UtilsResource {
    private entityTypesCache: { [entityTypeId: string]: EntityType } = {};
    private mutexes: { [id: string]: Mutex } = {};

    constructor(private bulbthings: BulbThings) {}

    clearCache() {
        this.entityTypesCache = {};
    }

    async getCachedEntityType(entityTypeId: string) {
        if (!this.entityTypesCache[entityTypeId]) {
            const mId = `entityTypes-${entityTypeId}`;
            this.mutexes[mId] = this.mutexes[mId] || new Mutex();
            const release = await this.mutexes[mId].acquire();
            try {
                this.entityTypesCache[entityTypeId] =
                    this.entityTypesCache[entityTypeId] ||
                    (await this.bulbthings.entityTypes.findById(entityTypeId));
            } finally {
                release();
                if (!this.mutexes[mId].isLocked()) {
                    delete this.mutexes[mId];
                }
            }
        }
        return this.entityTypesCache[entityTypeId];
    }

    getEntityTypeIcon(entityType: EntityType): string {
        // Slice to copy the array without messing the original
        const path = ((entityType && entityType.path) || []).slice().reverse();
        // Loop in reverse from child type to root type
        for (const typeId of path) {
            const icon = this.getIcon(typeId);
            if (icon) {
                return icon;
            }
        }
        return 'box-open';
    }

    async getLabel(entity: Entity): Promise<string> {
        if (!entity || !entity.attributes) {
            return '';
        } else if (entity.label) {
            return entity.label;
        }

        const entityType =
            entity.entityType ||
            (await this.getCachedEntityType(entity.entityTypeId));
        const coalesce = (e) => e || '';
        const label = [
            'make',
            'brand',
            'model',
            'category',
            'costCategory',
            'reference',
            'license',
            'firstName',
            'lastName',
            'type',
            'label',
            'name',
            'serial',
            'structureName',
            'organisationName',
            'maintenanceType',
            'companyName',
        ]
            .map((e) => coalesce(entity.attributes[e]))
            .join(' ');
        return (
            label.replace(/\s\s+/g, ' ').trim() || entityType.label || entity.id
        );
    }

    async getTreeByAssociation(
        opts: {
            entityTypeId?: string;
            associationTypeId?: string;
            callback?: ({ event: MouseEvent, item: UINode }) => void;
            fetchActions?: (items: UINode[]) => Promise<UINode[]>;
            fetchChildrenCount?: (e: Entity) => Promise<number>;
        } = {}
    ): Promise<UINode[]> {
        // Fetch all entities
        const allEntities = await this.bulbthings.entities.findAll({
            filter: opts.entityTypeId
                ? `eq(entityTypeId,"${opts.entityTypeId}")`
                : 'true',
        });

        // Fetch sub-entities ids
        const childEntitiesIds = (
            await this.bulbthings.associations.findAll({
                fields: { associations: ['sourceEntityId'] },
                filter: `and(${[
                    `or(eq(period,null),contains(period,now()))`,
                    opts.associationTypeId
                        ? `eq(associationTypeId,"${opts.associationTypeId}")`
                        : 'true',
                ]})`,
                group: ['sourceEntityId'],
            })
        ).map((a) => a.sourceEntityId);

        // Count children function
        const fetchOrCountChildren = async (entity: Entity, fetch = true) => {
            const results = await this.bulbthings.associations.findAll({
                fields: fetch ? null : { associations: ['count(id)'] },
                filter: `and(${[
                    `or(eq(period,null),contains(period,now()))`,
                    opts.associationTypeId
                        ? `eq(associationTypeId,"${opts.associationTypeId}")`
                        : 'true',
                    `eq(targetEntityId,"${entity.id}")`,
                ]})`,
                include: fetch ? ['sourceEntity'] : null,
            });
            return fetch ? results : +results[0]?.['count'] || 0;
        };
        opts.fetchChildrenCount =
            opts.fetchChildrenCount ||
            ((e: Entity) => fetchOrCountChildren(e, false) as Promise<number>);

        // Fetch children function
        const fetchChildren = async (
            item: UINode,
            params?: { offset: number; limit: number; sort: string[] }
        ): Promise<{ data: UINode[]; total: number }> => {
            const parentEntity = item.data.entity;
            const children = await Promise.all(
                ((await fetchOrCountChildren(
                    parentEntity
                )) as Association[]).map(async (a) => {
                    const count = await opts.fetchChildrenCount(a.sourceEntity);
                    const node: UINode = {
                        id: a.sourceEntity.id,
                        type: 'entity',
                        label: await this.getLabel(a.sourceEntity),
                        data: { count, entity: a.sourceEntity },
                        callback: opts.callback,
                        fetchChildren: count ? fetchChildren : undefined,
                    };
                    node.actions = opts.fetchActions
                        ? await opts.fetchActions([node])
                        : undefined;
                    return node;
                })
            );
            return {
                data: children.sort(this.sortItems),
                total: children.length,
            };
        };

        const itemPromises = allEntities
            // Filter to keep root entities
            .filter((e) => !childEntitiesIds.includes(e.id))
            .map(async (e) => {
                const count = await opts.fetchChildrenCount(e);
                const node: UINode = {
                    type: 'entity',
                    id: e.id,
                    label: await this.getLabel(e),
                    data: { count, entity: e },
                    callback: opts.callback,
                    fetchChildren: count ? fetchChildren : undefined,
                };
                node.actions = opts.fetchActions
                    ? await opts.fetchActions([node])
                    : undefined;
                return node;
            });

        return (await Promise.all(itemPromises)).sort(this.sortItems);
    }

    async getTreeByEntityType(opts: {
        filter?: string;
        callback?: ({ event: MouseEvent, item: UINode }) => void;
        fetchActions?: (items: UINode[]) => Promise<UINode[]>;
        rootTypes?: EntityType[];
    }): Promise<UINode[]> {
        // Fetch a breakdown of the counts of entities by entity type
        const typeCounts = await this.bulbthings.entities.findAll({
            fields: {
                entities: [
                    'as(unnest(entityType.path),"entityTypeId")',
                    'count(id)',
                ],
            },
            filter: `and(${[
                opts.filter || null,
                opts.rootTypes
                    ? `or(${opts.rootTypes.map(
                          (r) => `contains(entityType.path,["${r.id}"])`
                      )})`
                    : null,
            ].filter((f) => f !== null)})`,
            group: ['unnest(entityType.path)'],
            sort: ['count(id)'],
            include: ['entityType'],
        });

        // Build a hierarchy map for easier acess
        const typeHierarchy = typeCounts.reduce((acc, item) => {
            let current = acc;
            for (const p of item.entityType.path) {
                current[p] = current[p] || {};
                current = current[p];
            }
            return acc;
        }, <{ [type: string]: any }>{});

        // Filter the map to only keep root types
        const filteredHierarchy = opts.rootTypes
            ? opts.rootTypes.reduce((acc, t) => {
                  const sub = t.path.reduce((h, p) => h?.[p], typeHierarchy);
                  if (sub) {
                      acc[t.id] = sub;
                  }
                  return acc;
              }, {})
            : typeHierarchy;

        // Helper function to fetch the list of entities for a given type
        const fetchRows = (
            entityType?: EntityType
        ): ((params: {
            offset: number;
            limit: number;
            sort: string[];
        }) => Promise<{ rows: any[]; total: number }>) => async (p) => {
            const { data, meta } = await this.bulbthings.entities.findAll(
                {
                    filter: `and(${[
                        opts.filter || 'true',
                        entityType
                            ? `contains(entityType.path,["${entityType.id}"])`
                            : 'true',
                    ]})`,
                    page: { offset: p.offset, limit: p.limit },
                    sort: p.sort,
                },
                true
            );
            return { rows: data, total: meta.total };
        };

        // Helper function to convert the hierarchy map to menu items
        const toUINode = async (
            typeId: string,
            value: { [typeId: string]: any } = {}
        ): Promise<UINode> => {
            const typeCount = typeCounts.find((x) => x.entityTypeId === typeId);
            const entityType = typeCount?.entityType;
            const count = +typeCount?.['count'] || 0;
            const fetch = fetchRows(typeCount?.entityType);
            const callback = opts.callback;
            const node: UINode = {
                id: entityType?.id,
                type: 'entityType',
                label: entityType ? pluralize(entityType.label || '') : null,
                icon: this.getEntityTypeIcon(entityType),
                data: { count, entityType },
                callback,
                children: [
                    {
                        type: 'entityType',
                        label: 'All',
                        data: { count, entityType },
                        icon: 'list',
                        fetchChildrenLimit: 10,
                        callback,
                        fetchChildren: async (_, p) => {
                            const { rows, total } = await fetch(p);
                            return {
                                data: await Promise.all(
                                    rows.map(
                                        async (e) =>
                                            <UINode>{
                                                id: e.id,
                                                type: 'entity',
                                                label: await this.getLabel(e),
                                                data: { entity: e },
                                                callback,
                                            }
                                    )
                                ),
                                total,
                            };
                        },
                    },
                    ...(await Promise.all(
                        Object.keys(value).map((k) => toUINode(k, value[k]))
                    )),
                ],
            };

            // Add actions
            node.actions = opts.fetchActions
                ? await opts.fetchActions([node])
                : undefined;
            if (node.actions) {
                node.children[0].actions = node.actions;
            }

            // If "All" is the only child, display the sub-list directly
            if (entityType && node.children.length === 1) {
                const child = node.children[0];
                node.fetchChildren = child.fetchChildren;
                node.fetchChildrenLimit = child.fetchChildrenLimit;
                node.fetchChildrenTotal = child.fetchChildrenTotal;
                delete node.children;
            }

            return node;
        };

        // Skip the root level if there's only one. Also, skip 'All' if no root is specified
        const root =
            opts.rootTypes?.length === 1 &&
            filteredHierarchy[opts.rootTypes[0].id]
                ? opts.rootTypes[0]
                : null;
        const rootItem = await toUINode(
            root?.id,
            root ? filteredHierarchy[root.id] : filteredHierarchy
        );
        return rootItem.children
            ? rootItem.children.slice(!root ? 1 : 0)
            : [rootItem];
    }

    async getCachedEntityTypeMappings(entityTypeId: string, entityTypeMappingsCache) {
        if (!entityTypeMappingsCache || !entityTypeMappingsCache[entityTypeId]) {
            const entityTypeMapping = entityTypeMappingsCache;
            entityTypeMapping[entityTypeId] = await this.bulbthings.entityTypeMappings.findAll({
                filter: `and(${[
                    `eq(entityTypeId,"${entityTypeId}")`,
                    `or(${[
                        'eq(type,"attributeType")',
                        'eq(type,"associationType")',
                        'eq(type,"actionType")',
                    ]})`,
                ]})`,
                sort: ['meta.order'],
                include: ['attributeType', 'associationType', 'actionType'],
            });
            entityTypeMappingsCache = entityTypeMapping;
        }
        return entityTypeMappingsCache;
    }

    private sortItems(a: UINode, b: UINode) {
        return a.label.localeCompare(b.label);
    }

    private getIcon(entityTypeId: string) {
        switch (entityTypeId) {
            case 'activity':
                return 'tools';
            case 'asset':
                return 'toolbox';
            case 'decoration':
                return 'wrench';
            case 'workOrder':
                return 'receipt';
            case 'control':
                return 'wrench';
            case 'damage':
                return 'exclamation-triangle';
            case 'fine':
                return 'exclamation-circle';
            case 'maintenance':
                return 'wrench';
            case 'quotation':
                return 'file';
            case 'repair':
                return 'wrench';
            case 'audioVideo':
                return 'play';
            case 'cleaningEquipment':
                return 'broom';
            case 'mirror':
                return 'toolbox';
            case 'lamp':
                return 'lightbulb';
            case 'audioSystem':
                return 'volume-up';
            case 'vehicleDamage':
                return 'exclamation-triangle';
            case 'vehicleFine':
                return 'exclamation-circle';
            case 'vehicleMaintenance':
                return 'wrench';
            case 'tv':
                return 'tv';
            case 'furniture':
                return 'couch';
            case 'fitnessSpa':
                return 'running';
            case 'facility':
                return 'building';
            case 'massageTable':
                return 'spa';
            case 'pressureWaterCleaner':
                return 'toolbox';
            case 'steamCleaner':
                return 'broom';
            case 'painting':
                return 'portrait';
            case 'sculpture':
                return 'portrait';
            case 'fireAlarm':
                return 'bell';
            case 'it':
                return 'laptop';
            case 'kitchenAppliance':
                return 'tools';
            case 'printer':
                return 'print';
            case 'airExtractingSystem':
                return 'fan';
            case 'building':
                return 'building';
            case 'hvac':
                return 'fan';
            case 'gymEquipment':
                return 'dumbbell';
            case 'jacuzzi':
                return 'hot-tub';
            case 'pool':
                return 'swimming-pool';
            case 'linen':
                return 'bed';
            case 'fridge':
                return 'temperature-low';
            case 'bed':
                return 'bed';
            case 'chair':
                return 'chair';
            case 'sofa':
                return 'couch';
            case 'table':
                return 'box';
            case 'stove':
                return 'temperature-high';
            case 'computer':
                return 'laptop';
            case 'pos':
                return 'laptop';
            case 'vehicle':
                return 'car';
            case 'electricHeavyDutyVehicle':
            case 'fuelHeavyDutyVehicle':
                return 'truck';
            case 'productionMachine':
                return 'cogs';
            case 'phone':
                return 'phone';
            case 'tablet':
                return 'tablet';
            case 'coffeeMaker':
                return 'coffee';
            case 'cooker':
                return 'temperature-high';
            case 'dishwarmer':
                return 'temperature-high';
            case 'dishwasher':
                return 'tint';
            case 'drinkDispenser':
                return 'glass-whiskey';
            case 'foodPresentation':
                return 'hamburger';
            case 'oven':
                return 'temperature-high';
            case 'bedSheet':
                return 'bed';
            case 'towel':
                return 'shower';
            case 'car':
                return 'car';
            case 'vehicleService':
                return 'wrench';
            case 'vehicleContract':
                return 'receipt';
            case 'thirdparty':
                return 'building';
            case 'organisation':
                return 'building';
            case 'contractual':
                return 'file-contract';
            case 'expenditure':
                return 'money-bill';
            case 'lifecycle':
                return 'recycle';
            case 'assetExit':
                return 'sign-out-alt';
            case 'depreciation':
                return 'money-bill';
            case 'billFixedAsset':
                return 'file-invoice';
            case 'insurer':
                return 'building';
            case 'warranty':
                return 'file-invoice';
            case 'contract':
                return 'file-contract';
            case 'credit':
                return 'money-bill';
            case 'leasing':
                return 'file-contract';
            case 'service':
                return 'wrench';
            case 'shortTerm':
                return 'clock';
            case 'supplier':
                return 'building';
            case 'billExpense':
                return 'file-invoice';
            case 'cost':
                return 'money-bill';
            case 'user':
                return 'user';
            case 'assetOrder':
                return 'file-alt';
            case 'technician':
                return 'wrench';
            case 'bedLinen&Towel':
                return 'bed';
            case 'constructionCar':
                return 'car';
            case 'constructionLightGoodsVehicle':
                return 'car';
            case 'lightGoodsVehicle':
                return 'car';
            case 'costumesAndAccessory':
                return 'tshirt';
            case 'decorFurniture':
                return 'sofa';
            case 'garden':
                return 'sun';
            case 'gym':
                return 'dumbbell';
            case 'healthAndSafety':
                return 'book-medical';
            case 'heavyDutyVehicle':
                return 'snowplow';
            case 'kitchen':
                return 'utensils';
            case 'labAndChemistry':
                return 'flask';
            case 'laboratory':
                return 'flask';
            case 'machineTool':
                return 'tools';
            case 'medical':
                return 'book-medical';
            case 'musicalInstrument':
                return 'guitar';
            case 'otherArtEquipmentAndAccessory':
                return 'paint-brush';
            case 'portableAccessory':
                return 'book';
            case 'proAudioAndRecording':
                return 'volume-up';
            case 'productionMachine':
                return 'toolbox';
            case 'professionalEquipment':
                return 'tools';
            case 'proPhotoAndFilming':
                return 'video';
            case 'wasteContainer':
                return 'trash';
            case 'ppe':
                return 'shield-virus';
            case 'faceShield':
                return 'head-side-mask';
            case 'gloves':
                return 'mitten';
            case 'goggles':
                return 'glasses';
            case 'gown':
                return 'tshirt';
            case 'headCover':
                return 'shield-virus';
            case 'mask':
                return 'head-side-mask';
            case 'respirator':
                return 'head-side-mask';
            case 'shoeCover':
                return 'shoe-prints';
            default:
                return null;
        }
    }
}
