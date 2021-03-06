import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { Department } from "../../../src/entities/department/department.model";
import {
  Project,
  ProjectType,
} from "../../../src/entities/project/project.model";
import { University } from "../../../src/entities/university/university.model";
import { User } from "../../../src/entities/user/user.model";
import { UserToProjects } from "../../../src/entities/users_projects/users-projects.model";
import { hashPassword } from "../../../src/utils/auth/auth.utils";

export class SeedDb1590967789743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const usersRepo = getRepository(User);
    const universityRepo = getRepository(University);
    const projectRepo = getRepository(Project);
    const userToProjectsRepo = getRepository(UserToProjects);
    const departmentRepo = getRepository(Department);

    const universities: University[] = [
      universityRepo.create({ name: "UTN" }),
      universityRepo.create({ name: "UNR" }),
    ];

    await universityRepo.save(universities);

    const departments: Department[] = [
      departmentRepo.create({
        name: "Ingeniería en Sistemas",
        university: universities[0],
      }),
      departmentRepo.create({
        name: "Ingeniería Civil",
        university: universities[0],
      }),
      departmentRepo.create({
        name: "Ingeniería Química",
        university: universities[0],
      }),
      departmentRepo.create({
        name: "Ciencias Básicas",
        university: universities[1],
      }),
      departmentRepo.create({
        name: "Ingeniería Electrónica",
        university: universities[1],
      }),
    ];

    await departmentRepo.save(departments);

    const projects: Project[] = [
      projectRepo.create({
        name:
          "Desarrollo de un sistema para identificar geoposicionamiento en entorno de Internet de la Cosas (IoT)",
        type: ProjectType.Formal,
        department: departments[0],
        creationDate: "2020-03-16 14:13:02",
      }),
      projectRepo.create({
        name: "University Projects Manager",
        type: ProjectType.Informal,
        creationDate: "2021-03-16 14:13:02",
      }),
    ];

    await projectRepo.save(projects);

    const users: User[] = [
      usersRepo.create({
        mail: "user1@example.com",
        isMailVerified: true,
        password: await hashPassword("password1"),
        name: "John",
        lastName: "Doe",
        university: universities[0],
        professorId: 11444,
      }),
      usersRepo.create({
        mail: "user2@example.com",
        isMailVerified: true,
        password: await hashPassword("password2"),
        name: "Afak",
        lastName: "Ename",
        university: universities[0],
      }),
      usersRepo.create({
        mail: "user3@example.com",
        isMailVerified: true,
        password: await hashPassword("password3"),
        name: "Nom",
        lastName: "Eaning",
        university: universities[0],
        requestPosition: true,
      }),
    ];

    await usersRepo.save(users);

    const usersToProjects: UserToProjects[] = [
      userToProjectsRepo.create({
        user: users[0],
        project: projects[0],
      }),
      userToProjectsRepo.create({
        user: users[1],
        project: projects[0],
      }),
      userToProjectsRepo.create({
        user: users[1],
        project: projects[1],
      }),
      userToProjectsRepo.create({
        user: users[2],
        project: projects[1],
      }),
    ];

    await userToProjectsRepo.save(usersToProjects);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const usersRepo = getRepository(User);
    const universityRepo = getRepository(University);
    const projectRepo = getRepository(Project);
    const userToProjectsRepo = getRepository(UserToProjects);
    const departmentRepo = getRepository(Department);

    const usersToRemove = await usersRepo.find({
      where: [
        { mail: "user1@example.com" },
        { mail: "user2@example.com" },
        { mail: "user3@example.com" },
      ],
    });

    await usersRepo.remove(usersToRemove);

    const universitiesToRemove = await universityRepo.find({
      where: [{ name: "UTN" }, { name: "UNR" }],
    });

    await universityRepo.remove(universitiesToRemove);

    const projectsToRemove = await projectRepo.find({
      where: [
        {
          name:
            "Desarrollo de un sistema para identificar geoposicionamiento en entorno de Internet de la Cosas (IoT)",
        },
        { name: "University Project Manager" },
      ],
    });

    await projectRepo.remove(projectsToRemove);

    const departmentsToRemove = await departmentRepo.find({
      where: [
        { university: universitiesToRemove[0] },
        { university: universitiesToRemove[1] },
      ],
    });

    await departmentRepo.remove(departmentsToRemove);
  }
}
