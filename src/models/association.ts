// @JsonApiModelConfig({
//     type: 'associations'
// })
// export class Association extends BaseModel {
//     @Attribute()
//     associationTypeId: string;

//     @Attribute()
//     sourceEntityId: string;

//     @Attribute()
//     targetEntityId: string;

//     @Attribute(<AttributeDecoratorOptions>{
//         converter: periodConverter
//     })
//     period: Period;

//     @Attribute()
//     ratio: number;

//     @BelongsTo()
//     associationtype: AssociationType;

//     @BelongsTo()
//     source: Entity;

//     @BelongsTo()
//     target: Entity;
// }
