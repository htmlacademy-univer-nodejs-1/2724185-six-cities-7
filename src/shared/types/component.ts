export const Component = {
  Application: Symbol.for('Application'),
  Config: Symbol.for('Config'),
  CommentModel: Symbol.for('CommentModel'),
  CommentService: Symbol.for('CommentService'),
  DatabaseClient: Symbol.for('DatabaseClient'),
  ImportCommand: Symbol.for('ImportCommand'),
  Logger: Symbol.for('Logger'),
  OfferModel: Symbol.for('OfferModel'),
  OfferService: Symbol.for('OfferService'),
  UserModel: Symbol.for('UserModel'),
  UserService: Symbol.for('UserService'),
} as const;
