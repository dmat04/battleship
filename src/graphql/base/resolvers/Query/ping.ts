import type { QueryResolvers } from '../../../types.generated';

export const ping: NonNullable<QueryResolvers['ping']> = () => 'Pong';

export default {};
