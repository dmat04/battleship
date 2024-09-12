import { User } from "@battleship/common/dbModels/UserDbModels.js";

export interface ApolloContext {
  user: User | null;
}
