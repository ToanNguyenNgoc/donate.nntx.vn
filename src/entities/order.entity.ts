import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'orders' })
export class Order {
  static STATUS = {
    PAID: 'PAID',
    PENDING: 'PENDING',
    CANCELLED: 'CANCELLED',
  };

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, default: uuidv4() })
  traction_uuid?: string;

  @Column({ nullable: true, default: 0 })
  amount?: number;

  @Column({ nullable: true, default: Order.STATUS.PENDING })
  status?: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true, length: 1000 })
  order?: string;

  @Column({ nullable: true, length: 1000 })
  transaction?: string;

  @Column({ nullable: true, length: 2000 })
  template?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
