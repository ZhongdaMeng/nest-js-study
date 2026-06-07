import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 50, unique: true })
  username!: string;

  @Column({ length: 100, default: '' })
  email!: string;

  @Column({ length: 255, select: false })
  password!: string;

  @Column({ length: 50, default: '' })
  nickname!: string;

  @Column({ length: 500, default: '' })
  avatar!: string;

  @Column({ length: 20, unique: true, nullable: true })
  phone!: string;

  @Column({ type: 'tinyint', default: 0, comment: '0=未知 1=男 2=女' })
  gender!: number;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
