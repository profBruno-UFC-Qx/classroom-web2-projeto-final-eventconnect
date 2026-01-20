import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "../category/category.entity.js";
import { Inscription } from "../inscription/inscription.entity.js";

@Entity("event")
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  nome: string;

  @Column({ type: "text", nullable: true })
  descricao: string;

  @Column()
  imagem: string;

  @Column()
  data: Date;

  @Column()
  endereco: string;

  @ManyToOne(() => Category, (categoria) => categoria.eventos, { nullable: false })
  categoria: Category;

  @OneToMany(() => Inscription, (inscricao) => inscricao.evento)
  inscricoes: Inscription[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}