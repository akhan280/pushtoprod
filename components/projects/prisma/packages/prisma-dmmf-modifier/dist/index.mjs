// src/helpers.ts
var addFieldWithSafeName = (datamodel, modelName, field) => {
  const dmmf = datamodel.models;
  const currentModel = dmmf.find((model) => model.name === modelName);
  const fieldNames = currentModel.fields.map((field2) => field2.name);
  let fieldName = field.name;
  let digit = 1;
  while (fieldNames.includes(fieldName)) {
    fieldName = `${field.name}${digit}`;
    digit++;
  }
  field.name = fieldName;
  dmmf.forEach((model) => {
    if (model.name === modelName) {
      model.fields.push(field);
    }
  });
  return field.name;
};
var addEnumFieldWithSafeName = (datamodel, enumName, field) => {
  const dmmf = datamodel.enums;
  const currentModel = dmmf.find((e) => e.name === enumName);
  const fieldNames = currentModel.values.map((field2) => field2.name);
  let fieldName = field;
  let digit = 1;
  while (fieldNames.includes(fieldName)) {
    fieldName = `${field}${digit}`;
    digit++;
  }
  dmmf.forEach((model) => {
    if (model.name === enumName) {
      model.values.push({ name: fieldName, dbName: null });
    }
  });
  return fieldName;
};

// src/relationManager/relationType/relationType.ts
var RelationType = class {
  constructor(relationManager) {
    this.relationManager = relationManager;
  }
};

// src/relationManager/relationType/manyToMany.ts
var ToOneToMany = class {
  update(relationManager, newField) {
    relationManager.fromField.isList = false;
    relationManager.fromField.isRequired = newField.isRequired;
    const toModelIdField = relationManager.getIdField(
      relationManager.toModel.name
    );
    const newFieldName = addFieldWithSafeName(
      relationManager.datamodel,
      relationManager.fromModel.name,
      {
        name: `${newField.name}Id`,
        kind: "scalar",
        isList: false,
        isRequired: newField.isRequired,
        isUnique: false,
        isId: false,
        isReadOnly: true,
        hasDefaultValue: false,
        type: toModelIdField.type,
        isGenerated: false,
        isUpdatedAt: false
      }
    );
    relationManager.fromField.relationFromFields = [newFieldName];
    relationManager.fromField.relationToFields = [toModelIdField.name];
  }
};
var ToReverseOneToMany = class {
  update(relationManager, newField) {
    relationManager.toField.isList = false;
    relationManager.toField.isRequired = newField.isRequired;
    const fromModelIdField = relationManager.getIdField(
      relationManager.fromModel.name
    );
    const newFieldName = addFieldWithSafeName(
      relationManager.datamodel,
      relationManager.toModel.name,
      {
        name: `${newField.name}Id`,
        kind: "scalar",
        isList: false,
        isRequired: newField.isRequired,
        isUnique: false,
        isId: false,
        isReadOnly: true,
        hasDefaultValue: false,
        type: fromModelIdField.type,
        isGenerated: false,
        isUpdatedAt: false
      }
    );
    relationManager.toField.relationFromFields = [newFieldName];
    relationManager.toField.relationToFields = [fromModelIdField.name];
  }
};
var ManyToMany = class extends RelationType {
  update(newField) {
    const updates = [
      [
        newField.isList && !this.relationManager.isManyToManyRelation,
        ToReverseOneToMany
      ],
      [!newField.isList, ToOneToMany]
    ];
    for (const [condition, Class] of updates) {
      if (condition) {
        const instance = new Class();
        instance.update(this.relationManager, newField);
        break;
      }
    }
  }
};

// src/relationManager/relationType/oneToOne.ts
var ToManyToMany = class {
  update(relationManager) {
    relationManager.updateFromField({
      name: relationManager.fromField.name,
      kind: "object",
      isList: true,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      hasDefaultValue: false,
      type: relationManager.toModel.name,
      relationName: relationManager.relationName,
      relationFromFields: [],
      relationToFields: [],
      isGenerated: false,
      isUpdatedAt: false
    });
    relationManager.updateToField({
      name: relationManager.toField.name,
      kind: "object",
      isList: true,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      hasDefaultValue: false,
      type: relationManager.fromModel.name,
      relationName: relationManager.relationName,
      relationFromFields: [],
      relationToFields: [],
      isGenerated: false,
      isUpdatedAt: false
    });
    relationManager.removeForeignKeyField();
  }
};
var ToOneToMany2 = class {
  update(relationManager) {
    relationManager.updateFromField({
      name: relationManager.fromField.name,
      kind: "object",
      isList: true,
      isRequired: true,
      isUnique: false,
      isId: false,
      isReadOnly: false,
      hasDefaultValue: false,
      type: relationManager.toModel.name,
      relationName: relationManager.relationName,
      relationFromFields: [],
      relationToFields: [],
      isGenerated: false,
      isUpdatedAt: false
    });
    if (relationManager.fromFieldHasForeignField) {
      relationManager.removeForeignKeyField();
      const fromModelIdField = relationManager.getIdField(
        relationManager.fromModel.name
      );
      const fieldName = addFieldWithSafeName(
        relationManager.datamodel,
        relationManager.toModel.name,
        {
          name: `${relationManager.toField.name}Id`,
          kind: "scalar",
          isList: false,
          isRequired: false,
          isUnique: false,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: fromModelIdField.type,
          isGenerated: false,
          isUpdatedAt: false
        }
      );
      relationManager.toField.relationFromFields = [fieldName];
      relationManager.toField.relationToFields = [fromModelIdField.name];
    } else {
      relationManager.updateForeignKeyField({
        ...relationManager.foreignKeyField,
        isUnique: false
      });
    }
  }
};
var ToRequired = class {
  update(relationManager, newField) {
    if (relationManager.fromFieldHasForeignField) {
      relationManager.fromField.isRequired = true;
      relationManager.foreignKeyField.isRequired = true;
    } else {
      relationManager.removeForeignKeyField();
      relationManager.toField.isRequired = false;
      relationManager.toField.relationFromFields = [];
      relationManager.toField.relationToFields = [];
      relationManager.fromField.isRequired = true;
      const toModelIdField = relationManager.getIdField(
        relationManager.toModel.name
      );
      const idFieldName = addFieldWithSafeName(
        relationManager.datamodel,
        relationManager.fromModel.name,
        {
          name: `${newField.name}Id`,
          isRequired: true,
          kind: "scalar",
          isList: false,
          isUnique: true,
          isId: false,
          isReadOnly: true,
          hasDefaultValue: false,
          type: toModelIdField.type,
          isGenerated: false,
          isUpdatedAt: false
        }
      );
      relationManager.fromField.relationFromFields = [idFieldName];
      relationManager.fromField.relationToFields = [toModelIdField.name];
    }
  }
};
var ToNotRequired = class {
  update(relationManager) {
    relationManager.fromField.isRequired = false;
    relationManager.foreignKeyField.isRequired = false;
  }
};
var OneToOne = class extends RelationType {
  update(newField) {
    const oldField = this.relationManager.fromField;
    const updates = [
      [
        newField.isList && this.relationManager.isManyToManyRelation,
        ToManyToMany
      ],
      [newField.isList, ToOneToMany2],
      [newField.isRequired && !oldField.isRequired, ToRequired],
      [!newField.isRequired && oldField.isRequired, ToNotRequired]
    ];
    for (const [condition, Class] of updates) {
      if (condition) {
        const instance = new Class();
        instance.update(this.relationManager, newField);
        break;
      }
    }
  }
};

// src/relationManager/relationType/oneToMany.ts
var ToManyToMany2 = class {
  update(relationManager) {
    if (relationManager.fromFieldHasForeignField) {
      relationManager.updateFromField({
        name: relationManager.fromField.name,
        kind: "object",
        isList: true,
        isRequired: true,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: false,
        type: relationManager.toModel.name,
        relationName: relationManager.relationName,
        relationFromFields: [],
        relationToFields: [],
        isGenerated: false,
        isUpdatedAt: false
      });
    } else {
      relationManager.updateToField({
        name: relationManager.toField.name,
        kind: "object",
        isList: true,
        isRequired: true,
        isUnique: false,
        isId: false,
        isReadOnly: false,
        hasDefaultValue: false,
        type: relationManager.fromModel.name,
        relationName: relationManager.relationName,
        relationFromFields: [],
        relationToFields: [],
        isGenerated: false,
        isUpdatedAt: false
      });
    }
    relationManager.removeForeignKeyField();
  }
};
var ToOneToOne = class {
  update(relationManager, newField) {
    relationManager.fromField.isList = false;
    relationManager.fromField.isRequired = false;
    if (newField.isRequired) {
      const toRequired = new ToRequired();
      toRequired.update(relationManager, newField);
    }
  }
};
var ToRequired2 = class {
  update(relationManager) {
    if (relationManager.fromField.isList)
      return;
    relationManager.fromField.isRequired = true;
    relationManager.foreignKeyField.isRequired = true;
  }
};
var ToNotRequired2 = class {
  update(relationManager) {
    if (relationManager.fromField.isList)
      return;
    relationManager.fromField.isRequired = false;
    relationManager.foreignKeyField.isRequired = false;
  }
};
var OneToMany = class extends RelationType {
  update(newField) {
    const oldField = this.relationManager.fromField;
    const updates = [
      [
        newField.isList && (this.relationManager.isManyToManyRelation || !oldField.isList),
        ToManyToMany2
      ],
      [!newField.isList && oldField.isList, ToOneToOne],
      [newField.isRequired && !oldField.isRequired, ToRequired2],
      [!newField.isRequired && oldField.isRequired, ToNotRequired2]
    ];
    for (const [condition, Class] of updates) {
      if (condition) {
        const instance = new Class();
        instance.update(this.relationManager, newField);
        break;
      }
    }
  }
};

// src/relationManager/index.ts
var RelationManager = class {
  constructor(datamodel, modelName, fieldName, isManyToManyRelation = false) {
    this.datamodel = datamodel;
    this.modelName = modelName;
    this.fieldName = fieldName;
    this.isManyToManyRelation = isManyToManyRelation;
    this.fromModel = this.datamodel.models.find(
      (m) => m.name === this.modelName
    );
    if (!this.fromModel)
      throw Error("From modal not found");
    this.fromField = this.fromModel.fields.find(
      (f) => f.name === this.fieldName
    );
    if (!this.fromField)
      throw Error("From field not found");
    this.fromFieldHasForeignField = Array.isArray(this.fromField.relationFromFields) && this.fromField.relationFromFields.length > 0;
    if (this.fromFieldHasForeignField) {
      this.foreignKeyField = this.fromModel.fields.find(
        (f) => f.name === this.fromField.relationFromFields[0]
      );
    }
    this.toModel = this.datamodel.models.find(
      (m) => m.name === this.fromField.type
    );
    if (!this.toModel)
      throw Error("to modal not found");
    this.relationName = this.fromField.relationName;
    this.toField = this.toModel.fields.find(
      (f) => f.relationName === this.relationName
    );
    if (!this.toField)
      throw Error("to field not found");
    this.toFieldHasForeignField = Array.isArray(this.toField.relationFromFields) && this.toField.relationFromFields.length > 0;
    if (this.toFieldHasForeignField) {
      this.foreignKeyField = this.toModel.fields.find(
        (f) => f.name === this.toField.relationFromFields[0]
      );
    }
    this.relationType = this.getRelationType(this);
  }
  update(newField) {
    this.relationType.update(newField);
  }
  getRelationTypeName() {
    if (this.fromField.isList && this.toField.isList) {
      return "n-m";
    } else if (this.fromField.isList || this.toField.isList) {
      return "1-n";
    }
    return "1-1";
  }
  getRelationType(relationManager) {
    const type = this.getRelationTypeName();
    const relationTypes = {
      "1-1": OneToOne,
      "1-n": OneToMany,
      "n-m": ManyToMany
    };
    return new relationTypes[type](relationManager);
  }
  removeForeignKeyField() {
    const modelHadForeignKey = this.fromFieldHasForeignField ? "fromModel" : "toModel";
    this[modelHadForeignKey].fields = this[modelHadForeignKey].fields.filter(
      (f) => f.name !== this.foreignKeyField.name
    );
  }
  updateForeignKeyField(props) {
    const model = this.fromFieldHasForeignField ? "fromModel" : "toModel";
    const index = this[model].fields.findIndex(
      (f) => f.name === this.foreignKeyField.name
    );
    this[model].fields[index] = { ...this[model].fields[index], ...props };
  }
  updateFromField(props) {
    const formFieldIndex = this.fromModel.fields.findIndex(
      (f) => f.name === this.fromField.name
    );
    this.fromModel.fields[formFieldIndex] = {
      ...this.fromModel.fields[formFieldIndex],
      ...props
    };
  }
  updateToField(props) {
    const toFieldIndex = this.toModel.fields.findIndex(
      (f) => f.name === this.toField.name
    );
    this.toModel.fields[toFieldIndex] = {
      ...this.toModel.fields[toFieldIndex],
      ...props
    };
  }
  getIdField(model) {
    return this.datamodel.models.find((m) => m.name === model).fields.find((f) => f.isId);
  }
};

// src/datamodel.ts
var Datamodel = class {
  constructor(datamodel) {
    this.datamodel = datamodel;
  }
  addModel(modelName, oldName) {
    if (oldName) {
      const oldModelIndex = this.datamodel.models.findIndex(
        (m) => m.name === oldName
      );
      this.datamodel.models[oldModelIndex].name = modelName;
      this.datamodel.models = this.datamodel.models.map((d) => ({
        ...d,
        fields: d.fields.map((f) => {
          if (f.type !== oldName)
            return f;
          return { ...f, type: modelName };
        })
      }));
    } else {
      const modelIndex = this.datamodel.models.findIndex(
        (m) => m.name === modelName
      );
      if (modelIndex === -1)
        this.datamodel.models.push({
          name: modelName,
          dbName: null,
          fields: [
            {
              name: "id",
              kind: "scalar",
              isList: false,
              isRequired: true,
              isUnique: false,
              isId: true,
              isReadOnly: false,
              hasDefaultValue: true,
              type: "Int",
              default: {
                name: "autoincrement",
                args: []
              },
              isGenerated: false,
              isUpdatedAt: false
            }
          ],
          primaryKey: null,
          uniqueFields: [],
          uniqueIndexes: [],
          isGenerated: false
        });
    }
  }
  removeModel(modelName) {
    const relationNames = [];
    this.datamodel.models.find((d) => d.name === modelName).fields.forEach((f) => {
      if (f.relationName)
        relationNames.push(f.relationName);
    });
    const foreignKeys = [];
    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.filter((f) => {
        if (!f.relationName)
          return true;
        else if (relationNames.includes(f.relationName)) {
          if (f.relationFromFields && f.relationFromFields.length > 0) {
            foreignKeys.push(
              ...f.relationFromFields.map((k) => ({ model: d.name, key: k }))
            );
          }
          return false;
        }
        return true;
      })
    }));
    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.filter((f) => {
        if (foreignKeys.findIndex(
          (k) => k.key === f.name && k.model === d.name
        ) !== -1) {
          return false;
        }
        return true;
      })
    }));
    this.datamodel.models = this.datamodel.models.filter(
      (m) => m.name !== modelName
    );
  }
  addEnum(enumName, oldName) {
    if (oldName) {
      const oldEnumIndex = this.datamodel.enums.findIndex(
        (m) => m.name === oldName
      );
      this.datamodel.enums[oldEnumIndex].name = enumName;
      this.datamodel.models = this.datamodel.models.map((d) => ({
        ...d,
        fields: d.fields.map((f) => {
          if (f.type !== oldName)
            return f;
          return { ...f, type: enumName };
        })
      }));
    } else {
      const enumIndex = this.datamodel.enums.findIndex(
        (m) => m.name === enumName
      );
      if (enumIndex === -1)
        this.datamodel.enums.push({
          name: enumName,
          values: [{ dbName: null, name: "CHANGE_ME" }],
          dbName: null
        });
    }
  }
  removeEnum(enumName) {
    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.filter((f) => {
        if (f.type === enumName)
          return false;
        return true;
      })
    }));
    this.datamodel.enums = this.datamodel.enums.filter(
      (e) => e.name !== enumName
    );
  }
  addEnumField(enumName, field) {
    addEnumFieldWithSafeName(this.datamodel, enumName, field);
  }
  updateEnumField(enumName, field, oldField) {
    const enumIndex = this.datamodel.enums.findIndex(
      (e) => e.name === enumName
    );
    if (enumIndex === -1)
      return;
    const valueIndex = this.datamodel.enums[enumIndex].values.findIndex(
      (e) => e.name === oldField
    );
    if (valueIndex === -1)
      return;
    this.datamodel.enums[enumIndex].values[valueIndex].name = field;
    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.map((f) => {
        if (f.type === enumName && f.default === oldField)
          return { ...f, default: field };
        return f;
      })
    }));
    return this;
  }
  removeEnumField(enumName, field) {
    const enumIndex = this.datamodel.enums.findIndex(
      (e) => e.name === enumName
    );
    if (enumIndex === -1)
      return;
    this.datamodel.enums[enumIndex].values = this.datamodel.enums[enumIndex].values.filter((v) => v.name !== field);
    this.datamodel.models = this.datamodel.models.map((d) => ({
      ...d,
      fields: d.fields.map((f) => {
        if (f.type === enumName && f.default === field) {
          delete f.default;
        }
        return f;
      })
    }));
    return this;
  }
  addField(modelName, field, relationType) {
    const addedFieldName = addFieldWithSafeName(
      this.datamodel,
      modelName,
      field
    );
    const currentModel = this.datamodel.models.find(
      (model) => model.name === modelName
    );
    if (relationType) {
      const relationNames = currentModel.fields.flatMap((f) => {
        if (f.name !== field.name)
          return [f.relationName];
        return [];
      });
      let relationName = field.relationName;
      let digit = 1;
      while (relationNames.includes(relationName)) {
        relationName = `${field.relationName || ""}${digit}`;
        digit++;
      }
      field.relationName = relationName;
      switch (relationType) {
        case "1-1": {
          const toIdField = this.getIdField(field.type);
          const newFieldName = addFieldWithSafeName(this.datamodel, modelName, {
            name: `${addedFieldName}Id`,
            kind: "scalar",
            isList: false,
            isRequired: field.isRequired,
            isUnique: true,
            isId: false,
            isReadOnly: true,
            hasDefaultValue: false,
            type: toIdField.type,
            isGenerated: false,
            isUpdatedAt: false
          });
          field.relationFromFields = [newFieldName];
          field.relationToFields = [toIdField.name];
          this.addField(field.type, {
            name: modelName.toLowerCase(),
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: modelName,
            relationName: field.relationName,
            relationFromFields: [],
            relationToFields: [],
            isGenerated: false,
            isUpdatedAt: false
          });
          break;
        }
        case "1-n": {
          const fromIdField = this.getIdField(modelName);
          const newFieldName = addFieldWithSafeName(
            this.datamodel,
            field.type,
            {
              name: `${modelName.toLowerCase()}Id`,
              kind: "scalar",
              isList: false,
              isRequired: false,
              isUnique: false,
              isId: false,
              isReadOnly: true,
              hasDefaultValue: false,
              type: fromIdField.type,
              isGenerated: false,
              isUpdatedAt: false
            }
          );
          field.relationFromFields = [];
          field.relationToFields = [];
          addFieldWithSafeName(this.datamodel, field.type, {
            name: modelName.toLowerCase(),
            kind: "object",
            isList: false,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: modelName,
            relationName: field.relationName,
            relationFromFields: [newFieldName],
            relationToFields: [fromIdField.name],
            isGenerated: false,
            isUpdatedAt: false
          });
          break;
        }
        case "n-m": {
          field.relationFromFields = [];
          field.relationToFields = [];
          this.addField(field.type, {
            name: modelName.toLowerCase(),
            kind: "object",
            isList: true,
            isRequired: false,
            isUnique: false,
            isId: false,
            isReadOnly: false,
            hasDefaultValue: false,
            type: modelName,
            relationName: field.relationName,
            relationFromFields: [],
            relationToFields: [],
            isGenerated: false,
            isUpdatedAt: false
          });
          break;
        }
        default:
          break;
      }
    }
    return this;
  }
  updateField(modelName, originalFieldName, field, isManyToManyRelation = false) {
    const dmmf = this.datamodel.models;
    const model = dmmf.find((model2) => model2.name === modelName);
    const fieldIndex = model.fields.findIndex(
      (f) => f.name === originalFieldName
    );
    if (model.fields[fieldIndex].kind === "scalar" && field.kind === "scalar" || model.fields[fieldIndex].kind === "enum" && field.kind === "enum") {
      const updated = { ...model.fields[fieldIndex], ...field };
      if (typeof updated.default === "string") {
        updated.default = updated.default.replaceAll('"', "");
        if (updated.type === "Int")
          updated.default = +updated.default;
      }
      if (updated.default === void 0)
        delete updated.default;
      if (updated.native === void 0)
        delete updated.native;
      model.fields[fieldIndex] = updated;
    } else {
      const relationManager = new RelationManager(
        this.datamodel,
        modelName,
        originalFieldName,
        isManyToManyRelation
      );
      relationManager.update(field);
      if (field.name)
        relationManager.fromField.name = field.name;
    }
    return this;
  }
  removeField(modelName, field) {
    const modelIndex = this.datamodel.models.findIndex(
      (m) => m.name === modelName
    );
    if (modelIndex === -1)
      return this;
    const fieldsToBeRemoved = [...field.relationFromFields || [], field.name];
    this.datamodel.models[modelIndex].fields = this.datamodel.models[modelIndex].fields.filter((f) => !fieldsToBeRemoved.includes(f.name));
    const relationName = field.relationName;
    if (relationName) {
      const foreignModelIndex = this.datamodel.models.findIndex(
        (m) => m.name === field.type
      );
      if (foreignModelIndex === -1)
        return this;
      const foreignFieldsToBeRemoved = [];
      this.datamodel.models[foreignModelIndex].fields = this.datamodel.models[foreignModelIndex].fields.filter((f) => {
        if (f.relationName === relationName) {
          foreignFieldsToBeRemoved.push(...f.relationFromFields || []);
          return false;
        }
        return true;
      }).filter((f) => !foreignFieldsToBeRemoved.includes(f.name));
    }
    return this;
  }
  get() {
    return this.datamodel;
  }
  getIdField(model) {
    return this.datamodel.models.find((m) => m.name === model).fields.find((f) => f.isId);
  }
};

// src/dmmfModifier.ts
var DMMFCommand = class {
};
var DMMfModifier = class {
  constructor(datamodel) {
    this.history = [];
    this.datamodel = new Datamodel(datamodel);
  }
  get() {
    return this.datamodel.get();
  }
  getModelsNames() {
    const datamodel = this.datamodel.get();
    return datamodel.models.map((m) => m.name);
  }
  getEnumsNames() {
    const datamodel = this.datamodel.get();
    return datamodel.enums.map((m) => m.name);
  }
  getEnumOptions(enumName) {
    const datamodel = this.datamodel.get();
    return datamodel.enums.find((e) => e.name === enumName).values.map((v) => v.name);
  }
  set(datamodel) {
    this.history = [];
    this.datamodel = new Datamodel(datamodel);
  }
  do(command) {
    command.do(this.datamodel);
    this.history.push(command);
  }
  undo() {
    const command = this.history.pop();
    if (command)
      command.undo(this.datamodel);
  }
};

// src/commands/addFieldCommand.ts
var AddFieldCommand = class extends DMMFCommand {
  constructor(modelName, field, isManyToManyRelation) {
    super();
    this.modelName = modelName;
    this.field = field;
    this.isManyToManyRelation = isManyToManyRelation;
  }
  do(datamodel) {
    const relationType = this.field.relationName ? this.isManyToManyRelation ? "n-m" : this.field.isList ? "1-n" : "1-1" : void 0;
    datamodel.addField(this.modelName, this.field, relationType);
  }
  undo(datamodel) {
    datamodel.removeField(this.modelName, this.field);
  }
};

// src/commands/removeFieldCommand.ts
var RemoveFieldCommand = class extends DMMFCommand {
  constructor(modelName, fieldName) {
    super();
    this.modelName = modelName;
    this.fieldName = fieldName;
  }
  do(datamodel) {
    const f = datamodel.get().models.find((m) => m.name === this.modelName)?.fields.find((f2) => f2.name === this.fieldName);
    if (!f)
      return;
    else
      this.field = f;
    datamodel.removeField(this.modelName, this.field);
  }
  undo(datamodel) {
    datamodel.addField(this.modelName, this.field);
  }
};

// src/commands/updateFieldCommand.ts
var UpdateFieldCommand = class extends DMMFCommand {
  constructor(modelName, originalFieldName, field, isManyToManyRelation) {
    super();
    this.modelName = modelName;
    this.originalFieldName = originalFieldName;
    this.field = field;
    this.isManyToManyRelation = isManyToManyRelation;
  }
  do(datamodel) {
    datamodel.updateField(
      this.modelName,
      this.originalFieldName,
      this.field,
      this.isManyToManyRelation
    );
  }
  undo() {
    throw new Error("Method not implemented.");
  }
};

// src/commands/addModelCommand.ts
var AddModelCommand = class extends DMMFCommand {
  constructor(modelName, oldModelName) {
    super();
    this.modelName = modelName;
    this.oldModelName = oldModelName;
  }
  do(datamodel) {
    datamodel.addModel(this.modelName, this.oldModelName);
  }
  undo(datamodel) {
    datamodel.removeModel(this.modelName);
  }
};

// src/commands/addEnumFieldCommand.ts
var AddEnumFieldCommand = class extends DMMFCommand {
  constructor(enumName, field) {
    super();
    this.enumName = enumName;
    this.field = field;
  }
  do(datamodel) {
    datamodel.addEnumField(this.enumName, this.field);
  }
  undo(datamodel) {
    datamodel.removeEnumField(this.enumName, this.field);
  }
};

// src/commands/removeEnumFieldCommand.ts
var RemoveEnumFieldCommand = class extends DMMFCommand {
  constructor(enumName, field) {
    super();
    this.enumName = enumName;
    this.field = field;
  }
  undo(datamodel) {
    datamodel.addEnumField(this.enumName, this.field);
  }
  do(datamodel) {
    datamodel.removeEnumField(this.enumName, this.field);
  }
};

// src/commands/updateEnumFieldCommand.ts
var UpdateEnumFieldCommand = class extends DMMFCommand {
  constructor(enumName, field, oldField) {
    super();
    this.enumName = enumName;
    this.field = field;
    this.oldField = oldField;
  }
  do(datamodel) {
    datamodel.updateEnumField(this.enumName, this.field, this.oldField);
  }
  undo() {
    throw new Error("Method not implemented.");
  }
};

// src/commands/addEnumCommand.ts
var AddEnumCommand = class extends DMMFCommand {
  constructor(enumName, oldField) {
    super();
    this.enumName = enumName;
    this.oldField = oldField;
  }
  do(datamodel) {
    datamodel.addEnum(this.enumName, this.oldField);
  }
  undo(datamodel) {
    datamodel.removeEnum(this.enumName);
  }
};

// src/commands/removeEnumCommand.ts
var RemoveEnumCommand = class extends DMMFCommand {
  constructor(enumName) {
    super();
    this.enumName = enumName;
  }
  do(datamodel) {
    datamodel.removeEnum(this.enumName);
  }
  undo() {
    throw new Error("Method not implemented.");
  }
};

// src/commands/removeModelCommand.ts
var RemoveModelCommand = class extends DMMFCommand {
  constructor(modelName) {
    super();
    this.modelName = modelName;
  }
  do(datamodel) {
    datamodel.removeModel(this.modelName);
  }
  undo() {
    throw new Error("Method not implemented.");
  }
};

// src/nativeTypesOptions.ts
var stringNativeTypes = [
  {
    nativeType: "@db.Text",
    databases: ["postgresql", "mysql", "sqlserver"]
  },
  {
    nativeType: "@db.Char(x)",
    databases: ["postgresql", "mysql", "sqlserver", "cockroachdb"]
  },
  {
    nativeType: "@db.VarChar(x)",
    databases: ["postgresql", "mysql", "sqlserver"]
  },
  {
    nativeType: "@db.Bit(x)",
    databases: ["postgresql", "cockroachdb"]
  },
  {
    nativeType: "@db.VarBit",
    databases: ["postgresql", "cockroachdb"]
  },
  {
    nativeType: "@db.Uuid",
    databases: ["postgresql", "cockroachdb"]
  },
  {
    nativeType: "@db.Xml",
    databases: ["postgresql", "sqlserver"]
  },
  {
    nativeType: "@db.Inet",
    databases: ["postgresql", "cockroachdb"]
  },
  {
    nativeType: "@db.Citext",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.TinyText",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.MediumText",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.LongText",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.String",
    databases: ["mongodb"]
  },
  {
    nativeType: "@db.ObjectId",
    databases: ["mongodb"]
  },
  {
    nativeType: "@db.NChar(x)",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.NVarChar(x)",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.NText",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.UniqueIdentifier",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.String(x)",
    databases: ["sqlserver", "cockroachdb"]
  },
  {
    nativeType: "@db.CatalogSingleChar",
    databases: ["cockroachdb"]
  }
];
var booleanNativeTypes = [
  {
    nativeType: "@db.Boolean",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.TinyInt(1)",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Bit",
    databases: ["mysql", "sqlserver"]
  },
  {
    nativeType: "@db.Bool",
    databases: ["cockroachdb"]
  }
];
var intNativeTypes = [
  {
    nativeType: "@db.Integer",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.SmallInt",
    databases: ["postgresql", "mysql", "sqlserver"]
  },
  {
    nativeType: "@db.Oid",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.Int",
    databases: ["mysql", "mongodb", "sqlserver"]
  },
  {
    nativeType: "@db.UnsignedInt",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.UnsignedSmallInt",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.MediumInt",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.UnsignedMediumInt",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.TinyInt",
    databases: ["mysql", "sqlserver"]
  },
  {
    nativeType: "@db.UnsignedTinyInt",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Year",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Long",
    databases: ["mongodb"]
  },
  {
    nativeType: "@db.Bit",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.Int8",
    databases: ["cockroachdb"]
  },
  {
    nativeType: "@db.Int2",
    databases: ["cockroachdb"]
  }
];
var bigIntNativeTypes = [
  {
    nativeType: "@db.BigInt",
    databases: ["postgresql", "mysql", "sqlserver"]
  },
  {
    nativeType: "@db.UnsignedBigInt",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Int8",
    databases: ["cockroachdb"]
  }
];
var floatNativeTypes = [
  {
    nativeType: "@db.DoublePrecision",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.Real",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.Float",
    databases: ["mysql", "sqlserver"]
  },
  {
    nativeType: "@db.Double",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Money",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.SmallMoney",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.Real",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.Float8",
    databases: ["cockroachdb"]
  },
  {
    nativeType: "@db.Float4",
    databases: ["cockroachdb"]
  }
];
var decimalNativeTypes = [
  {
    nativeType: "@db.Decimal(p, s)",
    databases: ["postgresql", "mysql", "sqlserver", "cockroachdb"]
  },
  {
    nativeType: "@db.Money",
    databases: ["postgresql"]
  }
];
var dateTimeNativeTypes = [
  {
    nativeType: "@db.Timestamp(x)",
    databases: ["postgresql", "mysql", "cockroachdb"]
  },
  {
    nativeType: "@db.Date",
    databases: ["postgresql", "mysql", "sqlserver", "cockroachdb"]
  },
  {
    nativeType: "@db.Time(x)",
    databases: ["postgresql", "mysql", "cockroachdb"]
  },
  {
    nativeType: "@db.Timetz(x)",
    databases: ["postgresql", "cockroachdb"]
  },
  {
    nativeType: "@db.DateTime(x)",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Time",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.DateTime",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.DateTime2",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.SmallDateTime",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.DateTimeOffset",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.Timestamptz(x)",
    databases: ["cockroachdb"]
  }
];
var jsonNativeTypes = [
  {
    nativeType: "@db.Json",
    databases: ["postgresql", "mysql"]
  },
  {
    nativeType: "@db.JsonB",
    databases: ["postgresql", "sqlite"]
  },
  {
    nativeType: "@db.NVarChar",
    databases: ["sqlserver"]
  }
];
var bytesNativeTypes = [
  {
    nativeType: "@db.ByteA",
    databases: ["postgresql"]
  },
  {
    nativeType: "@db.LongBlob",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Binary",
    databases: ["mysql", "sqlserver"]
  },
  {
    nativeType: "@db.VarBinary",
    databases: ["mysql", "sqlserver"]
  },
  {
    nativeType: "@db.TinyBlob",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Blob",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.MediumBlob",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.Bit",
    databases: ["mysql"]
  },
  {
    nativeType: "@db.ObjectId",
    databases: ["mongodb"]
  },
  {
    nativeType: "@db.BinData",
    databases: ["mongodb"]
  },
  {
    nativeType: "@db.Image",
    databases: ["sqlserver"]
  },
  {
    nativeType: "@db.Bytes",
    databases: ["cockroachdb"]
  },
  {
    nativeType: "@db.Bytes",
    databases: ["cockroachdb"]
  }
];
var getNativeTypes = (database, dataType) => {
  const nativeTypes = {
    String: stringNativeTypes,
    Int: intNativeTypes,
    Boolean: booleanNativeTypes,
    Float: floatNativeTypes,
    DateTime: dateTimeNativeTypes,
    Decimal: decimalNativeTypes,
    BigInt: bigIntNativeTypes,
    Bytes: bytesNativeTypes,
    JSON: jsonNativeTypes
  };
  if (!(dataType in nativeTypes))
    return [];
  return nativeTypes[dataType].filter((o) => o.databases.includes(database)).map((o) => o.nativeType);
};
export {
  AddEnumCommand,
  AddEnumFieldCommand,
  AddFieldCommand,
  AddModelCommand,
  DMMFCommand,
  DMMfModifier,
  RelationManager,
  RemoveEnumCommand,
  RemoveEnumFieldCommand,
  RemoveFieldCommand,
  RemoveModelCommand,
  UpdateEnumFieldCommand,
  UpdateFieldCommand,
  getNativeTypes
};
//# sourceMappingURL=index.mjs.map