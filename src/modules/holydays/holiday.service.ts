import { HolidayModel, type IHoliday, type HolidayType } from './holiday.model.js';

interface ExternalHoliday {
  fecha: string;
  tipo: HolidayType;
  nombre: string;
}

const API_BASE_URL = 'https://api.argentinadatos.com/v1/feriados';

function isHolidayType(value: unknown): value is HolidayType {
  return value === 'inamovible'
    || value === 'trasladable'
    || value === 'nolaborable'
    || value === 'puente';
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isExternalHoliday(value: unknown): value is ExternalHoliday {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const holiday = value as Record<string, unknown>;
  return typeof holiday.fecha === 'string'
    && isValidDate(holiday.fecha)
    && typeof holiday.nombre === 'string'
    && holiday.nombre.trim().length > 0
    && isHolidayType(holiday.tipo);
}

export async function getHolidaysByYear(
  year: number,
  forceRefresh = false
): Promise<IHoliday[]> {
  if (!forceRefresh) {
    const cached = await HolidayModel.find({ year }).sort({ date: 1 }).lean<IHoliday[]>();
    if (cached.length > 0) {
      return cached;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}/${year}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status} al consultar feriados`);
    }

    const responseData: unknown = await response.json();
    if (!Array.isArray(responseData)) {
      throw new Error('La respuesta del servicio de feriados no tiene un formato válido');
    }

    const data: ExternalHoliday[] = responseData.map((item: unknown) => {
      if (!isExternalHoliday(item) || !item.fecha.startsWith(`${year}-`)) {
        throw new Error('El servicio de feriados devolvió un registro inválido');
      }

      return item;
    });

    if (data.length === 0) {
      return [];
    }

    const operations = data.map((item) => ({
      updateOne: {
        filter: { year, date: item.fecha },
        update: {
          $set: {
            date: item.fecha,
            year,
            name: item.nombre,
            type: item.tipo,
          },
        },
        upsert: true,
      },
    }));

    await HolidayModel.bulkWrite(operations);

    return HolidayModel.find({ year }).sort({ date: 1 }).lean<IHoliday[]>();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function isNationalHoliday(dateStr: string): Promise<IHoliday | null> {
  if (!isValidDate(dateStr)) {
    return null;
  }

  const year = Number(dateStr.slice(0, 4));

  let holiday = await HolidayModel.findOne({ date: dateStr }).lean<IHoliday | null>();
  if (!holiday) {
    await getHolidaysByYear(year);
    holiday = await HolidayModel.findOne({ date: dateStr }).lean<IHoliday | null>();
  }

  return holiday;
}