import { BulbThings } from '..';
import { Mutex } from 'async-mutex';
import { EntityUiNode } from '../interfaces/entity-ui-node';
import { UiNode } from '../interfaces/ui-node';
import { Entity, Association, EntityType, EntityTypeMapping } from '../models';
import { findAll } from '../utils/find-all';
import { findById } from '../utils/find-by-id';

export class UiResource {
    private entityTypesCache: { [entityTypeId: string]: EntityType } = {};
    private entityTypeMappingsCache: {
        [entityTypeId: string]: EntityTypeMapping[];
    } = {};
    private mutexes: { [id: string]: Mutex } = {};

    constructor(private bulbthings: BulbThings) {}

    async getAssociationTree(
        opts: {
            entityTypeId?: string;
            associationTypeId?: string;
            callback?: ({ event: MouseEvent, item: EntityUiNode }) => void;
            fetchActions?: (items: EntityUiNode[]) => Promise<UiNode[]>;
            fetchChildrenCount?: (e: Entity) => Promise<number>;
        } = {}
    ): Promise<EntityUiNode[]> {
        // Fetch all entities
        const allEntities = (
            await findAll(this.bulbthings, Entity, {
                filter: opts.entityTypeId
                    ? `eq(entityTypeId,"${opts.entityTypeId}")`
                    : 'true',
            })
        ).data;

        // Fetch sub-entities ids
        const childEntitiesIds = (
            await findAll(this.bulbthings, Association, {
                fields: { associations: ['sourceEntityId'] },
                filter: `and(${[
                    `or(eq(period,null),contains(period,now()))`,
                    opts.associationTypeId
                        ? `eq(associationTypeId,"${opts.associationTypeId}")`
                        : 'true',
                ]})`,
                group: ['sourceEntityId'],
            })
        ).data.map((a) => a.sourceEntityId);

        // Count children function
        const fetchOrCountChildren = async (entity: Entity, fetch = true) => {
            const results = (
                await findAll(this.bulbthings, Association, {
                    fields: fetch ? null : { associations: ['count(id)'] },
                    filter: `and(${[
                        `or(eq(period,null),contains(period,now()))`,
                        opts.associationTypeId
                            ? `eq(associationTypeId,"${opts.associationTypeId}")`
                            : 'true',
                        `eq(targetEntityId,"${entity.id}")`,
                    ]})`,
                    include: fetch ? ['sourceEntity'] : null,
                })
            ).data;
            return fetch ? results : +results[0]?.['count'] || 0;
        };
        opts.fetchChildrenCount =
            opts.fetchChildrenCount ||
            ((e: Entity) => fetchOrCountChildren(e, false) as Promise<number>);

        // Fetch children function
        const fetchChildren = async (
            item: EntityUiNode,
            params?: { offset: number; limit: number; sort: string[] }
        ): Promise<{ data: EntityUiNode[]; total: number }> => {
            const parentEntity = item.data.entity;
            const children = await Promise.all(
                ((await fetchOrCountChildren(
                    parentEntity
                )) as Association[]).map(async (a) => {
                    const count = await opts.fetchChildrenCount(a.sourceEntity);
                    const uiNode: EntityUiNode = {
                        id: a.sourceEntity.id,
                        type: 'entity',
                        label: await this.getLabel(a.sourceEntity),
                        data: { count, entity: a.sourceEntity },
                        callback: opts.callback,
                        fetchChildren: count ? fetchChildren : undefined,
                    };
                    uiNode.actions = opts.fetchActions
                        ? await opts.fetchActions([uiNode])
                        : undefined;
                    return uiNode;
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
                const uiNode: EntityUiNode = {
                    type: 'entity',
                    id: e.id,
                    label: await this.getLabel(e),
                    data: { count, entity: e },
                    callback: opts.callback,
                    fetchChildren: count ? fetchChildren : undefined,
                };
                uiNode.actions = opts.fetchActions
                    ? await opts.fetchActions([uiNode])
                    : undefined;
                return uiNode;
            });

        return (await Promise.all(itemPromises)).sort(this.sortItems);
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

    async getCachedEntityType(entityTypeId: string) {
        if (!this.entityTypesCache[entityTypeId]) {
            const mId = `entityTypes-${entityTypeId}`;
            this.mutexes[mId] = this.mutexes[mId] || new Mutex();
            const release = await this.mutexes[mId].acquire();
            try {
                this.entityTypesCache[entityTypeId] =
                    this.entityTypesCache[entityTypeId] ||
                    (await findById(this.bulbthings, EntityType, entityTypeId));
            } finally {
                release();
                if (!this.mutexes[mId].isLocked()) {
                    delete this.mutexes[mId];
                }
            }
        }
        return this.entityTypesCache[entityTypeId];
    }

    async getCachedEntityTypeMappings(entityType: EntityType) {
        if (!this.entityTypeMappingsCache[entityType.id]) {
            this.entityTypeMappingsCache[entityType.id] = (
                await findAll(this.bulbthings, EntityTypeMapping, {
                    filter: `and(${[
                        `eq(entityTypeId,"${entityType.id}")`,
                        `or(${[
                            'eq(type,"attributeType")',
                            'eq(type,"associationType")',
                            'eq(type,"actionType")',
                        ]})`,
                    ]})`,
                    sort: ['meta.order'],
                    include: ['attributeType', 'associationType', 'actionType'],
                })
            ).data;
        }
        return this.entityTypeMappingsCache[entityType.id];
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
        return label.replace(/\s\s+/g, ' ').trim();
    }

    private sortItems(a: UiNode, b: UiNode) {
        return a.label.localeCompare(b.label);
    }

    getIcon(entityTypeId: string) {
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
