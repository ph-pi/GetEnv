"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const fs_1 = require("fs");
const path_1 = require("path");
// Mock console.log pour éviter les sorties de log pendant les tests
const originalConsoleLog = console.log;
beforeAll(() => {
    console.log = jest.fn();
});
afterAll(() => {
    console.log = originalConsoleLog;
});
describe('getEnv', () => {
    const originalEnv = process.env;
    const testFilePath = (0, path_1.join)(__dirname, 'test-secret.txt');
    beforeEach(() => {
        // Reset process.env avant chaque test
        jest.resetModules();
        process.env = { ...originalEnv };
        // Nettoie le fichier de test s'il existe
        if ((0, fs_1.existsSync)(testFilePath)) {
            (0, fs_1.unlinkSync)(testFilePath);
        }
    });
    afterEach(() => {
        // Restore original process.env après chaque test
        process.env = originalEnv;
        // Nettoie le fichier de test
        if ((0, fs_1.existsSync)(testFilePath)) {
            (0, fs_1.unlinkSync)(testFilePath);
        }
    });
    describe('Variables d\'environnement basiques', () => {
        test('devrait retourner la valeur d\'une variable existante', () => {
            process.env.TEST_VAR = 'test-value';
            const result = (0, index_1.getEnv)('TEST_VAR');
            expect(result).toBe('test-value');
        });
        test('devrait lever une erreur pour une variable inexistante sans fallback', () => {
            delete process.env.NONEXISTENT_VAR;
            expect(() => (0, index_1.getEnv)('NONEXISTENT_VAR')).toThrow('Variable NONEXISTENT_VAR is not defined');
        });
        test('devrait retourner la valeur même si elle est une chaîne vide', () => {
            process.env.EMPTY_VAR = '';
            const result = (0, index_1.getEnv)('EMPTY_VAR');
            expect(result).toBe('');
        });
    });
    describe('Valeurs de fallback', () => {
        test('devrait retourner la valeur de fallback pour une variable inexistante', () => {
            delete process.env.MISSING_VAR;
            const result = (0, index_1.getEnv)('MISSING_VAR', { fallback: 'default-value' });
            expect(result).toBe('default-value');
        });
        test('devrait préférer la variable d\'environnement au fallback', () => {
            process.env.EXISTING_VAR = 'env-value';
            const result = (0, index_1.getEnv)('EXISTING_VAR', { fallback: 'fallback-value' });
            expect(result).toBe('env-value');
        });
        test('devrait accepter un fallback vide', () => {
            delete process.env.MISSING_VAR;
            const result = (0, index_1.getEnv)('MISSING_VAR', { fallback: '' });
            expect(result).toBe('');
        });
    });
    describe('Support des fichiers (_FILE)', () => {
        test('devrait lire le contenu d\'un fichier quand la variable _FILE est définie', () => {
            const secretContent = 'secret-from-file';
            (0, fs_1.writeFileSync)(testFilePath, secretContent);
            process.env.SECRET_FILE = testFilePath;
            delete process.env.SECRET;
            const result = (0, index_1.getEnv)('SECRET', { file: true });
            expect(result).toBe(secretContent);
        });
        test('devrait préférer la variable directe au fichier', () => {
            const secretContent = 'secret-from-file';
            (0, fs_1.writeFileSync)(testFilePath, secretContent);
            process.env.SECRET = 'direct-secret';
            process.env.SECRET_FILE = testFilePath;
            const result = (0, index_1.getEnv)('SECRET', { file: true });
            expect(result).toBe('direct-secret');
        });
        test('devrait trim le contenu du fichier', () => {
            const secretContent = '  secret-with-whitespace  \n';
            (0, fs_1.writeFileSync)(testFilePath, secretContent);
            process.env.SECRET_FILE = testFilePath;
            delete process.env.SECRET;
            const result = (0, index_1.getEnv)('SECRET', { file: true });
            expect(result).toBe('secret-with-whitespace');
        });
        test('devrait gérer un fichier inexistant sans lever d\'erreur', () => {
            process.env.SECRET_FILE = '/path/to/nonexistent/file';
            delete process.env.SECRET;
            expect(() => (0, index_1.getEnv)('SECRET', { file: true, fallback: 'default' }))
                .not.toThrow();
            const result = (0, index_1.getEnv)('SECRET', { file: true, fallback: 'default' });
            expect(result).toBe('default');
        });
        test('devrait lever une erreur si ni la variable ni le fichier ni le fallback ne sont disponibles', () => {
            process.env.SECRET_FILE = '/path/to/nonexistent/file';
            delete process.env.SECRET;
            expect(() => (0, index_1.getEnv)('SECRET', { file: true }))
                .toThrow('Variable SECRET is not defined');
        });
        test('ne devrait pas chercher de fichier si file: false', () => {
            const secretContent = 'secret-from-file';
            (0, fs_1.writeFileSync)(testFilePath, secretContent);
            process.env.SECRET_FILE = testFilePath;
            delete process.env.SECRET;
            expect(() => (0, index_1.getEnv)('SECRET', { file: false }))
                .toThrow('Variable SECRET is not defined');
        });
        test('ne devrait pas chercher de fichier si l\'option file n\'est pas spécifiée', () => {
            const secretContent = 'secret-from-file';
            (0, fs_1.writeFileSync)(testFilePath, secretContent);
            process.env.SECRET_FILE = testFilePath;
            delete process.env.SECRET;
            expect(() => (0, index_1.getEnv)('SECRET'))
                .toThrow('Variable SECRET is not defined');
        });
    });
    describe('Combinaisons d\'options', () => {
        test('devrait utiliser file puis fallback', () => {
            process.env.SECRET_FILE = '/nonexistent/file';
            delete process.env.SECRET;
            const result = (0, index_1.getEnv)('SECRET', {
                file: true,
                fallback: 'fallback-value'
            });
            expect(result).toBe('fallback-value');
        });
        test('devrait prioriser correctement : env > file > fallback', () => {
            const secretContent = 'file-content';
            (0, fs_1.writeFileSync)(testFilePath, secretContent);
            // Test avec seulement le fichier
            process.env.SECRET_FILE = testFilePath;
            delete process.env.SECRET;
            let result = (0, index_1.getEnv)('SECRET', {
                file: true,
                fallback: 'fallback-value'
            });
            expect(result).toBe('file-content');
            // Test avec variable env qui override le fichier
            process.env.SECRET = 'env-value';
            result = (0, index_1.getEnv)('SECRET', {
                file: true,
                fallback: 'fallback-value'
            });
            expect(result).toBe('env-value');
        });
    });
    describe('Cas d\'erreur', () => {
        test('devrait lever une erreur avec le bon message pour une variable manquante', () => {
            delete process.env.MISSING_VAR;
            expect(() => (0, index_1.getEnv)('MISSING_VAR'))
                .toThrow('Variable MISSING_VAR is not defined');
        });
        test('devrait gérer les noms de variables avec des caractères spéciaux', () => {
            process.env['VAR_WITH-DASH'] = 'special-value';
            const result = (0, index_1.getEnv)('VAR_WITH-DASH');
            expect(result).toBe('special-value');
        });
    });
});
