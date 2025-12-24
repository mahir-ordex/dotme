import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8000/graphql', // <-- hardcoded, not process.env
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