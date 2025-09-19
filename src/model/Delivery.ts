import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../config/database";
import {Project} from "./Project";
import {User} from "./User";

interface DeliveryAttributes {
    id: number;
    project_id: number;
    previious_delivery_id: number | null;
    client_review: string | null;
    status: "on_review" | "returned" | "approved";
    delivery_date: Date | null;
    delivery_file_url: string | null;
    freelancer_id: number;
    title: string;
    description: string;
    version: number;
}

interface DeliveryCreationAttributes extends Optional<DeliveryAttributes, "id"> {
}

export {DeliveryAttributes, DeliveryCreationAttributes};

export class Delivery extends Model<DeliveryAttributes, DeliveryCreationAttributes> implements DeliveryAttributes {
    public id!: number;
    public project_id!: number;
    public previious_delivery_id!: number | null;
    public client_review!: string | null;
    public status!: "on_review" | "returned" | "approved";
    public delivery_date!: Date | null;
    public delivery_file_url!: string | null;
    public freelancer_id!: number;
    public title!: string
    public description!: string
    public version!: number
}

Delivery.init(
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
        },
        previious_delivery_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "deliveries",
                key: "id",
            },
        },
        client_review: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("on_review", "returned", "approved"),
            allowNull: false,
            defaultValue: "on_review",
        },
        delivery_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        delivery_file_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        freelancer_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "deliveries",
        timestamps: false,
    }
);

Delivery.belongsTo(Delivery, {as: "previousDelivery", foreignKey: "previious_delivery_id"});
Delivery.belongsTo(Project, {foreignKey: "project_id"});
Project.hasMany(Delivery, {
    foreignKey: "project_id",
    as: "deliveries",
    onDelete: "CASCADE"
})
Delivery.belongsTo(User, {foreignKey: "freelancer_id"});
