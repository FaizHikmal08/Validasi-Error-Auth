import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
  },

  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],

  definitions: {
    StallInput: {
      $ownerId: 2,
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },

    UserInput: {
      $name: 'User Test',
      $email: 'usertest01@gmail.com',
      $passwordHash: 'test123',
      $role: 'customer',
    },

    MenuItemInput: {
      $stallId: 1,
      $name: 'Es Teh Test',
      $price: 5000,
      $isAvailable: true,
    },

    ReviewInput: {
      $stallId: 1,
      $userId: 1,
      $rating: 5,
      $comment: 'Makanannya enak',
    },
    LikeInput: {
      $reviewId: 1,
      $userId: 1,
    },
    FlagInput: {
      $status: 'resolved',
    },
    AuditInput: {
      $userId: 1,
      $action: 'CREATE',
      $targetTable: 'REVIEWS',
      $targetId: 1,
      $metadata: 'Membuat review baru',
    },
  },
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);