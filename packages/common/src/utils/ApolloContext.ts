import { User } from "@battleship/common/dbModels/Users/UserDbModel.js";

export interface ApolloContext {
  user: User | null;
}
