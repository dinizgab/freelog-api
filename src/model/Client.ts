import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Project } from "./Project";

interface ClientAttributes {
    id: number;
    companyName: string;
    contactName: string;
    contactTitle: string;
    email: string;
    phone: string;
    address: string;
    isActive: boolean;
    freelancerId: number;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, "id" | "contactTitle" | "phone" | "address"> { }

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
    public id!: number;
    public companyName!: string;
    public contactName!: string;
    public contactTitle!: string;
    public email!: string;
    public phone!: string;
    public address!: string;
    public isActive!: boolean;
    public freelancerId!: number;
}

Client.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        contactName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        contactTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        freelancerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            onDelete: "CASCADE"
        },
    },
    {
        sequelize,
        tableName: "clients",
        timestamps: false,
    }
)

Client.belongsTo(
    User, {
    foreignKey: "freelancerId",
    as: "user",
},
);

