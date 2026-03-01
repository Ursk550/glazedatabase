// Database setup with Dexie
import Dexie, { Table } from 'dexie';
import { Material, Recipe, TestLog } from './materialTypes';

export class GlazeDatabaseDB extends Dexie {
  materials!: Table<Material, number>;
  recipes!: Table<Recipe, number>;
  testLogs!: Table<TestLog, number>;

  constructor() {
    super('GlazeDatabaseDB');
    
    this.version(1).stores({
      materials: '++id, name',
      recipes: '++id, name, firingRange, createdAt',
      testLogs: '++id, recipeId, testDate'
    });
  }
}

export const db = new GlazeDatabaseDB();
