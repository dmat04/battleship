import type { QueryResolvers } from "@battleship/common/types/__generated__/types.generated";
export const ping: NonNullable<QueryResolvers["ping"]> = () => 'Pong';
