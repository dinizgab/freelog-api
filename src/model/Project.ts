import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { Client } from "./Client";
import { User } from "./User";
import { Delivery } from "./Delivery";



export type ProjectStatus = "draft" | "ongoing" | "completed" | "cancelled";

interface ProjetcAttributes {
    id: string;
    freelancer_id: string;
    client_id: string;
    name: string;
    description: string;
    start_date: string;
    due_date: string;
    budget: number;
    status: ProjectStatus;
}

interface ProjectCreationAttributes extends Optional<ProjetcAttributes, any> { }

export class Project extends Model<ProjetcAttributes, ProjectCreationAttributes> implements ProjetcAttributes {
    public id!: string;
    public freelancer_id!: string;
    public client_id!: string;
    public name!: string;
    public description!: string;
    public start_date!: string;
    public due_date!: string;
    public budget!: number;
    public status!: ProjectStatus;

}


Project.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        freelancer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        start_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true,
            },
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true,
                isDate: true,
            },
        },
        budget: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                notEmpty: true,
                isInt: true,
            },
        },
        status: {
            type: DataTypes.ENUM('draft', 'ongoing', 'completed', 'cancelled'),
            allowNull: false,
            defaultValue: 'draft',
        },

    },

    {
        sequelize,
        tableName: "projects",
        timestamps: false,
    }
);

Project.belongsTo(User, {
    foreignKey: 'freelancer_id',
    as: 'freelancer',
}
);

Project.belongsTo(Client, {
    foreignKey: 'client_id',
    as: 'client',
}
);


