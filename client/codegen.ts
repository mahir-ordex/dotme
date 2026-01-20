import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_API_URL,
  documents: ['src/**/*.ts', 'src/**/*.tsx', 'graphql/**/*.ts'],
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: []
    },
    'graphql.schema.json': {
      plugins: ['introspection']
    }
  }
};

export default config;