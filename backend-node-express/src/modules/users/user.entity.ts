import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Inscription } from "../inscription/inscription.entity";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ default: "local" })
  provider: string;

  @Column({ nullable: true, select: false })
  resetPasswordToken: string;

  @Column({ nullable: true, select: false })
  confirmationToken: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  blocked: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Inscription, (inscricao) => inscricao.user)
  inscricaos: Inscription[];
}