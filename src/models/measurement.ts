// @JsonApiModelConfig({
//     type: 'measurements'
// })
// export class Measurement extends BaseModel {
//     @Attribute()
//     sourceEntityId: string;

//     @Attribute()
//     targetEntityId: string;

//     @Attribute()
//     attributeTypeId: string;

//     @Attribute()
//     value: any;

//     @Attribute()
//     isAbsolute: boolean;

//     @Attribute(<AttributeDecoratorOptions>{
//         converter: periodConverter
//     })
//     period: Period;

//     @Attribute()
//     unitId: string;

//     @BelongsTo()
//     source: Entity;

//     @BelongsTo()
//     target: Entity;
// }
