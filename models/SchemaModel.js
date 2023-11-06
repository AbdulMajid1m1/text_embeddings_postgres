import { EntitySchema } from 'typeorm';

export const SchemaModel = new EntitySchema({
    name: "Schema",
    tableName: "Schemas", // specify the table name
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        SegmentCode: {
            type: "varchar",
            nullable: true
        },
        SegmentTitle: {
            type: "varchar",
            nullable: true
        },
        SegmentDefinition: {
            type: "text",
            nullable: true
        },
        FamilyCode: {
            type: "varchar",
            nullable: true
        },
        FamilyTitle: {
            type: "varchar",
            nullable: true
        },
        FamilyDefinition: {
            type: "text",
            nullable: true
        },
        ClassCode: {
            type: "varchar",
            nullable: true
        },
        ClassTitle: {
            type: "varchar",
            nullable: true
        },
        ClassDefinition: {
            type: "text",
            nullable: true
        },
        BrickCode: {
            type: "varchar",
            nullable: true
        },
        BrickTitle: {
            type: "varchar",
            nullable: true
        },
        BrickDefinition_Includes: {
            type: "text",
            nullable: true
        },
        BrickDefinition_Excludes: {
            type: "text",
            nullable: true
        },
        AttributeCode: {
            type: "varchar",
            nullable: true
        },
        AttributeTitle: {
            type: "varchar",
            nullable: true
        },
        AttributeDefinition: {
            type: "text",
            nullable: true
        },
        AttributeValueCode: {
            type: "varchar",
            nullable: true
        },
        AttributeValueTitle: {
            type: "varchar",
            nullable: true
        },
        AttributeValueDefinition: {
            type: "text",
            nullable: true
        },
        // If the embedding is an array of numbers and you want to store it as a stringified version
        BrickAttributeTitleEmbedding: {
            type: "simple-array",
            nullable: true
        },
        createdAt: {
            type: "timestamp",
            createDate: true
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true
        }
    }
});
