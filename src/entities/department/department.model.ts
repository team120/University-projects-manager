import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  OneToMany,
} from "typeorm";
import { Project } from "../project/project.model";
import { University } from "../university/university.model";

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @ManyToOne((type) => University, (university) => university.departments, {
    nullable: false,
    cascade: ["insert", "update"],
    onUpdate: "CASCADE",
  })
  university: University;

  @OneToMany(() => Project, (project) => project.department)
  projects: Project[];
}
