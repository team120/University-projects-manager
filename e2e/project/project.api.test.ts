import { setupCreateAndTeardownTestDb } from "../common/setup.util";
import request from "supertest";
import api from "../../src/server";

setupCreateAndTeardownTestDb();

describe("Project actions", () => {
  describe("get projects", () => {
    it("should get all projects and their associated users", async () => {
      await request(api)
        .get("/projects")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toContainEqual({
            name:
              "Desarrollo de un sistema para identificar geoposicionamiento en entorno de Internet de la Cosas (IoT)",
            type: "Formal",
            isDown: false,
            department: {
              id: 1,
              name: "Ingenieria en Sistemas",
            },
            users: [
              {
                mail: "user1@example.com",
                lastName: "Doe",
                name: "John",
                university: {
                  id: 1,
                  name: "UTN",
                },
              },
              {
                mail: "user2@example.com",
                name: "Afak",
                lastName: "Ename",
                university: {
                  id: 1,
                  name: "UTN",
                },
              },
            ],
          });
          expect(res.body[0].users[0].password).not.toBeDefined();
          expect(res.body).toHaveLength(2);
        });
    });
  });

  describe("search projects by a known property", () => {
    describe("when project type is", () => {
      describe("Informal", () => {
        const projectName = "University Project Manager";
        it(`should get one project which name is ${projectName}`, async () => {
          const type = "Informal";
          await request(api)
            .get(`/projects?type=${type}`)
            .then((res) => {
              expect(res.status).toBe(200);
              expect(res.body).toHaveLength(1);
              expect(res.body[0].name).toEqual(projectName);
            });
        });
      });
      describe("Formal", () => {
        const projectName =
          "Desarrollo de un sistema para identificar geoposicionamiento en entorno de Internet de la Cosas (IoT)";
        it(`should get one project which name is ${projectName}`, async () => {
          const type = "Formal";
          await request(api)
            .get(`/projects?type=${type}`)
            .then((res) => {
              expect(res.status).toBe(200);
              expect(res.body).toHaveLength(1);
              expect(res.body[0].name).toEqual(projectName);
            });
        });
      });
    });
    it("should get one project (UPM) that exactly match one of their users", async () => {
      const userId = 3;
      await request(api)
        .get(`/projects?userId=${userId}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(1);
          expect(res.body[0]).toEqual({
            name: "University Project Manager",
            department: null,
            type: "Informal",
            isDown: false,
            users: [
              {
                mail: "user2@example.com",
                name: "Afak",
                lastName: "Ename",
                university: {
                  id: 1,
                  name: "UTN",
                },
              },
              {
                mail: "user3@example.com",
                lastName: "Eaning",
                name: "Nom",
                university: {
                  id: 1,
                  name: "UTN",
                },
              },
            ],
          });
        });
    });
  });
  describe("when isDown parameter is provided", () => {
    describe("and set to false", () => {
      it("should get every project", async () => {
        const isDown = false;
        await request(api)
          .get(`/projects/?isDown=${isDown}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
          });
      });
    });

    describe("and set to true", () => {
      it("should get no projects", async () => {
        const isDown = true;
        await request(api)
          .get(`/projects/?isDown=${isDown}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
          });
      });
      it("should get no projects as well when another parameter is provided", async () => {
        const isDown = true;
        const type = "Informal";
        await request(api)
          .get(`/projects/?isDown=${isDown}&type=${type}`)
          .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(0);
          });
      });
    });
  });
});
describe("search projects by a general text search", () => {
  describe("when project name is partially matched", () => {
    it("should get all projects", async () => {
      const generalSearchText = "Manager";
      await request(api)
        .get(`/projects?generalSearch=${generalSearchText}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body[0]).toEqual({
            name: "University Project Manager",
            type: "Informal",
            isDown: false,
            department: null,
            users: [
              {
                mail: "user2@example.com",
                name: "Afak",
                lastName: "Ename",
                university: {
                  id: 1,
                  name: "UTN",
                },
              },
              {
                mail: "user3@example.com",
                lastName: "Eaning",
                name: "Nom",
                university: {
                  id: 1,
                  name: "UTN",
                },
              },
            ],
          });
          expect(res.body).toHaveLength(1);
        });
    });
    describe("and additionally filtered by", () => {
      describe("userId", () => {
        it("should get all projects that partially match their name and exactly one of their users", async () => {
          const generalSearchText = "VERS";
          const userId = 2;
          await request(api)
            .get(
              `/projects?generalSearch=${generalSearchText}&userId=${userId}`,
            )
            .then((res) => {
              expect(res.status).toBe(200);
              expect(res.body[0]).toEqual({
                name: "University Project Manager",
                department: null,
                type: "Informal",
                isDown: false,
                users: [
                  {
                    mail: "user2@example.com",
                    name: "Afak",
                    lastName: "Ename",
                    university: {
                      id: 1,
                      name: "UTN",
                    },
                  },
                  {
                    mail: "user3@example.com",
                    lastName: "Eaning",
                    name: "Nom",
                    university: {
                      id: 1,
                      name: "UTN",
                    },
                  },
                ],
              });
              expect(res.body).toHaveLength(1);
            });
        });
      });
      describe("type", () => {
        describe("Formal", () => {
          it("should get no projects", async () => {
            const generalSearchText = "VERS";
            const type = "Formal";
            await request(api)
              .get(`/projects?generalSearch=${generalSearchText}&type=${type}`)
              .then((res) => {
                expect(res.status).toBe(200);
                expect(res.body).toHaveLength(0);
              });
          });
        });
      });
    });
  });

  describe("when exactly match some of their users", () => {
    it("should get the two existent projects", async () => {
      const generalSearchText = "fAk";
      await request(api)
        .get(`/projects?generalSearch=${generalSearchText}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
        });
    });
  });
});
