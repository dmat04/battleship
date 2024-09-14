import { Session } from "../entities/SessionDbModel.js";

export interface ApolloContext {
  session: Session | null;
}
