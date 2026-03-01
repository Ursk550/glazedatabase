// Materials repository - CRUD operations for materials
import { db } from './db';
import type { Material } from './materialTypes';
import defaultMaterials from './defaultMaterials.json';

export class MaterialsRepo {
  // Initialize database with default materials if empty
  static async initializeDefaultMaterials(): Promise<void> {
    const count = await db.materials.count();
    if (count === 0) {
      await db.materials.bulkAdd(defaultMaterials as Material[]);
    }
  }

  // Get all materials
  static async getAll(): Promise<Material[]> {
    return await db.materials.toArray();
  }

  // Get material by ID
  static async getById(id: number): Promise<Material | undefined> {
    return await db.materials.get(id);
  }

  // Get material by name
  static async getByName(name: string): Promise<Material | undefined> {
    return await db.materials.where('name').equals(name).first();
  }

  // Create new material
  static async create(material: Material): Promise<number> {
    return await db.materials.add(material);
  }

  // Update material
  static async update(id: number, material: Partial<Material>): Promise<number> {
    return await db.materials.update(id, material);
  }

  // Delete material
  static async delete(id: number): Promise<void> {
    await db.materials.delete(id);
  }

  // Search materials by name
  static async search(query: string): Promise<Material[]> {
    const allMaterials = await db.materials.toArray();
    return allMaterials.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Import materials from JSON
  static async importMaterials(materials: Material[]): Promise<void> {
    await db.materials.bulkAdd(materials);
  }

  // Export all materials to JSON
  static async exportMaterials(): Promise<Material[]> {
    return await db.materials.toArray();
  }
}
