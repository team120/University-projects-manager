import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { University } from "../university/university.model";
import { GoogleProfile } from "../auth/googleProfile.model";
import { UserToProjects } from "../users_projects/users-projects.model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  mail: string;
  @Column({ default: false })
  isMailVerified: boolean;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  dni: string;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  lastName: string;
  @Column({ nullable: true })
  studentId: number;
  @Column({ nullable: true })
  professorId: number;
  @Column({ nullable: true })
  professorCategory: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  picture: string;
  @Column({ default: false })
  requestPosition: boolean;

  @OneToOne((type) => GoogleProfile, (profile) => profile.user, {
    nullable: true,
  })
  @JoinColumn()
  googleProfile: GoogleProfile;

  @ManyToOne((type) => University, (university) => university.users, {
    nullable: false,
    cascade: ["insert", "update"],
    onUpdate: "CASCADE",
  })
  university: University;
  @OneToMany((type) => UserToProjects, (userToProjects) => userToProjects.user)
  userToProjects: UserToProjects[];
}
