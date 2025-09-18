import { User } from "../model/User";

export class UserRepository {
    
  async createUser(
    fullName: string,
    email: string,
    password: string,
    tradeName: string,
    phone: string
  ) {
    return await User.create({
      fullName,
      email,
      password,
      tradeName,
      phone
    });
  }

  async getUserById(id: number) {
    return await User.findByPk(id);
  }

  async getAllUsers() {
    return await User.findAll();
  }

  async updateUser(
    id: number,
    data: Partial<{
      fullName: string;
      email: string;
      password: string;
      tradeName: string;
      phone: string;
    }>
  ) {
    const user = await User.findByPk(id);
    return user
      ? await user!.update(data)
      : null;
  }

  async deleteUser(id: number) {
    let resp = false;
    const user = await User.findByPk(id);
    if (user) {
      await user!.destroy();
      resp = true;
    }
    return resp;
  }

}