import js from "@eslint/js";
import tseslint from "typescript-eslint";
import unicorn from "eslint-plugin-unicorn";
import pluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs } from '@vue/eslint-config-typescript';
import sonar from 'eslint-plugin-sonarjs';
import globals from "globals";
import stylistic from '@stylistic/eslint-plugin';

export default defineConfigWithVueTs([
    {
        //Сгенерировано shadcn-vue, значит не трогать.
        ignores: ['src/components/ui/**/*']
    },
    {
        files: ['**/*.{ts,vue}'],
        plugins: {
            stylistic
        },
        extends: [ 
            js.configs.recommended, 
            unicorn.configs.recommended, 
            tseslint.configs.recommended,
            sonar.configs.recommended,
        ],
        rules: {
            "unicorn/prevent-abbreviations": 'off',
            "unicorn/filename-case": 'off',
            "unicorn/consistent-function-scoping": 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            "stylistic/semi": 'error',
            'stylistic/indent': ['error', 4],
        },
        languageOptions: {
            globals: { ...globals.browser, ...globals.node }
        }
    },    
    {
        files: ['**/*.vue'],
        extends: [
            pluginVue.configs['flat/recommended'],
        ],
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/require-default-prop': 'off',
            'vue/html-indent': ['error', 4],
        },
        languageOptions: {
            parserOptions: {
                parser: tseslint.parser,
                project: './tsconfig.json',
                extraFileExtensions: ['.vue']
            }
        },
    },
]);