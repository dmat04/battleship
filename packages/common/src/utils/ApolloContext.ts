import { UnpopulatedSession } from "../entities/SessionDbModel.js";

export interface ApolloContext {
  session: UnpopulatedSession | null;
}
