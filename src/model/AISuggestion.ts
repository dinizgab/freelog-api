import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Project } from "./Project";

export interface AISuggestionAttributes {
    id: number;
    project_id: number;
    suggestion: unknown;
}

export interface AISuggestionCreationAttributes extends Optional<AISuggestionAttributes, "id"> { }

export class AISuggestion extends Model<AISuggestionAttributes, AISuggestionCreationAttributes> implements AISuggestionAttributes {
    public id!: number;
    public project_id!: number;
    public suggestion!: unknown;
}

AISuggestion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "projects",
                key: "id",
            },
            onDelete: "CASCADE",
            unique: true,
        },
        suggestion: {
            type: DataTypes.JSON,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "ai_suggestions",
        timestamps: false,
    }
);

AISuggestion.belongsTo(Project, {
    foreignKey: "project_id",
    as: "project",
});

Project.hasOne(AISuggestion, {
    foreignKey: "project_id",
    as: "aiSuggestion",
    onDelete: "CASCADE",
});
