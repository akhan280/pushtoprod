import * as _prisma_generator_helper from '@prisma/generator-helper';
import { DMMF, ConnectorType } from '@prisma/generator-helper';

type datamodel = DMMF.Document["datamodel"];

declare class Datamodel {
    private datamodel;
    constructor(datamodel: datamodel);
    addModel(modelName: string, oldName?: string): void;
    removeModel(modelName: string): void;
    addEnum(enumName: string, oldName?: string): void;
    removeEnum(enumName: string): void;
    addEnumField(enumName: string, field: string): void;
    updateEnumField(enumName: string, field: string, oldField: string): this | undefined;
    removeEnumField(enumName: string, field: string): this | undefined;
    addField(modelName: string, field: DMMF.Field, relationType?: "1-1" | "1-n" | "n-m"): this;
    updateField(modelName: string, originalFieldName: string, field: Partial<DMMF.Field>, isManyToManyRelation?: boolean): this;
    removeField(modelName: string, field: DMMF.Field): this;
    get(): DMMF.Datamodel;
    getIdField(model: string): DMMF.Field;
}

declare abstract class DMMFCommand {
    abstract do(datamodel: Datamodel): void;
    abstract undo(datamodel: Datamodel): void;
}
declare class DMMfModifier {
    private history;
    private datamodel;
    constructor(datamodel: datamodel);
    get(): _prisma_generator_helper.DMMF.Datamodel;
    getModelsNames(): string[];
    getEnumsNames(): string[];
    getEnumOptions(enumName: string): string[];
    set(datamodel: datamodel): void;
    do(command: DMMFCommand): void;
    undo(): void;
}

declare class AddFieldCommand extends DMMFCommand {
    private modelName;
    private field;
    private isManyToManyRelation?;
    constructor(modelName: string, field: DMMF.Field, isManyToManyRelation?: boolean | undefined);
    do(datamodel: Datamodel): void;
    undo(datamodel: Datamodel): void;
}

declare class RemoveFieldCommand extends DMMFCommand {
    private modelName;
    private fieldName;
    private field;
    constructor(modelName: string, fieldName: string);
    do(datamodel: Datamodel): void;
    undo(datamodel: Datamodel): void;
}

declare class UpdateFieldCommand extends DMMFCommand {
    private modelName;
    private originalFieldName;
    private field;
    private isManyToManyRelation;
    constructor(modelName: string, originalFieldName: string, field: Partial<DMMF.Field>, isManyToManyRelation: boolean);
    do(datamodel: Datamodel): void;
    undo(): void;
}

declare class AddModelCommand extends DMMFCommand {
    private modelName;
    private oldModelName?;
    constructor(modelName: string, oldModelName?: string | undefined);
    do(datamodel: Datamodel): void;
    undo(datamodel: Datamodel): void;
}

declare class AddEnumFieldCommand extends DMMFCommand {
    private enumName;
    private field;
    constructor(enumName: string, field: string);
    do(datamodel: Datamodel): void;
    undo(datamodel: Datamodel): void;
}

declare class RemoveEnumFieldCommand extends DMMFCommand {
    private enumName;
    private field;
    constructor(enumName: string, field: string);
    undo(datamodel: Datamodel): void;
    do(datamodel: Datamodel): void;
}

declare class UpdateEnumFieldCommand extends DMMFCommand {
    private enumName;
    private field;
    private oldField;
    constructor(enumName: string, field: string, oldField: string);
    do(datamodel: Datamodel): void;
    undo(): void;
}

declare class AddEnumCommand extends DMMFCommand {
    private enumName;
    private oldField?;
    constructor(enumName: string, oldField?: string | undefined);
    do(datamodel: Datamodel): void;
    undo(datamodel: Datamodel): void;
}

declare class RemoveEnumCommand extends DMMFCommand {
    private enumName;
    constructor(enumName: string);
    do(datamodel: Datamodel): void;
    undo(): void;
}

declare class RemoveModelCommand extends DMMFCommand {
    private modelName;
    constructor(modelName: string);
    do(datamodel: Datamodel): void;
    undo(): void;
}

declare abstract class RelationType {
    relationManager: RelationManager;
    constructor(relationManager: RelationManager);
    abstract update(newField: Partial<DMMF.Field>): void;
}

declare class ManyToMany extends RelationType {
    update(newField: DMMF.Field): void;
}

declare class OneToMany extends RelationType {
    update(newField: DMMF.Field): void;
}

declare class OneToOne extends RelationType {
    update(newField: DMMF.Field): void;
}

declare class RelationManager {
    datamodel: datamodel;
    modelName: string;
    fieldName: string;
    isManyToManyRelation: boolean;
    relationType: RelationType;
    fromModel: DMMF.Model;
    fromField: DMMF.Field;
    foreignKeyField: DMMF.Field;
    fromFieldHasForeignField: boolean;
    toModel: DMMF.Model;
    toField: DMMF.Field;
    toFieldHasForeignField: boolean;
    relationName: string;
    constructor(datamodel: datamodel, modelName: string, fieldName: string, isManyToManyRelation?: boolean);
    update(newField: Partial<DMMF.Field>): void;
    getRelationTypeName(): "n-m" | "1-n" | "1-1";
    getRelationType(relationManager: RelationManager): ManyToMany | OneToOne | OneToMany;
    removeForeignKeyField(): void;
    updateForeignKeyField(props: Partial<DMMF.Field>): void;
    updateFromField(props: Partial<DMMF.Field>): void;
    updateToField(props: Partial<DMMF.Field>): void;
    getIdField(model: string): DMMF.Field;
}

type primitiveDataTypes = "String" | "Int" | "Boolean" | "Float" | "DateTime" | "Decimal" | "BigInt" | "Bytes" | "JSON";
declare const getNativeTypes: (database: ConnectorType, dataType: primitiveDataTypes) => string[];

export { AddEnumCommand, AddEnumFieldCommand, AddFieldCommand, AddModelCommand, DMMFCommand, DMMfModifier, RelationManager, RemoveEnumCommand, RemoveEnumFieldCommand, RemoveFieldCommand, RemoveModelCommand, UpdateEnumFieldCommand, UpdateFieldCommand, getNativeTypes, primitiveDataTypes };
