import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  fullName: string;
  email: string;
  password: string;
  tradeName: string;
  phone: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public fullName!: string;
  public email!: string;
  public password!: string;
  public tradeName!: string;
  public phone!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkForLength(password: string) {
          if (password.length < 8) throw new Error();
        }
      }
    },
    tradeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        checkForLength(phone: string) {
          if (phone.length != 10 && phone.length != 11) throw new Error();
        }
      }
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await User.findOne({
    where: { email }
  });
}