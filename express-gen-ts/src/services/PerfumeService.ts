// src/services/wineService.ts
import exp from 'constants';
import Perfume from '../models/Perfume'; // Importa el modelo de Mongoose
import { IPerfume } from '../models/Perfume'; // Importa la interfaz
import { addWineSheet, deleteWineSheet, exportAllWinesToSheets, updateWineSheet } from './googleSheetsService';

async function exportToSheet(): Promise<void> {
  try {
      const wines = await Perfume.find(); // Obtener todos los vinos de la base de datos

      if (wines.length === 0) {
          throw new Error('No hay vinos disponibles para exportar.');
      }

      await exportAllWinesToSheets(wines); // Exporta todos los vinos a Google Sheets
  } catch (error) {
      throw new Error(`Error al exportar los vinos a Google Sheets: ${error.message}`);
  }
}

// Crear un nuevo vino
async function addWine(wineData: Partial<IPerfume>): Promise<IPerfume> {
    try {
  
      const newWine = new Wine(wineData); // Crea una nueva instancia del modelo Wine
      const savedWine = await newWine.save(); // Guarda en la base de datos
  
      // Agrega el vino a Google Sheets
      await addWineSheet([savedWine]); // Pasa el vino guardado como un array
  
      return savedWine;
    } catch (error) {
      throw new Error(`Error al crear el vino: ${error.message}`);
    }
  }

// Obtener todos los vinos
async function getAllWines(): Promise<IWine[]> {
  try {
    return Perfume.find(); // Obtener todos los documentos del modelo Wine
  } catch (error) {
    throw new Error(`Error al obtener los vinos: ${error.message}`);
  }
}

// Obtener un vino por su SKU
async function getWineBySKU(SKU: string): Promise<IWine | null> {
  try {
    return Wine.findOne({ SKU }); // Buscar un vino por SKU
  } catch (error) {
    throw new Error(`Error al obtener el vino: ${error.message}`);
  }
}

// Actualizar un vino por su SKU
async function updateWineBySKU(SKU: string, updateData: Partial<IWine>): Promise<IWine | null> {
    try {  
      const updatedWine = await Wine.findOneAndUpdate({ SKU }, updateData, { new: true }); // Actualizar y devolver el documento actualizado
  
      if (updatedWine) {
        // Actualiza en Google Sheets
        await updateWineSheet(updatedWine);
        return updatedWine;
      }
      return null; // Retorna null si no se encontró el vino
    } catch (error) {
      throw new Error(`Error al actualizar el vino: ${error.message}`);
    }
  }

// Eliminar un vino por su SKU
async function deleteWineBySKU(SKU: string): Promise<IWine | null> {
  try {
    const deletedWine = await Wine.findOneAndDelete({ SKU }); // Eliminar un vino por su SKU
    
    if (deletedWine) {
      // Eliminar el vino de Google Sheets
      await deleteWineSheet(SKU); // Eliminar el vino de Google Sheets
    }
 
    return deletedWine;
  } catch (error) {
    throw new Error(`Error al eliminar el vino: ${error.message}`);
  }
}

export default {
    exportToSheet,
    getAllWines,
    getWineBySKU,
    addWine,
    updateWineBySKU,
    deleteWineBySKU,
} as const;