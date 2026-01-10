import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/user.entity.js";
import { Event } from "../event/event.entity.js"

@Entity("inscription")
export class Inscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.inscricoes, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, (evento) => evento.inscricoes, { nullable: false, onDelete: 'CASCADE' })
  evento: Event;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}