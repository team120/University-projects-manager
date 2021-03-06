import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from "typeorm";
import { User } from "../user/user.model";
import { Department } from "../department/department.model";

@Entity()
export class University {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @OneToMany((type) => User, (user) => user.university, {
    nullable: true,
    cascade: ["insert", "update"],
    onUpdate: "CASCADE",
  })
  users: User[];

  @OneToMany((type) => Department, (department) => department.university, {
    nullable: true,
    cascade: ["insert", "update"],
    onUpdate: "CASCADE",
  })
  departments: Department[];
}
