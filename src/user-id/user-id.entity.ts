import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';
@Entity('user_ids')
@Unique(['id1', 'id2'])
export class UserId {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255 })
  id1: string;

  @Column({ type: 'varchar', length: 255 })
  id2: string;
  @Column({ type: 'varchar', length: 36 })
  userID: string;

  @CreateDateColumn()
  createdAt: Date;
}
