export type CreateDbModelType<T> = Omit<T, 'id' | 'guid' | 'isDeleted' | 'isCascadeDelete' | 'cascadeDeletedBy'>;
