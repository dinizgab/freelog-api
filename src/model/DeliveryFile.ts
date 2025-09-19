import {DataTypes, Model, Optional} from "sequelize";
import sequelize from "../config/database";
import {Delivery} from "./Delivery";

interface DeliveryFileAttributes {
    id: number;
    deliveryId: number;
    name: string;
    size: number;
    url: string;
}

export interface DeliveryFileCreationAttributes
    extends Optional<DeliveryFileAttributes, "id"> {
}

export class DeliveryFile
    extends Model<DeliveryFileAttributes, DeliveryFileCreationAttributes>
    implements DeliveryFileAttributes {
    public id!: number;
    public deliveryId!: number;
    public name!: string;
    public size!: number;
    public url!: string;
}

DeliveryFile.init(
    {
        id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        deliveryId: {
            type: DataTypes.INTEGER, allowNull: false, onDelete: "CASCADE"
        },
        name: {type: DataTypes.STRING, allowNull: false},
        size: {type: DataTypes.INTEGER, allowNull: false},
        url: {type: DataTypes.STRING, allowNull: false},
    },
    {sequelize, modelName: "delivery_files", timestamps: false},
);

Delivery.hasMany(DeliveryFile, {foreignKey: "deliveryId", as: "files", onDelete: "CASCADE"});
