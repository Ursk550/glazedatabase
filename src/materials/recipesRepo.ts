// Recipes repository - CRUD operations for recipes
import { db } from './db';
import type { Recipe } from './materialTypes';

export class RecipesRepo {
  // Get all recipes
  static async getAll(): Promise<Recipe[]> {
    return await db.recipes.toArray();
  }

  // Get recipe by ID
  static async getById(id: number): Promise<Recipe | undefined> {
    return await db.recipes.get(id);
  }

  // Create new recipe
  static async create(recipe: Recipe): Promise<number> {
    const now = new Date();
    return await db.recipes.add({
      ...recipe,
      createdAt: now,
      updatedAt: now
    });
  }

  // Update recipe
  static async update(id: number, recipe: Partial<Recipe>): Promise<number> {
    return await db.recipes.update(id, {
      ...recipe,
      updatedAt: new Date()
    });
  }

  // Delete recipe
  static async delete(id: number): Promise<void> {
    await db.recipes.delete(id);
  }

  // Get recipes by firing range
  static async getByFiringRange(firingRange: string): Promise<Recipe[]> {
    return await db.recipes
      .where('firingRange')
      .equals(firingRange)
      .toArray();
  }

  // Search recipes by name
  static async search(query: string): Promise<Recipe[]> {
    const allRecipes = await db.recipes.toArray();
    return allRecipes.filter(r => 
      r.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Import recipes from JSON
  static async importRecipes(recipes: Recipe[]): Promise<void> {
    await db.recipes.bulkAdd(recipes);
  }

  // Export all recipes to JSON
  static async exportRecipes(): Promise<Recipe[]> {
    return await db.recipes.toArray();
  }
}
