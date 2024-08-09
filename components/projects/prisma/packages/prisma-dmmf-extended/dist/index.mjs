// src/dmmfToSchema.ts
import { formatSchema } from "@prisma/internals";

// src/util/parser.ts
import { printGeneratorConfig } from "@prisma/engine-core";
var attributeHandlers = {
  default: (value, kind) => {
    if (Array.isArray(value)) {
      if (kind === "enum" || typeof value === "number" || typeof value === "boolean") {
        return `@default(${JSON.stringify(value).replaceAll(`"`, "")})`;
      }
      return `@default(${JSON.stringify(value)})`;
    }
    if (kind === "enum" || typeof value === "number" || typeof value === "boolean") {
      return `@default(${value})`;
    }
    if (typeof value === "string") {
      return `@default("${value}")`;
    }
    if (typeof value === "object") {
      const defaultObject = value;
      return `@default(${defaultObject.name}(${defaultObject.args}))`;
    }
    return "";
  },
  isId: (value) => value ? "@id" : "",
  isUnique: (value) => value ? "@unique" : "",
  native: (value) => value ? `${value}` : "",
  isUpdatedAt: (value) => value ? "@updatedAt" : "",
  dbName: (value) => value ? `@map("${value}")` : "",
  columnName: (value) => value ? `@map("${value}")` : "",
  comment: (value) => value ? `//${value}` : ""
};
function handleAttributes(attributes, kind) {
  const { relationFromFields, relationToFields, relationName } = attributes;
  if (kind === "object" && relationFromFields) {
    return relationFromFields.length > 0 ? `@relation(name: "${relationName}", fields: [${relationFromFields}], references: [${relationToFields}])` : `@relation(name: "${relationName}") ${attributes?.comment ? "//" + attributes.comment : ""}`;
  }
  return Object.entries(attributes).map(([key, value]) => attributeHandlers[key]?.(value, kind) ?? "").join(" ");
}
function handleFields(fields) {
  return fields.map((fields2) => {
    const { name, kind, type, isRequired, isList, ...attributes } = fields2;
    if (kind === "comment") {
      return `//${name}`;
    }
    const fieldAttributes = handleAttributes(attributes, kind);
    return `${name} ${type}${isList ? "[]" : isRequired ? "" : "?"} ${fieldAttributes}`;
  }).join("\n");
}
function handlePrimaryKey(primaryKeys) {
  if (!primaryKeys || !primaryKeys.fields || primaryKeys.fields.length === 0)
    return "";
  return `@@id([${primaryKeys.fields.join(", ")}])`;
}
function handleUniqueFields(uniqueFields) {
  return uniqueFields.length > 0 ? uniqueFields.map((eachUniqueField) => `@@unique([${eachUniqueField.join(", ")}])`).join("\n") : "";
}
function handleDbName(dbName) {
  return dbName ? `@@map("${dbName}")` : "";
}
function handleUrl(envValue) {
  const value = envValue.fromEnvVar ? `env("${envValue.fromEnvVar}")` : envValue.value;
  return `url = ${value}`;
}
function handleProvider(provider) {
  return `provider = "${provider}"`;
}
function deserializeModel(model) {
  const {
    name,
    uniqueFields,
    dbName,
    primaryKey,
    index,
    startComments = [],
    endComments = []
  } = model;
  const indexs = index;
  const fields = model.fields;
  const output = `
${startComments.map((c) => "// " + c).join("\n")}

model ${name} {
${handleFields(fields)}
${handleUniqueFields(uniqueFields)}
${handleDbName(dbName)}
${handlePrimaryKey(primaryKey)}
${indexs?.join("\n") || ""}
}

${endComments.map((c) => "// " + c).join("\n")}
`;
  return output;
}
function deserializeDatasource(datasource) {
  const { activeProvider: provider, name, url } = datasource;
  return `
datasource ${name} {
	${handleProvider(provider)}
	${handleUrl(url)}
}`;
}
function deserializeEnum({ name, values, dbName }) {
  const outputValues = values.map(({ name: name2, dbName: dbName2 }) => {
    let result = name2;
    if (name2 !== dbName2 && dbName2)
      result += `@map("${dbName2}")`;
    return result;
  });
  return `
enum ${name} {
	${outputValues.join("\n	")}
	${handleDbName(dbName || null)}
}`;
}
function dmmfModelsdeserializer(models) {
  return models.map((model) => deserializeModel(model)).join("\n");
}
function datasourcesDeserializer(datasources) {
  return datasources.map((datasource) => deserializeDatasource(datasource)).join("\n");
}
function generatorsDeserializer(generators) {
  return generators.map((generator) => printGeneratorConfig(generator)).join("\n");
}
function dmmfEnumsDeserializer(enums) {
  return enums.map((each) => deserializeEnum(each)).join("\n");
}

// src/dmmfToSchema.ts
var dmmfToSchema = async ({
  dmmf: { models, enums },
  config: { datasources, generators }
}) => {
  const outputSchema = [
    datasourcesDeserializer(datasources),
    generatorsDeserializer(generators),
    dmmfModelsdeserializer(models),
    dmmfEnumsDeserializer(enums)
  ].filter((e) => e).join("\n\n\n");
  return await formatSchema({ schema: outputSchema });
};

// src/schemaToDmmf.ts
import { getConfig, getDMMF } from "@prisma/internals";
import stripAnsi from "strip-ansi";
var ErrorTypes = /* @__PURE__ */ ((ErrorTypes2) => {
  ErrorTypes2[ErrorTypes2["Prisma"] = 0] = "Prisma";
  ErrorTypes2[ErrorTypes2["Other"] = 1] = "Other";
  return ErrorTypes2;
})(ErrorTypes || {});
var schemaToDmmf = async (schema) => {
  try {
    const { datamodel } = await getDMMF({
      datamodel: schema
    });
    const config = await getConfig({
      datamodel: schema,
      ignoreEnvVarErrors: true
    });
    const lines = schema.split("\n");
    let model = "";
    let isOutsideModel = false;
    let startComments = [];
    lines.forEach((line, index) => {
      if (line.includes("model")) {
        model = (line || "").trim().split(" ")[1];
        isOutsideModel = false;
        const dataModel = datamodel.models.find((m) => m.name === model);
        if (startComments.length > 0 && typeof dataModel !== "undefined") {
          dataModel.startComments = [...startComments];
          startComments = [];
        }
      }
      if (line.includes("@db")) {
        const lineWords = (line || "").trim().split(" ");
        const field = lineWords[0];
        const nativeAttribute = lineWords.find((word) => word.includes("@db"));
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        const dmmfField = dmmfModel?.fields.find((f) => f.name === field);
        if (dmmfField)
          dmmfField["native"] = nativeAttribute;
      }
      if (line.includes("//")) {
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        const lineWords = (line || "").trim().split(" ");
        const comment = (line || "").trim().split("//")[1];
        const isCommentLine = lineWords[0].includes("//");
        if (!isCommentLine) {
          const field = lineWords[0];
          const dmmfField = dmmfModel?.fields.find((f) => f.name === field);
          if (dmmfField)
            dmmfField["comment"] = comment;
        } else {
          const lastLine = lines[index - 1];
          const lineWords2 = (lastLine || "").trim().split(" ");
          const field = lineWords2[0];
          if (field === "model") {
            dmmfModel?.fields.unshift({
              kind: "comment",
              name: comment
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            });
          } else if (isOutsideModel) {
            startComments.push((comment || "").trim());
          } else {
            const dmmfFieldIndex = dmmfModel?.fields.findIndex(
              (f) => f.name === field
            );
            if (dmmfFieldIndex) {
              dmmfModel?.fields.splice(dmmfFieldIndex + 1, 0, {
                kind: "comment",
                name: comment
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              });
            } else {
              startComments.push(comment);
            }
          }
        }
      }
      if (line.includes("@@index")) {
        const index2 = (line || "").trim();
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        if (dmmfModel)
          dmmfModel["index"] = [
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...Array.isArray(dmmfModel["index"]) ? dmmfModel["index"] : [],
            index2
          ];
      }
      if (line.includes("}")) {
        isOutsideModel = true;
      }
    });
    if (startComments.length > 0) {
      datamodel.models.find((m) => m.name === model).endComments = [
        ...startComments
      ];
    }
    return { datamodel, config };
  } catch (error) {
    const message = stripAnsi(error.message);
    let errors;
    let errType;
    if (message.includes("error: ")) {
      errors = parseDMMFError(message);
      errType = 0 /* Prisma */;
    } else {
      errors = [{ reason: message, row: "0" }];
      errType = 1 /* Other */;
    }
    return { errors, type: errType };
  }
};
var errRegex = /^(?:Error validating.*?:)?(.+?)\n  -->  schema\.prisma:(\d+)\n/;
var parseDMMFError = (error) => error.split("error: ").slice(1).map((msg) => msg.match(errRegex).slice(1)).map(([reason, row]) => ({ reason, row }));

// src/index.ts
export * from "@prisma/generator-helper";
import { formatSchema as formatSchema2 } from "@prisma/internals";
export {
  ErrorTypes,
  dmmfToSchema,
  formatSchema2 as formatSchema,
  schemaToDmmf
};
//# sourceMappingURL=index.mjs.map