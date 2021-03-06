import api from "../../src/server";
import request from "supertest";
import { setupCreateAndTeardownTestDb } from "../common/setup.util";

setupCreateAndTeardownTestDb();

describe("University actions", () => {
  describe("get universities", () => {
    it("should return all universities", async () => {
      await request(api)
        .get("/universities")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
        });
    });
  });

  describe("get one university", () => {
    it("should return the university with the specified id", async () => {
      const id = 2;
      await request(api)
        .get(`/universities/${id}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe("UNR");
        });
    });
    it("should return ID not found if it does not match any id on DB", async () => {
      const id = 100;
      await request(api)
        .get(`/universities/${id}`)
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toBe(`Item ${id} not found`);
        });
    });
  });

  describe("create one university", () => {
    it("should return status 200 OK and the new university", async () => {
      await request(api)
        .post("/universities")
        .send({ name: "UNC" })
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body.name).toBe("UNC");
        });
    });
    it("should create the new university without the incorrect properties", async () => {
      await request(api)
        .post("/universities")
        .send({ name: "UNC", incorrectProperty: "incorrectValue" })
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.status).toBe(201);
          expect(res.body.name).toBe("UNC");
          expect(res.body).not.toHaveProperty("incorrectProperty");
        });
    });
    it("should return a list of universities with the new one included", async () => {
      await request(api)
        .post("/universities")
        .send({ name: "UNC" })
        .set("Accept", "application/json");
      await request(api)
        .get("/universities")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(3);
          expect(res.body[2].name).toBe("UNC");
        });
    });
  });

  describe("update one university", () => {
    it("should return status 200 OK and the updated university", async () => {
      const id = 2;
      await request(api)
        .put(`/universities/${id}`)
        .send({ name: "UBA" })
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual({ id: id, name: "UBA" });
        });
    });
    it("should update the new university without the incorrect properties", async () => {
      const id = 2;
      await request(api)
        .put(`/universities/${id}`)
        .send({ name: "UNC", incorrectProperty: "incorrectValue" })
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toEqual({ id: id, name: "UNC" });
        });
    });
    it("should return a list of universities where the updated one is correct", async () => {
      const id = 2;
      await request(api)
        .put(`/universities/${id}`)
        .send({ name: "UBA" })
        .set("Accept", "application/json");
      await request(api)
        .get("/universities")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(2);
          expect(res.body[id - 1].name).toBe("UBA");
        });
    });
  });

  /*
  describe("delete one university", () => {
    it("should return status 200 OK and delete message", async () => {
      const id = 2;
      await request(api)
        .delete(`/universities/${id}`)
        .set("Accept", "application/json")
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.message).toBe(`Item ${id} deleted successfully`);
        });
    });
    it("should return ID not found if it does not match any id on DB", async () => {
      const id = 100;
      await request(api)
        .delete(`/universities/${id}`)
        .then((res) => {
          expect(res.status).toBe(404);
          expect(res.body.message).toBe(`Item ${id} not found`);
        });
    });
    it("should return a DB error if the deletion does not comply with the restriction", async () => {
      const id = 1;
      await request(api)
        .delete(`/universities/${id}`)
        .then((res) => {
          expect(res.status).toBe(500);
        });
    });
  });*/
});
