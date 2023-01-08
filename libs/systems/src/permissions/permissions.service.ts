import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { Permissions } from './permissions.entity';

import { createPermissionsDto, updatePermissionsDto } from './permissions.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permissions.name, 'api')
    private readonly permissionsModel: Model<Permissions>,
  ) {}

  private escapeRegex(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  async exists(id: string) {
    return this.permissionsModel.exists({ _id: id });
  }

  async totalPermissions() {
    return this.permissionsModel.countDocuments().exec();
  }

  async findAll() {
    return this.permissionsModel.find().exec();
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    return this.permissionsModel.findById(id).exec();
  }

  async findByName(name: string) {
    const escapedString = this.escapeRegex(name);
    const perm = await this.permissionsModel
      .findOne({
        name: { $regex: new RegExp(`^${escapedString}$`, 'i') },
      })
      .exec();
    if (!perm) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return perm;
  }

  async findByAction(action: string) {
    if (!action) {
      throw new HttpException('Invalid action', HttpStatus.BAD_REQUEST);
    }
    const escapedAction = this.escapeRegex(action);
    const perm = await this.permissionsModel
      .find({
        name: { $regex: new RegExp(`^${escapedAction}$\:`, 'i') },
      })
      .exec();
    if (!perm) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return perm;
  }

  async findByActive(active: boolean) {
    if (typeof active !== 'boolean') {
      throw new HttpException('Invalid active', HttpStatus.BAD_REQUEST);
    }
    return await this.permissionsModel.find({ isActive: active }).exec();
  }

  async create(dto: createPermissionsDto) {
    const checkExists = await this.permissionsModel
      .exists({
        name: dto.name,
      })
      .exec();
    if (checkExists) {
      throw new HttpException('Permission already exists', HttpStatus.CONFLICT);
    }
    const [action, subject] = dto.name.split(':');
    if (!action || !subject) {
      throw new HttpException(
        'Invalid permission name',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newPermission = new this.permissionsModel(dto);
    return await newPermission.save();
  }

  async update(id: string, dto: updatePermissionsDto) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const updateDocument = await this.permissionsModel
      .findOne({
        _id: id,
      })
      .exec();
    if (!updateDocument) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    if (dto.name && updateDocument.name !== dto.name) {
      updateDocument.name = dto.name;
    }
    if (dto.description && updateDocument.description !== dto.description) {
      updateDocument.description = dto.description;
    }
    if (dto.isActive && updateDocument.isActive !== dto.isActive) {
      updateDocument.isActive = dto.isActive;
    }
    return await updateDocument.save();
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const deleteDocument = await this.permissionsModel
      .findOne({
        _id: id,
      })
      .exec();
    if (!deleteDocument) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    await deleteDocument.remove();

    // Todo: remove permission from roles
    return;
  }

  async active(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const updateDocument = await this.permissionsModel
      .findOne({
        _id: id,
      })
      .exec();
    if (!updateDocument) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    updateDocument.isActive = true;
    return await updateDocument.save();
  }

  async deactive(id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    const updateDocument = await this.permissionsModel
      .findOne({
        _id: id,
      })
      .exec();
    if (!updateDocument) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    updateDocument.isActive = false;
    return await updateDocument.save();
  }
}
