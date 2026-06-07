import { Resource } from "sst";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema.js";

const sql = neon(Resource.DatabaseUrl.value);

export const db = drizzle(sql, { schema });
